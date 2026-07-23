import React, {ReactNode} from 'react';
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
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'ProximaNova-Regular',
    fontSize: 12,
    color: 'white',
    marginLeft: 3,
  },
});

const hitSlop = {left: 10, right: 10, top: 10, bottom: 10};

interface SimpleImageButtonProps {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  title?: string;
  icon?: ReactNode;
}

export function SimpleImageButton({
  style,
  textStyle,
  onPress,
  title,
  icon,
}: SimpleImageButtonProps) {
  return (
    <TouchableOpacity
      disabled={!onPress}
      style={[styles.container, style]}
      onPress={onPress}
      hitSlop={hitSlop}>
      {icon}
      {!!title && (
        <Text
          allowFontScaling={false}
          style={[styles.text, textStyle, {paddingRight: icon ? 3 : 0}]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
