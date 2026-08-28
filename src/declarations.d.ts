/** react-native-indicators ships no TypeScript definitions. */
declare module 'react-native-indicators' {
  import {ComponentType} from 'react';
  import {ViewProps} from 'react-native';

  export interface IndicatorProps extends ViewProps {
    animating?: boolean;
    color?: string;
    count?: number;
    size?: number;
    animationDuration?: number;
    hidesWhenStopped?: boolean;
  }

  export const MaterialIndicator: ComponentType<IndicatorProps>;
  export const UIActivityIndicator: ComponentType<IndicatorProps>;
  export const BallIndicator: ComponentType<IndicatorProps>;
  export const BarIndicator: ComponentType<IndicatorProps>;
  export const DotIndicator: ComponentType<IndicatorProps>;
  export const PacmanIndicator: ComponentType<IndicatorProps>;
  export const PulseIndicator: ComponentType<IndicatorProps>;
  export const SkypeIndicator: ComponentType<IndicatorProps>;
  export const WaveIndicator: ComponentType<IndicatorProps>;
}

/** react-native-image-progress ships no TypeScript definitions. */
declare module 'react-native-image-progress' {
  import {ComponentType} from 'react';

  export function createImageProgress<P>(
    ImageComponent: ComponentType<P>,
  ): ComponentType<
    P & {
      indicator?: unknown;
      indicatorProps?: Record<string, unknown>;
      threshold?: number;
      imageStyle?: unknown;
      renderIndicator?: (progress: number, indeterminate: boolean) => unknown;
      renderError?: (error: Error) => unknown;
    }
  >;

  const ImageProgress: ComponentType<Record<string, unknown>>;
  export default ImageProgress;
}
