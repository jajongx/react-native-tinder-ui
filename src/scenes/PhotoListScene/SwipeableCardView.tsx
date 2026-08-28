import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import FastImage from '@d11/react-native-fast-image';

import {WINDOW_WIDTH} from 'src/constants';
import type {ApodItem} from 'src/types';
import SwipeableCard, {SwipeableCardHandle} from './SwipeableCard';

const ButtonSpacing = (WINDOW_WIDTH - 56 * 2) / 4;
const SwipeDistance = WINDOW_WIDTH / 3;
const INITIAL_RENDERED_CARDS = 4;

const styles = StyleSheet.create({
  flex: {flex: 1},
  photoList: {flex: 1},
  buttons: {
    position: 'absolute',
    height: 56,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: ButtonSpacing,
    justifyContent: 'space-between',
    bottom: -28,
  },
  actionButtonIcon: {
    width: 56,
    height: 56,
  },
});

export interface ReviewedCard extends ApodItem {
  liked: boolean;
  cardIndex: number;
}

export interface SwipeableCardViewHandle {
  undo: () => void;
  pop: (liked: boolean) => void;
}

interface SwipeableCardViewProps {
  cards?: ApodItem[];
  onPop: (reviewedCards: ReviewedCard[]) => void;
}

function preloadFrom(cards: ApodItem[], startIndex: number) {
  if (cards.length <= startIndex) {
    return;
  }
  FastImage.preload(cards.slice(startIndex).map(c => ({uri: c.url})));
}

const SwipeableCardView = forwardRef<
  SwipeableCardViewHandle,
  SwipeableCardViewProps
>(({cards = [], onPop}, ref) => {
  const [reviewedCards, setReviewedCards] = useState<ReviewedCard[]>([]);
  const [renderedCardIndexes, setRenderedCardIndexes] = useState<number[]>(() =>
    cards.map((_, i) => i).slice(0, INITIAL_RENDERED_CARDS),
  );

  const cardRefs = useRef<(SwipeableCardHandle | null)[]>([]);
  const processingCard = useRef(false);

  // Drives the like/dislike button feedback straight from the gesture on the UI thread,
  // replacing the old per-frame onSwipe callback into JS.
  const swipeX = useSharedValue(0);

  // The original copied `props.cards` into state in the constructor and never resynced, so a
  // refetch by the parent was silently ignored. Track the incoming prop instead.
  useEffect(() => {
    setReviewedCards([]);
    setRenderedCardIndexes(
      cards.map((_, i) => i).slice(0, INITIAL_RENDERED_CARDS),
    );
    cardRefs.current = [];
    preloadFrom(cards, INITIAL_RENDERED_CARDS);
  }, [cards]);

  const popCard = useCallback(
    (liked: boolean, cardIndex: number) => {
      const poppedCard: ReviewedCard = {
        ...cards[cardIndex],
        liked,
        cardIndex,
      };

      // Zoom in and move up the cards stacked behind the reviewed one
      for (let i = cardIndex + 1; i < cardIndex + 3; i += 1) {
        cardRefs.current[i]?.moveForward();
      }

      setReviewedCards(prev => {
        const next = [...prev, poppedCard];
        onPop(next);
        return next;
      });

      // Pre-render a new card behind the 3rd one
      setRenderedCardIndexes(prev =>
        prev.length <= cardIndex + INITIAL_RENDERED_CARDS &&
        cards.length > cardIndex + INITIAL_RENDERED_CARDS
          ? [...prev, cardIndex + INITIAL_RENDERED_CARDS]
          : prev,
      );

      preloadFrom(cards, cardIndex + 1);
    },
    [cards, onPop],
  );

  /** Pops the top-most unreviewed card. Used by the like/dislike buttons and by the parent. */
  const popTopCard = useCallback(
    (liked: boolean) => {
      if (processingCard.current) {
        return;
      }
      processingCard.current = true;
      cardRefs.current[reviewedCards.length]?.pop(liked, () => {
        processingCard.current = false;
      });
    },
    [reviewedCards.length],
  );

  const undo = useCallback(() => {
    if (processingCard.current || reviewedCards.length === 0) {
      return;
    }
    processingCard.current = true;

    const tempCards = [...reviewedCards];
    const cardWillUndo = tempCards.pop()!;

    cardRefs.current[cardWillUndo.cardIndex]?.reset(() => {
      // Zoom out and push back the currently visible cards
      for (
        let i = cardWillUndo.cardIndex + 1;
        i < cardRefs.current.length;
        i += 1
      ) {
        cardRefs.current[i]?.moveBackward();
      }
      setReviewedCards(tempCards);
      onPop(tempCards);
      processingCard.current = false;
    });
  }, [onPop, reviewedCards]);

  useImperativeHandle(ref, () => ({undo, pop: popTopCard}), [undo, popTopCard]);

  const likeButtonStyle = useAnimatedStyle(() => {
    const dx = swipeX.value;
    const magnitude = Math.abs(dx) / SwipeDistance / 2;
    return {
      opacity: dx >= 0 ? 1 : Math.max(1 - magnitude, 0.2),
      transform: [{scale: dx <= 0 ? 1 : Math.min(1 + magnitude, 1.3)}],
    };
  });

  const unlikeButtonStyle = useAnimatedStyle(() => {
    const dx = swipeX.value;
    const magnitude = Math.abs(dx) / SwipeDistance / 2;
    return {
      opacity: dx <= 0 ? 1 : Math.max(1 - magnitude, 0.2),
      transform: [{scale: dx >= 0 ? 1 : Math.min(1 + magnitude, 1.3)}],
    };
  });

  const noCards = useMemo(
    () => cards.length === 0 || reviewedCards.length === cards.length,
    [cards.length, reviewedCards.length],
  );

  return (
    <View style={styles.photoList}>
      <View style={styles.flex}>
        {renderedCardIndexes.map(index => (
          <SwipeableCard
            ref={instance => {
              cardRefs.current[index] = instance;
            }}
            key={cards[index]?.explanation ?? index}
            source={cards[index]}
            index={index}
            swipeX={swipeX}
            onPop={popCard}
          />
        ))}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity disabled={noCards} onPress={() => popTopCard(false)}>
          <Animated.Image
            style={[styles.actionButtonIcon, unlikeButtonStyle]}
            source={require('assets/icons/ic_dislike.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity disabled={noCards} onPress={() => popTopCard(true)}>
          <Animated.Image
            style={[styles.actionButtonIcon, likeButtonStyle]}
            source={require('assets/icons/ic_like.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});

SwipeableCardView.displayName = 'SwipeableCardView';

export default SwipeableCardView;
