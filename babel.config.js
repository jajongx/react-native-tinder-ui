module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Replaces the old Haste `src/package.json` name trick, which modern Metro no longer
    // supports. Keep these aliases in sync with `paths` in tsconfig.json.
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          src: './src',
          assets: './src/assets',
        },
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
          '.png',
        ],
      },
    ],
    // Reanimated 4 moved its babel plugin into react-native-worklets
    // (react-native-reanimated/plugin is now just a re-export). It MUST be listed last.
    'react-native-worklets/plugin',
  ],
};
