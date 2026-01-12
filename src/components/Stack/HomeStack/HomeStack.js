import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../TabNavigator/Tabs/Home';
import MapViewRequest from '../../Screens/Home/MapViewRequest';
import Header from '../../components/Headers/BottomTab/Header';
import Chat from '../../Screens/Home/Chat';
const Stack = createNativeStackNavigator();
const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: true,header: ({route}) => {
          return (<>{route.name!='Chat'?<Header></Header>:<></>}</>);
        } }}>
      <Stack.Screen name="Home" component={Home}></Stack.Screen>    
      <Stack.Screen name="MapViewRequest" component={MapViewRequest}></Stack.Screen>    
      <Stack.Screen name="Chat" component={Chat}></Stack.Screen>    
    </Stack.Navigator>
  );
};

export default HomeStack;
