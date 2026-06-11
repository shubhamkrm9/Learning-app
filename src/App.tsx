/**
 * Learning App - Root Component
 *
 * Replaces the SDK lifecycle pattern with direct app boot.
 * Sets up Redux store, configures API, and renders navigation.
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createAppStore } from './core/store';
import { initializeApp, launchApp } from './core/store/appSlice';
import { RootNavigator } from './navigation/RootNavigator';
import { appConfig } from './appConfig';

const store = createAppStore();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize app state with configuration
    store.dispatch(
      initializeApp({
        baseUrl: appConfig.baseUrl,
        accessToken: appConfig.accessToken,
      })
    );
    store.dispatch(launchApp());
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <RootNavigator />
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
