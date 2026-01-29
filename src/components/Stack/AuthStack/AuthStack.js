import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../../Screens/Auth/Splash';
import Loading from '../../Screens/Auth/Loading';
import PhoneVerification from '../../../components/Screens/Auth/PhoneVerification';
import AuthHeader from '../../components/Headers/Auth/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import OTP from '../../../components/Screens/Auth/OTP';
import Complete from '../../../components/Screens/Auth/Complete';
import BottomTab from '../../TabNavigator/BottomTab';
import OutgoingCallScreen from '../../../components/components/CallKit/OutgoingCallScreen';
const Stack = createNativeStackNavigator();
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash}></Stack.Screen>
      <Stack.Screen name="Loading" component={Loading}></Stack.Screen>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="PhoneVerification"
        component={PhoneVerification}
      ></Stack.Screen>
      <Stack.Screen
        name="OTP"
        component={OTP}
        options={{
          headerShown: false,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="Complete"
        component={Complete}
        options={{
          headerShown: false,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="OutgoingCallScreen"
        component={OutgoingCallScreen}
        options={{
          headerShown: false,
        }}
      ></Stack.Screen>
      <Stack.Screen name="BottomTab" component={BottomTab}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthStack;
