/**
 * Jest automatically applies this mock for the `react-native-navigation` node module, because it
 * lives in the root `__mocks__` directory. RNN is a native module, so it cannot run under Jest.
 */
const eventsRegistry = {
  registerAppLaunchedListener: jest.fn(),
  bindComponent: jest.fn(),
  registerComponentDidAppearListener: jest.fn(),
  registerComponentDidDisappearListener: jest.fn(),
};

export const Navigation = {
  events: jest.fn(() => eventsRegistry),
  registerComponent: jest.fn(),
  setRoot: jest.fn(() => Promise.resolve('root')),
  setDefaultOptions: jest.fn(),
  mergeOptions: jest.fn(),
  push: jest.fn(() => Promise.resolve('pushed')),
  pop: jest.fn(() => Promise.resolve('popped')),
};
