import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0cefd93e78ca4501ad04fd6450aca09a',
  appName: 'smartroom-hub',
  webDir: 'dist',
  server: {
    url: 'https://0cefd93e-78ca-4501-ad04-fd6450aca09a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e40af',
      showSpinner: false
    }
  }
};

export default config;