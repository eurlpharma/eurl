// src/theme/emotionCache.js
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

export const createEmotionCache = (dir = 'ltr') => {
  return createCache({
    key: dir === 'rtl' ? 'mui-rtl' : 'mui',
    stylisPlugins: dir === 'rtl' ? [prefixer, rtlPlugin] : [],
  });
};
