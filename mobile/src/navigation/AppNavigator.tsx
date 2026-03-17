import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { colors } from '../theme';
import { RootStackParamList, MainTabParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import PlansScreen from '../screens/PlansScreen';
import PlanDetailScreen from '../screens/PlanDetailScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ opacity: focused ? 1 : 0.5 }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.secondary,
          borderTopColor: colors.surfaceLight,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Plans"
        component={PlansScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.secondary },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700', color: colors.text },
          contentStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PlanDetail"
          component={PlanDetailScreen}
          options={({ route }) => ({ title: route.params.planName })}
        />
        <Stack.Screen
          name="Workout"
          component={WorkoutScreen}
          options={({ route }) => ({ title: route.params.workoutName })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
