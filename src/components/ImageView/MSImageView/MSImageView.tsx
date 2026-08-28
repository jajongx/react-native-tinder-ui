import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from 'react-native';
import {createImageProgress} from 'react-native-image-progress';
import FastImage from '@d11/react-native-fast-image';

const RNFastImage = createImageProgress(FastImage);

export interface MSImageViewProps {
  source?: {uri?: string} | ImageSourcePropType;
  placeholder?: ImageSourcePropType;
  onLoadEnd?: () => void;
  style?: StyleProp<ImageStyle>;
  resizeMode?: string;
  borderRadius?: number;
  // react-native-image-progress extras
  indicator?: unknown;
  indicatorProps?: Record<string, unknown>;
  threshold?: number;
}

function getUri(source: MSImageViewProps['source']): string | undefined {
  if (source && typeof source === 'object' && 'uri' in source) {
    return source.uri;
  }
  return undefined;
}

/**
 * Renders a remote image through FastImage, falling back to `placeholder` when the source is
 * missing or fails to load. Local (non-http) sources bypass FastImage entirely.
 */
export function MSImageView(props: MSImageViewProps) {
  const {source, placeholder, onLoadEnd} = props;
  const uri = getUri(source);

  const [isLoadingFailed, setIsLoadingFailed] = useState(false);

  // Replaces componentWillReceiveProps + lodash isEqual: reset the failure flag whenever the
  // source actually changes.
  useEffect(() => {
    setIsLoadingFailed(false);
  }, [uri]);

  // react-native-image-progress has no real types, so the remaining props are forwarded loosely.
  const passthrough = props as Record<string, unknown>;

  if (isLoadingFailed || !uri) {
    return <Image {...passthrough} source={placeholder} />;
  }

  if (!uri.startsWith('http')) {
    return <Image {...passthrough} />;
  }

  return (
    <RNFastImage
      {...passthrough}
      onLoadEnd={onLoadEnd}
      onError={() => setIsLoadingFailed(true)}
    />
  );
}
