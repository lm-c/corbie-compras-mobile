import { AuthContext } from "@/src/contexts/AuthContext";
import * as Clipboard from "expo-clipboard";
import React, { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface ModalInputProps {
  setVisible: () => void;
  refresh: () => void;
}

export default function ModalInput({ setVisible, refresh }: ModalInputProps) {
  const { updateUserFamily } = useContext(AuthContext);

  const [idFamily, setIdFamily] = useState<any>("");

  async function handlePastFamily() {
    let id = "";
    await Clipboard.getStringAsync().then((text: any) => {
      id = text;
    });

    if (id !== "") {
      setIdFamily(id);
    }
  }
  async function handleAddFamily() {
    if (idFamily === "") {
      ToastAndroid.showWithGravity(
        "Favor colar código da família no local indicado",
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
      return;
    }
    try {
      let family_id = idFamily;
      await updateUserFamily({ family_id });
      setVisible();
      refresh();
    } catch (err) {
      Alert.alert(
        "Código inválida informado!",
        "Você não conseguiu ingressar nesta família com este código."
      );
    }
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={setVisible}>
        <View style={{ flex: 1 }}></View>
      </TouchableWithoutFeedback>

      <View style={styles.ModalContent}>
        <TouchableOpacity
          style={styles.familyInput}
          onLongPress={handlePastFamily}
        >
          <Text style={styles.familyInputText}>
            {idFamily !== ""
              ? idFamily
              : "Pressione e segure para colar Código..."}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonAdd} onPress={handleAddFamily}>
          <Text style={styles.buttonAddText}>Confirmar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonCancel} onPress={setVisible}>
          <Text style={styles.buttonCancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(4, 19, 24, 0.5)",
  },
  ModalContent: {
    flex: 2,
    justifyContent: "center",
    backgroundColor: "#eaf8fe",
    padding: 14,
  },
  familyInput: {
    height: 80,
    borderRadius: 9,
    justifyContent: "center",
    marginBottom: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: "#fbfeff",
  },
  familyInputText: {
    fontSize: 18,
    color: "#041318",
  },
  buttonAdd: {
    borderRadius: 9,
    backgroundColor: "#2CBCF0",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  buttonAddText: {
    color: "#041318",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonCancel: {
    borderRadius: 9,
    backgroundColor: "#ec9da2",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    //borderColor: '#041318',
    //borderWidth: 2,
  },
  buttonCancelText: {
    color: "#041318",
    fontSize: 18,
    fontWeight: "bold",
  },
});
