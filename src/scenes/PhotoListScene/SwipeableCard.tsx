import React, {forwardRef, useImperativeHandle, useMemo} from 'react';
import {PanResponder, StyleSheet} from 'react-native';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {WINDOW_WIDTH} from 'src/constants';
import {MyMarView} from 'src/components';
import type {ApodItem} from 'src/types';

const CARD_PADDING = 16;
const CARD_PHOTO_WIDTH = WINDOW_WIDTH - CARD_PADDING * 2;
const SWIPE_DISTANCE = WINDOW_WIDTH / 3;
const MAX_DEPTH = 2;
const DURATION = 300;

/**
 * The original animated `left`/`width`/`top`/`bottom` -- layout props the native driver cannot
 * drive, which is why it crashed on modern RN. The same stacked-deck effect is expressed here as
 * `scale` + `translateY`, both of which the Reanimated compositor can animate off the JS thread.
 *
 * Gestures come from RN's built-in PanResponder rather than react-native-gesture-handler: the
 * latter's C++ codegen produces object-file paths that exceed the Windows 260-char limit inside
 * ninja, which cannot be worked around without patching the library. PanResponder writes straight
 * into the same Reanimated shared values, so the animations still run in the compositor -- only
 * the raw touch tracking is on the JS thread.
 *
 * Not pixel-identical to the old version: the original shrank width only (height was constant),
 * whereas a uniform scale shrinks both axes.
 */
const SCALE_STEP = (CARD_PADDING * 2) / CARD_PHOTO_WIDTH;
const TRANSLATE_STEP = CARD_PADDING;

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: CARD_PADDING * 3,
    bottom: 0,
  },
});

export interface SwipeableCardHandle {
  pop: (liked: boolean, onComplete?: () => void) => void;
  reset: (onComplete?: () => void) => void;
  moveForward: () => void;
  moveBackward: () => void;
}

interface SwipeableCardProps {
  index: number;
  source: ApodItem;
  /** Shared with the parent so the like/dislike buttons can react without a JS round-trip. */
  swipeX: SharedValue<number>;
  onPop: (liked: boolean, index: number) => void;
}

const SwipeableCard = forwardRef<SwipeableCardHandle, SwipeableCardProps>(
  ({index, source, swipeX, onPop}, ref) => {
    const translateX = useSharedValue(0);
    const depth = useSharedValue(Math.min(index, MAX_DEPTH));

    const animateOut = (liked: boolean, onComplete?: () => void) => {
      translateX.value = withTiming(
        WINDOW_WIDTH * (liked ? 1 : -1),
        {duration: DURATION},
        finished => {
          if (finished) {
            runOnJS(onPop)(liked, index);
            if (onComplete) {
              runOnJS(onComplete)();
            }
          }
        },
      );
      swipeX.value = withTiming(0, {duration: DURATION});
    };

    useImperativeHandle(ref, () => ({
      pop: animateOut,
      reset: onComplete => {
        translateX.value = withTiming(0, {duration: DURATION}, finished => {
          if (finished && onComplete) {
            runOnJS(onComplete)();
          }
        });
        swipeX.value = withTiming(0, {duration: DURATION});
      },
      moveForward: () => {
        depth.value = withTiming(Math.max(depth.value - 1, 0), {
          duration: DURATION,
        });
      },
      moveBackward: () => {
        if (depth.value >= MAX_DEPTH) {
          return;
        }
        depth.value = withTiming(Math.min(depth.value + 1, MAX_DEPTH), {
          duration: DURATION,
        });
      },
    }));

    const panResponder = useMemo(
      () =>
        PanResponder.create({
          onMoveShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponderCapture: () => true,
          onPanResponderMove: (_evt, gesture) => {
            translateX.value = gesture.dx;
            swipeX.value = gesture.dx;
          },
          onPanResponderRelease: (_evt, gesture) => {
            if (Math.abs(gesture.dx) >= SWIPE_DISTANCE) {
              animateOut(gesture.dx > 0);
            } else {
              translateX.value = withTiming(0, {duration: DURATION});
              swipeX.value = withTiming(0, {duration: DURATION});
            }
          },
        }),
      // Shared values and index are stable for the life of the component.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        {translateX: translateX.value},
        {translateY: -depth.value * TRANSLATE_STEP},
        {scale: 1 - depth.value * SCALE_STEP},
      ],
    }));

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.card, {zIndex: 99 - index}, animatedStyle]}>
        <MyMarView dataSource={source} />
      </Animated.View>
    );
  },
);

SwipeableCard.displayName = 'SwipeableCard';

export default SwipeableCard;
