import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import Header from "@/src/components/Header";
import UnitList from "@/src/components/UnitList";
import { api } from "@/src/services/api";

import { useIsFocused } from "@react-navigation/native";

export type UnitProps = {
  id: number;
  abbreviation: string;
  name: string;
};

export default function Unit() {
  const isFocused = useIsFocused();
  const inputRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [abreviat, setAbreviat] = useState("");
  const [name, setName] = useState("");

  const [units, setUnits] = useState<UnitProps[]>([]);
  const [idEdit, setIdEdit] = useState(0);

  useEffect(() => {
    async function loadUnits() {
      setLoading(true);
      const response = await api.get("/unit/cons");
      setUnits(response.data);
      setLoading(false);
    }

    loadUnits();
  }, [isFocused]);

  async function handleDeleteItem(id: number) {
    setLoading(true);
    await api.delete("/unit/rem", {
      params: {
        id: id,
      },
    });

    // remover item da lista
    let removeitem = units.filter((item) => {
      return item.id !== id;
    });

    setUnits(removeitem);
    setLoading(false);
  }

  async function handleEditItem(id: number, name: string, abreviat: string) {
    setIdEdit(id);
    setName(name);
    setAbreviat(abreviat);

    inputRef.current?.focus();
  }

  async function cancelEditItem() {
    setIdEdit(0);
    setAbreviat("");
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
      if (idEdit !== 0) {
        const response = await api.put("/unit/edit", {
          id: idEdit,
          abbreviation: abreviat,
          name: name,
        });

        const index = units.findIndex((item) => item.id === idEdit);
        const clone = units;
        clone[index].name = name;

        setUnits([...clone]);

        setSaving(false);
        setAbreviat("");
        setName("");
        setIdEdit(0);
        Keyboard.dismiss();

        return;
      }

      const response = await api.post("/unit/cad", {
        abbreviation: abreviat,
        name: name,
      });

      let data = {
        id: response.data.id,
        abbreviation: response.data.abbreviation,
        name: response.data.name,
      };

      setUnits((oldArray) => [...oldArray, data]);
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
    setAbreviat("");
    setName("");
    setIdEdit(0);
    Keyboard.dismiss();
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
        <Header title={"Unidades"} />

        {idEdit > 0 && (
          <View>
            <TouchableOpacity
              style={{ flexDirection: "row", marginBottom: 8 }}
              onPress={cancelEditItem}
            >
              <Feather name="x-circle" color="#FF0000" size={20} />
              <Text style={{ marginLeft: 5, color: "#FF0000" }}>
                Você está editando uma unidade!
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TextInput
          placeholder="Sigla da Unidade"
          style={styles.input}
          placeholderTextColor="rgba(4,19,24,0.40)"
          value={abreviat}
          onChangeText={(text) => setAbreviat(text)}
          ref={inputRef}
        />
        <TextInput
          placeholder="Descrição da Unidade"
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

        <View style={styles.categoryHeader}>
          <Text style={styles.categoryText}>Sigla - Descrição Unidade</Text>
        </View>
        {loading ? (
          <ActivityIndicator size={52} color="#041318" />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.flatList}
            data={units}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <UnitList
                data={item}
                deleteItem={handleDeleteItem}
                editItem={handleEditItem}
              />
            )}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(234, 248, 254)",
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
