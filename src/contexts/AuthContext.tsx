import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { api } from "../services/api";

// Definição dos tipos
type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signUp: (data: SignUpProps) => Promise<void>;
  signOut: () => Promise<void>;
  loadingAuth: boolean;
  loading: boolean;
  updateUserFamily: (famylyUpdate: UserUpProps) => Promise<void>;
  deleteAcount: () => Promise<void>;
};

type UserProps = {
  id: number;
  name: string;
  email: string;
  token: string;
  family_id: string;
};

type SignInProps = {
  email: string;
  password: string;
};

type SignUpProps = {
  name: string;
  email: string;
  password: string;
  familyName: string;
};

type UserUpProps = {
  family_id: string;
};

type AuthContextProps = {
  children: ReactNode;
};

// Criação do contexto
export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthContextProps) {
  const [user, setUser] = useState<UserProps>({
    id: 0,
    name: "",
    email: "",
    token: "",
    family_id: "",
  });

  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user.name;

  useEffect(() => {
    async function getUser() {
      const userInfo = await AsyncStorage.getItem("@corbiecompras");
      let hasUser: UserProps = JSON.parse(userInfo || "{}");

      if (Object.keys(hasUser).length > 0) {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${hasUser.token}`;
        setUser(hasUser);
      }
      setLoading(false);
    }
    getUser();
  }, []);

  // Funções de autenticação (signIn, signUp, signOut, etc.)
  async function signIn({ email, password }: SignInProps) {
    setLoadingAuth(true);
    try {
      console.log("leo antes res");
      const response = await api.post("/user/login", { email, password });
      const { id, name, token, family_id } = response.data;

      const data = { ...response.data };
      await AsyncStorage.setItem("@corbiecompras", JSON.stringify(data));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      console.log("leo data", data);
      setUser({ id, name, email, token, family_id });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message;
      Alert.alert("Erro ao Logar", errorMessage);
    }
    setLoadingAuth(false);
  }

  async function signUp({ name, email, password, familyName }: SignUpProps) {
    setLoadingAuth(true);
    try {
      await api.post("/user/cad", { name, email, password, familyName });
      await signIn({ email, password });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message;
      ToastAndroid.showWithGravity(
        "Erro ao Cadastrar Usuário.\r\n\r\n" + errorMessage,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    }
    setLoadingAuth(false);
  }

  async function updateUserFamily({ family_id }: UserUpProps) {
    try {
      await api.put("/user/upfamily", { family_id });
      setUser((prevUser) => ({ ...prevUser, family_id }));

      const data = { ...user, family_id };
      await AsyncStorage.setItem("@corbiecompras", JSON.stringify(data));
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message;
      ToastAndroid.showWithGravity(
        "Erro ao Atualizar Familia do Usuario.\r\n\r\n" + errorMessage,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    }
    setLoadingAuth(false);
  }

  async function deleteAcount() {
    try {
      setLoadingAuth(true);
      await api.delete("/user/rem");
      await signOut();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message;
      ToastAndroid.showWithGravity(
        "Erro ao excluir conta.\r\n\r\n" + errorMessage,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    } finally {
      setLoadingAuth(false);
    }
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUser({ id: 0, name: "", email: "", token: "", family_id: "" });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        loadingAuth,
        loading,
        updateUserFamily,
        deleteAcount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
