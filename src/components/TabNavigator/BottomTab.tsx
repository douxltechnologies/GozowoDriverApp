import { View, Platform } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Header from '../components/Headers/BottomTab/Header';
import HomeStack from '../Stack/HomeStack/HomeStack';
import ProfileStack from '../Stack/ProfileStack/ProfileStack';
import HistoryStack from '../Stack/HistoryStack/HistoryStack';
import BookingsStack from '../Stack/BookingsStack/BookingsStack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../../utils/scaling';
import {
  CalendarRange,
  CircleUserIcon,
  History,
  House,
} from 'lucide-react-native';
import { COLOR } from '../../utils/color';

const tabs = [
  {
    name: 'HomeStack',
    component: HomeStack,
    tabName: 'Home',
  },
  {
    name: 'HistoryStack',
    component: HistoryStack,
    tabName: 'History',
  },
  {
    name: 'BookingsStack',
    component: BookingsStack,
    tabName: 'Bookings',
  },
  {
    name: 'ProfileStack',
    component: ProfileStack,
    tabName: 'Profile',
  },
];
function MyTabBar({ state, descriptors, navigation }: any) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              paddingHorizontal: spacing?.wp10,
              paddingVertical:spacing?.hp6,
              alignItems: 'center',
            }}
          >
            {index == 0 ? (
              <House color={isFocused ? COLOR?.blue : COLOR?.grey}></House>
            ) : index == 1 ? (
              <History color={isFocused ? COLOR?.blue : COLOR?.grey}></History>
            ) : index == 2 ? (
              <CalendarRange
                color={isFocused ? COLOR?.blue : COLOR?.grey}
              ></CalendarRange>
            ) : index == 3 ? (
              <CircleUserIcon
                color={isFocused ? COLOR?.blue : COLOR?.grey}
              ></CircleUserIcon>
            ) : (
              <></>
            )}
            <Text style={{ color: isFocused ? COLOR?.blue : COLOR?.grey }}>
              {tabs[index].tabName}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}
const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}
          tabBar={props => <MyTabBar {...props} />}
        >
          {tabs.map(item => {
            return (
              <Tab.Screen
                name={item?.name}
                component={item?.component}
              ></Tab.Screen>
            );
          })}
        </Tab.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default BottomTab;
