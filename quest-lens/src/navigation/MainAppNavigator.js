import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AvailableQuestsScreen from '../screens/AvailableQuestsScreen';
import { View, Text } from 'react-native';

// Placeholder components for screens to be developed
const SocialFeedScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B0F1A' }}>
    <Text style={{ color: 'white' }}>Social Feed Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B0F1A' }}>
    <Text style={{ color: 'white' }}>Profile Screen</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const MainAppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#12162A', borderTopColor: '#12162A' },
        tabBarActiveTintColor: '#8C2BEE',
        tabBarInactiveTintColor: '#A0A0A0',
      }}
    >
      <Tab.Screen name="Quests" component={AvailableQuestsScreen} />
      <Tab.Screen name="Social" component={SocialFeedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainAppNavigator;
