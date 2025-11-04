import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import LiveBiddingScreen from '../screens/LiveBiddingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CustomTabBar from '../components/CustomTabBar';

// ✅ NEW: separate entry stacks
import MyAdsEntryStack from './MyAdsEntryStack';
import SellEntryStack from './SellEntryStack';

export type RootTabParamList = {
  Home: undefined;
  'Live Bidding': undefined;
  Profile: undefined;

  // ✅ Tab names (titles shown via options below)
  MyAds: undefined;
  Sell: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Live Bidding" component={LiveBiddingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />

      {/* ✅ Two separate entry points */}
      <Tab.Screen
        name="MyAds"
        component={MyAdsEntryStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route);
          // Hide tab bar when on nested stacks (not on MyAdsScreen)
          const shouldHideTabBar = routeName && routeName !== 'MyAdsScreen';
          return {
            title: 'My Ads',
            tabBarStyle: shouldHideTabBar ? { display: 'none' } : undefined,
          };
        }}
      />
      <Tab.Screen name="Sell" component={SellEntryStack} options={{ title: '+ Sell' }} />
    </Tab.Navigator>
  );
}
