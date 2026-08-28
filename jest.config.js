module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(ttf|otf|woff|woff2|eot)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-navigation|react-native-reanimated|react-native-worklets|react-native-linear-gradient|react-native-indicators|react-native-image-progress|react-native-progress|@d11)/)',
  ],
};
