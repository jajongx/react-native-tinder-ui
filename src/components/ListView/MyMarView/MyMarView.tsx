import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

import {IBMPlexSansMedium, IBMPlexSansRegular} from 'src/fonts';
import {Colors} from 'src/theme';
import type {ApodItem} from 'src/types';
// Imported directly rather than through the `src/components` barrel, which would be circular.
import {CachedImageBackground} from '../../ImageView';

const styles = StyleSheet.create({
  card: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 10,
    borderRadius: 8,
  },
  gradient: {
    ...StyleSheet.absoluteFill,
    borderRadius: 8,
  },
  title: {
    color: Colors.white,
    fontSize: 20,
    marginHorizontal: 32,
    marginTop: 32,
  },
  explanation: {
    color: Colors.white,
    marginHorizontal: 32,
    fontSize: 14,
  },
});

const gradientLocations = [0, 0.3, 0.7, 1];
const gradientColors = [
  'rgba(0, 0, 0, 0.8)',
  'rgba(0, 0, 0, 0)',
  'rgba(0, 0, 0, 0)',
  'rgba(0, 0, 0, 0.3)',
];

interface MyMarViewProps {
  dataSource: ApodItem;
}

export function MyMarView({dataSource}: MyMarViewProps) {
  const [finishedLoading, setFinishedLoading] = useState(false);

  return (
    <CachedImageBackground
      source={{uri: dataSource?.url}}
      style={styles.card}
      resizeMode="cover"
      borderRadius={8}
      onLoadEnd={() => setFinishedLoading(true)}>
      {finishedLoading && (
        <LinearGradient
          style={styles.gradient}
          locations={gradientLocations}
          colors={gradientColors}
        />
      )}
      {finishedLoading && (
        <View>
          <IBMPlexSansMedium style={styles.title} numberOfLines={2}>
            {dataSource?.title ?? 'No title'}
          </IBMPlexSansMedium>
          <IBMPlexSansRegular numberOfLines={2} style={styles.explanation}>
            {dataSource?.explanation}
          </IBMPlexSansRegular>
          <IBMPlexSansRegular style={styles.explanation}>
            {moment(dataSource?.date, 'YYYY-MM-DD').format('MMM DD, YYYY')}
          </IBMPlexSansRegular>
        </View>
      )}
    </CachedImageBackground>
  );
}
