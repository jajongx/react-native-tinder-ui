// registerScreens is deliberately NOT re-exported here: it imports every scene, and the scenes
// import from this barrel, which would make `src/navigator` circular. Import it directly from
// './registerScreens' (see index.js).
export {startApp} from './Navigator';
export * from './constants';
