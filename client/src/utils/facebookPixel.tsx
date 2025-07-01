
declare global {
  interface Window {
    fbq: any;
  }
}

export const initFacebookPixel = () => {
  if (!window.fbq) return;
  window.fbq('init', '1710058346280389'); 
};

export const trackPageView = (path: string) => {
  if (!window.fbq) return;
  window.fbq('track', 'PageView', {
    page_path: path,
    page_title: document.title,
  });
};

export const trackEvent = (eventName: string, data: Record<string, any> = {}) => {
  if (!window.fbq) return;
  window.fbq('track', eventName, data);
};
