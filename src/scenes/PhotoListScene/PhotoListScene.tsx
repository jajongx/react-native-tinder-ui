import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import axios from 'axios';
import {MaterialIndicator} from 'react-native-indicators';

import {SimpleNavBar} from 'src/components';
import {IBMPlexSansMedium, IBMPlexSansRegular} from 'src/fonts';
import {Colors} from 'src/theme';
import {NASA_API_KEY, NASA_APOD_URL} from 'src/constants';
import {FAVORITE_LIST_SCENE} from 'src/navigator';
import type {ApodItem} from 'src/types';
import SwipeableCardView, {
  ReviewedCard,
  SwipeableCardViewHandle,
} from './SwipeableCardView';

const CARD_COUNT = 10;

const styles = StyleSheet.create({
  flex: {flex: 1},
  cardArea: {
    flex: 1,
    zIndex: 10,
    paddingHorizontal: 16,
  },
  countLabel: {
    fontSize: 14,
    color: Colors.rollingStone,
    height: 56,
    lineHeight: 56,
    textAlign: 'center',
  },
  noCardView: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCardLabel: {
    fontSize: 16,
    color: Colors.rollingStone,
  },
});

const heartIcon = require('assets/icons/ic_heart.png');

interface PhotoListSceneProps {
  componentId: string;
}

export default function PhotoListScene({componentId}: PhotoListSceneProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [cardSource, setCardSource] = useState<ApodItem[]>([]);
  const [reviewedCards, setReviewedCards] = useState<ReviewedCard[]>([]);

  const cardView = useRef<SwipeableCardViewHandle>(null);

  useEffect(() => {
    let cancelled = false;

    axios
      .get<ApodItem[]>(NASA_APOD_URL, {
        params: {api_key: NASA_API_KEY, count: CARD_COUNT},
      })
      .then(res => {
        if (!cancelled) {
          setCardSource(res.data);
        }
      })
      .catch(e => console.warn('Failed to load APOD data:', e?.message ?? e))
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const routeToFavorites = useCallback(() => {
    Navigation.push(componentId, {
      component: {
        name: FAVORITE_LIST_SCENE,
        passProps: {
          favoriteCards: reviewedCards.filter(c => c.liked),
        },
      },
    });
  }, [componentId, reviewedCards]);

  const renderCardView = () => {
    if (isLoading) {
      return <MaterialIndicator color={Colors.burntSienna} />;
    }

    const noCards =
      cardSource.length === 0 || reviewedCards.length === cardSource.length;

    return (
      <View style={styles.flex}>
        <SwipeableCardView
          ref={cardView}
          cards={cardSource}
          onPop={setReviewedCards}
        />
        {noCards && (
          <View style={styles.noCardView}>
            <IBMPlexSansMedium style={styles.noCardLabel}>
              No available cards
            </IBMPlexSansMedium>
          </View>
        )}
      </View>
    );
  };

  const disabledUndoAction = isLoading || reviewedCards.length === 0;

  return (
    <View style={styles.flex}>
      <SimpleNavBar
        title="My Mars"
        leftText="Undo"
        leftAction={
          disabledUndoAction ? undefined : () => cardView.current?.undo()
        }
        rightIcon={heartIcon}
        rightAction={isLoading ? undefined : routeToFavorites}
      />
      <View style={styles.cardArea}>{renderCardView()}</View>
      <IBMPlexSansRegular style={styles.countLabel}>
        {isLoading
          ? 'Downloading'
          : `${cardSource.length - reviewedCards.length} cards`}
      </IBMPlexSansRegular>
    </View>
  );
}
