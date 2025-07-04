import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";36
import Questions from "../screens/Questions";
import Score from "../screens/Score";
import SelectSub from "../screens/SelectSub";
import Review from "../screens/Review";
import TopicsScreen from "../screens/TopicScreen";
import LoginScreen from '../Login/Pslogin'
import SignupScreen from '../Signup/Pssignup'
import ForgotPasswordScreen from '../Login/Psforgot'
import OtpVerificationScreen from '../Login/Psotp'
import ResetPasswordScreen from '../Login/Pspwd'
import EmailOtpScreen from '../Signup/Emailotp'
import LeaderBoard from "../screens/LeaderBoard";
import DoubtAnswerScreen from '../screens/answer'
import DoubtHistoryScreen from '../screens/history'
import AskDoubtScreen from "../screens/ask";
import BottomTabNavigator from "../screens/BottomTabs";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, 
          contentStyle: { backgroundColor: "white" },
        }} initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen}  options={{ headerShown: false }} />
         <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="DoubtAnswer" component={DoubtAnswerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DoubtHistory" component={DoubtHistoryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AskDoubt" component={AskDoubtScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmailOtp" component={EmailOtpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SelectSub" component={SelectSub} />
        <Stack.Screen name="TopicScreen" component={TopicsScreen}/>
        <Stack.Screen name="Questions" component={Questions} />
        <Stack.Screen name="Score" component={Score} options={{ gestureEnabled: false }}/>
        <Stack.Screen name="Review" component={Review} />
         <Stack.Screen name="LeaderBoard" component={LeaderBoard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
