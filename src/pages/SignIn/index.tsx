import { AuthContext } from "@/src/contexts/AuthContext";
import { AuthParamsList } from "@/src/routes/auth.routes";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function SignIn() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthParamsList>>();
  const { signIn, loadingAuth } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (email === "" || password === "") {
      ToastAndroid.showWithGravity(
        "Informar Usuário e senha!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }

    await signIn({ email, password });
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onPress={dismissKeyboard}
    >
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("@/assets/images/LogoCorbie.png")}
        />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Digite Seu Login"
            style={styles.input}
            placeholderTextColor="rgba(4,19,24,0.40)"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Digite Sua Senha"
            style={styles.input}
            placeholderTextColor="rgba(4,19,24,0.40)"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            {loadingAuth ? (
              <ActivityIndicator size={25} color="#041318" />
            ) : (
              <Text style={styles.buttonText}>Acessar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.linkText}>Crie uma conta gratuita!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaf8fe",
  },
  logo: {
    marginBottom: 18,
    height: 130,
    width: 130,
  },
  inputContainer: {
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 14,
  },
  input: {
    fontSize: 18,
    width: "95%",
    height: 50,
    backgroundColor: "#fbfeff",
    marginBottom: 12,
    borderRadius: 4,
    paddingHorizontal: 12,
    color: "#041318",
  },
  button: {
    width: "95%",
    height: 50,
    backgroundColor: "#2cbcf0",
    borderRadius: 4,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#041318",
  },
  link: { marginTop: 5, marginBottom: 9, height: 50 },
  linkText: { color: "#041318", marginTop: 12, fontSize: 17 },
});
