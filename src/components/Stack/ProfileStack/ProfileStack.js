import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../../Screens/Profile/Profile';
import Wallet from '../../Screens/Profile/Wallet';
import RechargeWallet from '../../Screens/Profile/RechargeWallet';
import TripHistory from '../../Screens/Profile/TripHistory';
const Stack = createNativeStackNavigator();
const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName='Profile' screenOptions={{headerShown:false}}>
        <Stack.Screen name='Profile' component={Profile}></Stack.Screen>
        <Stack.Screen name="Wallet" component={Wallet}></Stack.Screen>
      <Stack.Screen
        name="RechargeWallet"
        component={RechargeWallet}
      ></Stack.Screen>
      <Stack.Screen name="TripHistory" component={TripHistory}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default ProfileStack;
