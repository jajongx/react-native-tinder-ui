import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {Colors} from 'src/theme';
import {NAVBAR_HEIGHT, STATUSBAR_HEIGHT} from 'src/constants';
import {IBMPlexSansBold} from 'src/fonts';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        paddingTop: STATUSBAR_HEIGHT,
        height: NAVBAR_HEIGHT + STATUSBAR_HEIGHT,
      },
      android: {
        height: NAVBAR_HEIGHT,
      },
    }),
    overflow: 'visible',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 31,
    backgroundColor: Colors.white,
  },
  title: {
    color: Colors.gableGreen,
    fontSize: 18,
  },
  gap: {
    width: 20,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  buttonText: {
    fontSize: 16,
  },
  titleView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    ...Platform.select({
      ios: {top: STATUSBAR_HEIGHT},
    }),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const hitSlop = {left: 10, right: 10, top: 10, bottom: 10};

type Action = (() => void) | undefined;

/** The original had four near-identical renderers; these two cover all four cases. */
function NavBarTextButton({action, text}: {action: Action; text?: string}) {
  if (!action && !text) {
    return <View style={styles.gap} />;
  }

  return (
    <TouchableOpacity disabled={!action} onPress={action} hitSlop={hitSlop}>
      <IBMPlexSansBold
        style={[
          styles.buttonText,
          {color: action ? Colors.burntSienna : Colors.geyser},
        ]}>
        {text}
      </IBMPlexSansBold>
    </TouchableOpacity>
  );
}

function NavBarIconButton({
  action,
  icon,
}: {
  action: Action;
  icon?: ImageSourcePropType;
}) {
  if (!action && !icon) {
    return <View style={styles.gap} />;
  }

  return (
    <TouchableOpacity disabled={!action} onPress={action} hitSlop={hitSlop}>
      <Image
        source={icon!}
        style={[
          styles.icon,
          {tintColor: action ? Colors.burntSienna : Colors.geyser},
        ]}
      />
    </TouchableOpacity>
  );
}

interface SimpleNavBarProps {
  title?: string;
  leftAction?: () => void;
  leftText?: string;
  leftIcon?: ImageSourcePropType;
  rightAction?: () => void;
  rightIcon?: ImageSourcePropType;
  rightText?: string;
  backgroundColor?: string;
}

export function SimpleNavBar({
  title,
  leftAction,
  leftText,
  leftIcon,
  rightAction,
  rightIcon,
  rightText,
  backgroundColor = Colors.white,
}: SimpleNavBarProps) {
  return (
    <View style={[styles.container, {backgroundColor}]}>
      <View style={styles.titleView}>
        <IBMPlexSansBold style={styles.title}>{title}</IBMPlexSansBold>
      </View>
      {leftText ? (
        <NavBarTextButton action={leftAction} text={leftText} />
      ) : (
        <NavBarIconButton action={leftAction} icon={leftIcon} />
      )}
      {rightText ? (
        <NavBarTextButton action={rightAction} text={rightText} />
      ) : (
        <NavBarIconButton action={rightAction} icon={rightIcon} />
      )}
    </View>
  );
}
