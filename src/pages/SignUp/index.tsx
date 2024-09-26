import { AuthParamsList } from "@/src/routes/auth.routes";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";

import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { AuthContext } from "@/src/contexts/AuthContext";

type UserProps = {
  name: string;
  email: string;
  familyName: string;
  password: string;
  passwordConfirm: string;
};

// const schema = yup.object().shape({
//   name: yup.string().required('Nome é Obrigatório!'),
//   email: yup
//     .string()
//     .email('E-mail inválido!')
//     .required('E-mail é Obrigatório!'),
//   familyName: yup.string().required('Família é Obrigatório!'),
//   password: yup
//     .string()
//     .min(6, 'A Senha deve ter pelo menos 6 digitos!')
//     .required('Senha é Obrigatório!'),
//   passwordConfirm: yup
//     .string()
//     .min(6, 'A Senha deve ter pelo menos 6 digitos!')
//     .required('Confirmação senha é Obrigatório!'),
// });

export default function SignUp() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthParamsList>>();
  const { signUp, loadingAuth } = useContext(AuthContext);

  const [endFisrtPart, setEndFisrtPart] = useState(false);
  const [endSecondPart, setEndSecondPart] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [familyError, setFamilyError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");

  function handleValidationName() {
    if (name === "") {
      setNameError("Nome é Obrigatório!");
      return false;
    } else {
      setNameError("");
      return true;
    }
  }

  function handleValidationEmail() {
    if (email === "") {
      setEmailError("Email é Obrigatório!");
      return false;
    } else {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email)) {
        setEmailError("E-mail inválido!");
        return false;
      } else {
        setEmailError("");
        return true;
      }
    }
  }

  function handleValidationFamily() {
    if (familyName === "") {
      setFamilyError("Família é Obrigatório!");
      return false;
    } else {
      setFamilyError("");
      return true;
    }
  }

  function handleValidationPassword() {
    if (password === "") {
      setPasswordError("Senha é Obrigatório!");
      return false;
    } else if (password.length < 6) {
      setPasswordError("A Senha deve ter pelo menos 6 digitos!");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  }

  function handleValidationPasswordConfirm() {
    if (passwordConfirm === "") {
      setPasswordConfirmError("Confirmação senha é Obrigatório!");
      return false;
    } else {
      if (password !== passwordConfirm) {
        setPasswordConfirmError("Senhas não correspondem");
        return false;
      } else {
        setPasswordConfirmError("");
        return true;
      }
    }
  }

  function toggleFirst() {
    let contemErro = false;

    contemErro = !handleValidationName();
    contemErro = !handleValidationEmail();

    if (contemErro) return;

    setEndFisrtPart(!endFisrtPart);
  }

  async function toggleSecond() {
    let contemErro = false;

    contemErro = !handleValidationFamily();

    if (contemErro) return;

    setEndSecondPart(!endSecondPart);
  }

  async function handleCadaster() {
    let contemErro = false;

    contemErro = !handleValidationPassword();
    contemErro = !handleValidationPasswordConfirm();

    if (contemErro) return;

    await signUp({
      name,
      email,
      password,
      familyName,
    });
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (!endFisrtPart && !endSecondPart) {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={dismissKeyboard}
      >
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Seu nome"
              style={[styles.input]}
              placeholderTextColor="rgba(4,19,24,0.40)"
              value={name}
              onChangeText={setName}
              onBlur={handleValidationName}
            />
            {nameError && <Text style={styles.labelError}>{nameError}</Text>}

            <TextInput
              placeholder="E-mail"
              style={[styles.input]}
              placeholderTextColor="rgba(4,19,24,0.40)"
              value={email}
              onChangeText={setEmail}
              onBlur={handleValidationEmail}
            />
            {emailError && <Text style={styles.labelError}>{emailError}</Text>}

            <TouchableOpacity style={styles.button} onPress={toggleFirst}>
              <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  if (endFisrtPart && !endSecondPart) {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={dismissKeyboard}
      >
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Nome do grupo familiar"
              style={[styles.input]}
              placeholderTextColor="rgba(4,19,24,0.40)"
              value={familyName}
              onChangeText={setFamilyName}
              onBlur={handleValidationFamily}
            />
            {familyError && (
              <Text style={styles.labelError}>{familyError}</Text>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={toggleFirst}
              >
                <Text style={styles.buttonText}>Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={toggleSecond}
              >
                <Text style={styles.buttonText}>Próximo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  if (endFisrtPart && endSecondPart) {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={dismissKeyboard}
      >
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Senha"
              style={[styles.input]}
              placeholderTextColor="rgba(4,19,24,0.40)"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              onBlur={handleValidationPassword}
            />
            {passwordError && (
              <Text style={styles.labelError}>{passwordError}</Text>
            )}

            <TextInput
              placeholder="Confirmar senha"
              style={[styles.input]}
              placeholderTextColor="rgba(4,19,24,0.40)"
              secureTextEntry={true}
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              onBlur={handleValidationPasswordConfirm}
            />
            {passwordConfirmError && (
              <Text style={styles.labelError}>{passwordConfirmError}</Text>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={toggleSecond}
              >
                <Text style={styles.buttonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={handleCadaster}
              >
                {loadingAuth ? (
                  <ActivityIndicator size={25} color="#041318" />
                ) : (
                  <Text style={styles.buttonText}>Concluir</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaf8fe",
  },
  inputContainer: {
    width: "95%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  input: {
    fontSize: 18,
    width: "95%",
    height: 50,
    backgroundColor: "#fbfeff",
    marginBottom: 6,
    borderRadius: 4,
    paddingHorizontal: 12,
    color: "#041318",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    width: "95%",
    marginTop: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonSecondary: {
    width: "48%",
    height: 50,
    backgroundColor: "#2cbcf0",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
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
  link: { marginTop: 5, marginBottom: 9 },
  linkText: { color: "#041318", marginTop: 12, fontSize: 16 },
  labelError: {
    alignSelf: "flex-start",
    color: "#ff375b",
    marginBottom: 8,
    marginLeft: 21,
  },
});
