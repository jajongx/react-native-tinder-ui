import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: 'black',
    backgroundColor: 'transparent',
  },
});

const hitSlop = {left: 20, right: 20, top: 20, bottom: 20};

interface SimpleButtonProps {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  text?: string;
}

export function SimpleButton({
  style,
  text = '',
  onPress,
  textStyle,
}: SimpleButtonProps) {
  return (
    <TouchableOpacity
      disabled={!onPress}
      style={[styles.container, style]}
      onPress={onPress}
      hitSlop={hitSlop}>
      <Text
        allowFontScaling={false}
        style={[styles.text, textStyle, {opacity: onPress ? 1 : 0.5}]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
