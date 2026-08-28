# MyMars — React Native Tinder UI

A Tinder-style swipeable-card UI that browses NASA's Astronomy Picture of the Day. Swipe right to
like, left to dislike, undo the last action, and review liked cards in a snapping carousel.

# Screenshots

<div>
<img width="250" height="450" style="float: left" src="https://github.com/jajongx/react-native-tinder-ui/blob/master/screenshot.gif" />
<img width="250" height="450" style="float: left" src="https://github.com/jajongx/react-native-tinder-ui/blob/master/image1.png" />
<img width="250" height="450" style="float: left" src="https://github.com/jajongx/react-native-tinder-ui/blob/master/image2.png" />
</div>

## Stack

- [React Native 0.85](https://reactnative.dev/) — New Architecture (bridgeless)
- [React Native Navigation 8](https://wix.github.io/react-native-navigation/) — native navigation
- [React Native Reanimated 4](https://docs.swmansion.com/react-native-reanimated/) — swipe/stack animations
- [TypeScript](https://www.typescriptlang.org/), [ESLint](https://eslint.org/), [Jest](https://jestjs.io/)
- [axios](https://axios-http.com/) — NASA APOD API client
- [@d11/react-native-fast-image](https://github.com/dream11/react-native-fast-image) — image caching
- [react-native-linear-gradient](https://github.com/react-native-linear-gradient/react-native-linear-gradient), [react-native-progress](https://github.com/oblador/react-native-progress), [react-native-indicators](https://github.com/n4kz/react-native-indicators)

## Requirements

- [Node](https://nodejs.org) >= 22.11
- **JDK 17** for the Android build. A newer JDK (e.g. 26) fails — its `jlink` cannot process
  Android's `core-for-system-modules.jar`. On Windows, check the **user** `JAVA_HOME`, which wins
  over the machine one.
- [Xcode](https://developer.apple.com/xcode/) + [CocoaPods](https://cocoapods.org/) for iOS

## Getting started

```shell
$ npm install --legacy-peer-deps
$ npm run android      # or: npm run ios  (after `npm run pods`)
```

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start Metro |
| `npm run android` / `npm run ios` | Build and run |
| `npm test` | Jest |
| `npm run lint` | ESLint |
| `npm run tsc` | TypeScript check |

## Notes

- The swipe gesture uses RN's built-in `PanResponder` (not react-native-gesture-handler): on
  Windows, gesture-handler's C++ codegen produces object-file paths beyond the 260-char limit that
  the Android SDK's bundled `ninja` enforces regardless of the OS long-path setting. The card
  stack/pop animations still run through Reanimated.
- The NASA API key in `src/constants/constants.ts` is a shared demo key with tight rate limits;
  replace it with your own from [api.nasa.gov](https://api.nasa.gov/).
