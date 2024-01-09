import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dopahistory.app',
  appName: 'dopaHistoryApp',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
