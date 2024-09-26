import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import Header from "@/src/components/Header";
import ModalInput from "@/src/components/ModalInput";
import { api } from "@/src/services/api";

import FamilyList from "@/src/components/FamilyList";
import { AuthContext } from "@/src/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

export type FamilyProps = {
  id: string;
  user: { id: number; name: string };
  family: { id: string; name: string };
};

export default function Family() {
  const isFocused = useIsFocused();
  const inputRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [families, setFamilies] = useState<FamilyProps[]>([]);
  const [idEdit, setIdEdit] = useState("");
  const [name, setName] = useState("");

  const { updateUserFamily } = useContext(AuthContext);

  async function loadFamilies() {
    setLoading(true);
    const response = await api.get("/family/cons");
    setFamilies(response.data);
    setLoading(false);
  }

  useEffect(() => {
    loadFamilies();
  }, [isFocused]);

  async function handleEditItem(id: string, name: string) {
    setIdEdit(id);
    setName(name);

    inputRef.current?.focus();
  }

  async function handleSelectItem(id: string) {
    await AsyncStorage.removeItem("@corbiecomprasCatSelected");

    let family_id = id;
    await updateUserFamily({ family_id });

    let items = families.filter((item) => {
      return true;
    });

    setFamilies(items);
  }

  async function handleCopyItem(id: string) {
    try {
      await Clipboard.setStringAsync(id);

      Alert.alert(
        "Código Copiado",
        `${id}\n
      Este código pode ser enviado para a pessoa que você deseja que ingresse para a fimilia selecionada.\n
      Obs: a pessoa deve ter o Corbie Compras instalado no celular dela e selecionar a opção 'Juntar-se a uma Família' nesta mesma tela e colar este código para participar de sua família.`
      );
    } catch (error) {
      Alert.alert("Erro ao copiar texto:\n" + error);
    }

    return false;
  }

  async function cancelEditItem() {
    setIdEdit("");
    setName("");
    Keyboard.dismiss();
  }

  async function handleCadaster() {
    if (name === "") {
      ToastAndroid.showWithGravity(
        "Informar Descrição!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }
    setSaving(true);

    try {
      // Editar categoria
      if (idEdit !== "") {
        const response = await api.put("/family/edit", {
          id: idEdit,
          name: name,
        });

        const index = families.findIndex((item) => item.family.id === idEdit);
        const clone = families;
        clone[index].family.name = name;

        setFamilies([...clone]);

        setSaving(false);
        setName("");
        setIdEdit("");
        Keyboard.dismiss();

        return;
      }
      const response = await api.post("/family/cad", {
        name: name,
      });

      let family_id = response.data.id;
      await updateUserFamily({ family_id });

      await loadFamilies();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        ToastAndroid.showWithGravity(
          "Erro ao Cadastrar Unidade.\r\n\r\n" + err.response.data.error,
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      } else {
        ToastAndroid.showWithGravity(
          "Erro ao Cadastrar Unidade.\r\n\r\n" + err.message,
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      }
    }

    setSaving(false);
    setName("");
    setIdEdit("");
    Keyboard.dismiss();
  }

  async function handleFamilyPartner() {
    setModalVisible(true);
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
        <Header title={"Familias"} />

        {idEdit !== "" && (
          <View>
            <TouchableOpacity
              style={{ flexDirection: "row", marginBottom: 8 }}
              onPress={cancelEditItem}
            >
              <Feather name="x-circle" color="#FF0000" size={20} />
              <Text style={{ marginLeft: 5, color: "#FF0000" }}>
                Você está editando uma família!
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TextInput
          placeholder="Descrição da família"
          style={styles.input}
          placeholderTextColor="rgba(4,19,24,0.40)"
          value={name}
          onChangeText={(text) => setName(text)}
          ref={inputRef}
        />
        <TouchableOpacity style={styles.button} onPress={handleCadaster}>
          {saving ? (
            <ActivityIndicator size={25} color="#041318" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleFamilyPartner}>
          {saving ? (
            <ActivityIndicator size={25} color="#041318" />
          ) : (
            <Text style={styles.buttonText}>Juntar-se a uma família</Text>
          )}
        </TouchableOpacity>

        <View style={styles.categoryHeader}>
          <Text style={styles.categoryText}>Descrição Família</Text>
        </View>
        {loading ? (
          <ActivityIndicator size={52} color="#041318" />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.flatList}
            data={families}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <FamilyList
                data={item}
                editItem={handleEditItem}
                selectItem={handleSelectItem}
                copyItem={handleCopyItem}
              />
            )}
          />
        )}

        <Modal transparent={true} visible={modalVisible} animationType="fade">
          <ModalInput
            setVisible={() => setModalVisible(false)}
            refresh={() => loadFamilies()}
          />
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaf8fe",
    alignItems: "center",
  },
  input: {
    fontSize: 18,
    width: "90%",
    height: 50,
    backgroundColor: "#fbfeff",
    marginBottom: 9,
    borderRadius: 4,
    paddingHorizontal: 12,
    color: "#041318",
  },
  button: {
    width: "90%",
    height: 50,
    backgroundColor: "#2cbcf0",
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#041318",
  },
  categoryHeader: {
    backgroundColor: "#2CBCF0",
    width: "90%",
    height: 40,
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  categoryText: {
    fontSize: 18,
    color: "#060707",
  },
  flatList: {
    backgroundColor: "#eaf8fe",
    width: "90%",
  },
});
