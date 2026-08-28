import {Navigation} from 'react-native-navigation';

import {PHOTO_LIST_SCENE} from './constants';

export function startApp() {
  Navigation.setDefaultOptions({
    topBar: {
      visible: false,
      drawBehind: true,
    },
    statusBar: {
      style: 'dark',
    },
    layout: {
      orientation: ['portrait'],
    },
  });

  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: PHOTO_LIST_SCENE,
            },
          },
        ],
      },
    },
  });
}
