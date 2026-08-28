import React from 'react';
import {StyleSheet, Text, TextProps} from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'IBMPlexSans-Bold',
  },
});

export function IBMPlexSansBold({style, ...props}: TextProps) {
  return <Text allowFontScaling={false} {...props} style={[styles.text, style]} />;
}
