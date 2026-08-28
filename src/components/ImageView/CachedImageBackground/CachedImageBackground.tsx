import React, {ReactNode} from 'react';
import {ImageStyle, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import * as Progress from 'react-native-progress';

import {Colors} from 'src/theme';
import {MSImageView} from '../MSImageView';

const indicatorProps = {
  size: 35,
  thickness: 1,
  borderWidth: 0,
  color: Colors.burntSienna,
};

interface CachedImageBackgroundProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  source?: {uri?: string};
  resizeMode?: string;
  borderRadius?: number;
  onLoadEnd?: () => void;
}

export function CachedImageBackground({
  children,
  style,
  imageStyle,
  ...props
}: CachedImageBackgroundProps) {
  const flattened = StyleSheet.flatten(style) ?? {};

  return (
    <View style={style}>
      <MSImageView
        style={[
          StyleSheet.absoluteFill,
          {width: flattened.width, height: flattened.height},
          imageStyle,
        ]}
        indicator={Progress.Circle}
        indicatorProps={indicatorProps}
        {...props}
        threshold={50}
      />
      {children}
    </View>
  );
}
