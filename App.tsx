import "react-native-gesture-handler";

import Routes from "@/src/routes";

import { AuthProvider } from "@/src/contexts/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar backgroundColor="#EAF8FE" style="dark" translucent={false} />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}
