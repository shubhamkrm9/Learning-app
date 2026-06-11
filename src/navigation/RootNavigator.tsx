/**
 * Learning Module SDK - RootNavigator
 *
 * Internal SDK navigation stack.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../core/types/navigation';

import { MainTabNavigator } from './MainTabNavigator';
import { ModuleDetailScreen } from '../features/modules/ModuleDetailScreen';
import { VideoPlayerScreen } from '../features/video/screens/VideoPlayerScreen';
import { AssessmentScreen } from '../features/assessments/AssessmentScreen';
import { AssessmentResultScreen } from '../features/assessments/AssessmentResultScreen';
import { ModuleCompletionScreen } from '../features/modules/ModuleCompletionScreen';
import { CertificateScreen } from '../features/certificates/CertificateScreen';
import { colors } from '../core/theme/colors';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="ModuleDetail" component={ModuleDetailScreen} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
        <Stack.Screen name="Assessment" component={AssessmentScreen} />
        <Stack.Screen name="AssessmentResult" component={AssessmentResultScreen} />
        <Stack.Screen name="ModuleCompletion" component={ModuleCompletionScreen} />
        <Stack.Screen name="Certificate" component={CertificateScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


