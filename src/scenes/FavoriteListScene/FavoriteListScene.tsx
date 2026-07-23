import React, {useCallback} from 'react';
import {FlatList, ListRenderItemInfo, StyleSheet, View} from 'react-native';
import {Navigation} from 'react-native-navigation';

import {SimpleNavBar, MyMarView} from 'src/components';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'src/constants';
import type {ApodItem} from 'src/types';

const ITEM_WIDTH = WINDOW_WIDTH * 0.8;
// MyMarView's root is absolutely positioned, so it contributes no intrinsic height. The item
// wrapper must be explicitly sized or it collapses to zero and nothing renders.
const ITEM_HEIGHT = WINDOW_HEIGHT * 0.72;
const SIDE_PADDING = (WINDOW_WIDTH - ITEM_WIDTH) / 2;

const styles = StyleSheet.create({
  container: {flex: 1},
  list: {
    paddingBottom: 48,
    paddingTop: 36,
  },
  listContent: {
    // Keeps the first and last card centred, which the old carousel did internally.
    paddingHorizontal: SIDE_PADDING,
  },
  item: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
  },
});

interface FavoriteListSceneProps {
  componentId: string;
  favoriteCards?: ApodItem[];
}

export default function FavoriteListScene({
  componentId,
  favoriteCards = [],
}: FavoriteListSceneProps) {
  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<ApodItem>) => (
      <View style={styles.item}>
        <MyMarView dataSource={item} />
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <SimpleNavBar
        title="Favorites"
        leftText="Back"
        leftAction={() => Navigation.pop(componentId)}
      />
      {/*
        Replaces react-native-snap-carousel, which was last published in 2022 and still depends on
        React-15-era packages. Only data/renderItem/sliderWidth/itemWidth were ever used, so a
        snapping FlatList is equivalent.
      */}
      <FlatList
        horizontal
        data={favoriteCards}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.explanation ?? String(index)}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        snapToInterval={ITEM_WIDTH}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
