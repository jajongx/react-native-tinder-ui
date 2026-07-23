/** @format */
import {LogBox} from 'react-native';
import {Navigation} from 'react-native-navigation';

import registerScreens from 'src/navigator/registerScreens';
import {startApp} from 'src/navigator';

// react-native-image-progress (unmaintained) spreads props and sets `key` on the same JSX element,
// which React 19 warns about. It is internal to the library and harmless; silence the dev-only noise.
LogBox.ignoreLogs(['A props object containing a "key" prop is being spread into JSX']);

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
  startApp();
});
