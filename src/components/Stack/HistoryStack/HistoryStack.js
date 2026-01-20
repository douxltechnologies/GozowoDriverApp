import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import History from '../../Screens/History/History';
import HistoryDetails from '../../Screens/History/HistoryDetails';
const Stack=createNativeStackNavigator();
const HistoryStack=()=>{
    return(
        <Stack.Navigator initialRouteName='History' screenOptions={{headerShown:false}}>
            <Stack.Screen name="History" component={History}></Stack.Screen>
            <Stack.Screen name="HistoryDetails" component={HistoryDetails}></Stack.Screen>
        </Stack.Navigator>
    )
}
export default HistoryStack;