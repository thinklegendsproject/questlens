import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AvailableQuestsScreen from '../screens/AvailableQuestsScreen';
import SocialFeedScreen from '../screens/SocialFeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TeamScreen from '../screens/TeamScreen';

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
      <Tab.Screen name="Team" component={TeamScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainAppNavigator;
