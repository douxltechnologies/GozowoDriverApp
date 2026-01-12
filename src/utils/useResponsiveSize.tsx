import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export default function useResponsiveSize(designWidth = Dimensions.get('window').width, designHeight = Dimensions.get('window').height) {
  const getSize = () => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  };

  const [windowSize, setWindowSize] = useState(getSize());

  useEffect(() => {
    const onChange = () => setWindowSize(getSize());
    const sub = Dimensions.addEventListener('change', onChange);
    return () => sub?.remove?.();
  }, []);

  const wp = (w:any) => (windowSize.width * w) / designWidth;     // responsive width
  const hp = (h:any) => (windowSize.height * h) / designHeight;   // responsive height
  const fp = (size:any) => (windowSize.height * size) / designHeight; // responsive font size

  return { wp, hp, fp };
}
