import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "react-native-reanimated";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";

export type AuthParamsList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<AuthParamsList>();

function AuthRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerStyle: {
            backgroundColor: "#2396C0",
          },
          headerTintColor: "#FBFEFF",
          headerBackTitleVisible: false,
          headerTitle: "Cadastrar Usuário",
          headerLargeTitle: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthRoutes;
