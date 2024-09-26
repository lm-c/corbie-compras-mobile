import React, { useContext } from "react";

import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Header from "@/src/components/Header";
import { AuthContext } from "@/src/contexts/AuthContext";

export default function Profile() {
  const { user, signOut, deleteAcount } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Header title={"Perfil"} />
      <Text style={styles.nomeUsuario}>{user && user.name}</Text>
      {/* <NewLink onPress={() => navigation.navigate('Registrar')}>
        <NewText>Registrar gastos</NewText>
      </NewLink> */}

      <TouchableOpacity style={styles.logout} onPress={() => signOut()}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.removeAcount}
        onPress={() => {
          Alert.alert(
            "Excluir Conta",
            "Tem certeza de que deseja prosseguir? Esta ação removerá permanentemente todas as informações vinculadas a este usuário.",
            [
              {
                text: "Confirmar",
                onPress: () => deleteAcount(),
              },
              {
                text: "Cancelar",
                onPress: () => console.log("Botão Cancelar pressionado"),
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
        }}
      >
        <Text style={styles.removeAcountText}>Excluir Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaf8fe",
    alignItems: "center",
  },
  nomeUsuario: {
    textAlign: "center",
    fontSize: 28,
    marginVertical: 25,
    color: "#041318",
  },
  logout: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ec9da2",
    width: "90%",
    height: 50,
    borderRadius: 9,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fbfeff",
  },
  removeAcount: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaf8fe",
    width: "90%",
    height: 50,
    borderRadius: 9,
    borderColor: "#2cbcf0",
    borderWidth: 2,
    marginTop: 12,
  },
  removeAcountText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2cbcf0",
  },
});
