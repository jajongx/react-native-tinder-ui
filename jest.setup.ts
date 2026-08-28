/* eslint-env jest */

// Reanimated's mock replaces the worklet runtime, which cannot run under Jest.
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

// Native modules with no JS implementation under test. createElement is used rather than JSX so
// this file can stay a plain .ts setup module.
jest.mock('@d11/react-native-fast-image', () => {
  const React = require('react');
  const {View} = require('react-native');
  const MockFastImage = (props: Record<string, unknown>) =>
    React.createElement(View, props);
  MockFastImage.preload = jest.fn();
  MockFastImage.resizeMode = {contain: 'contain', cover: 'cover'};
  return {__esModule: true, default: MockFastImage};
});

jest.mock('react-native-linear-gradient', () => {
  const {View} = require('react-native');
  return {__esModule: true, default: View};
});
