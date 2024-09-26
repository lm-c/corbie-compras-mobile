import { Feather } from "@expo/vector-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
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
import TableList from "@/src/components/TableList";
import { api } from "@/src/services/api";

import { AuthContext } from "@/src/contexts/AuthContext";
import { useIsFocused } from "@react-navigation/native";

export type CategoryProps = {
  id: number;
  name: string;
};

export default function Category() {
  const isFocused = useIsFocused();
  const inputRef = useRef<TextInput>(null);
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [idEdit, setIdEdit] = useState(0);

  useEffect(() => {
    async function loadCategories() {
      setLoading(true);

      const response = await api.get("/category/cons", {
        params: {
          family_id: user.family_id,
        },
      });
      setCategories(response.data);
      setLoading(false);
    }

    loadCategories();
  }, [isFocused]);

  async function handleDeleteItem(id: number) {
    setLoading(true);
    await api.delete("/category/rem", {
      params: {
        id: id,
      },
    });

    // remover item da lista
    let removeitem = categories.filter((item) => {
      return item.id !== id;
    });

    setCategories(removeitem);
    setLoading(false);
  }

  async function handleEditItem(id: number, name: string) {
    setIdEdit(id);
    setName(name);

    inputRef.current?.focus();
  }

  async function cancelEditItem() {
    setIdEdit(0);
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
        const response = await api.put("/category/edit", {
          id: idEdit,
          name: name,
        });

        const index = categories.findIndex((item) => item.id === idEdit);
        const clone = categories;
        clone[index].name = name;

        setCategories([...clone]);

        setSaving(false);
        setName("");
        setIdEdit(0);
        Keyboard.dismiss();

        return;
      }

      const response = await api.post("/category/cad", {
        name,
        family_id: user.family_id,
      });

      let data = {
        id: response.data.id,
        name: response.data.name,
        family_id: user.family_id,
      };

      setCategories((oldArray) => [...oldArray, data]);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        ToastAndroid.showWithGravity(
          "Erro ao Cadastrar Categoria.\r\n\r\n" + err.response.data.error,
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      } else {
        ToastAndroid.showWithGravity(
          "Erro ao Cadastrar Categoria.\r\n\r\n" + err.message,
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      }
    }

    setSaving(false);
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
        <Header title={"Categorias"} />

        {idEdit > 0 && (
          <View>
            <TouchableOpacity
              style={{ flexDirection: "row", marginBottom: 8 }}
              onPress={cancelEditItem}
            >
              <Feather name="x-circle" color="#FF0000" size={20} />
              <Text style={{ marginLeft: 5, color: "#FF0000" }}>
                Você está editando uma categoria!
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TextInput
          placeholder="Descrição da Categoria"
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
          <Text style={styles.categoryText}>Descrição Categoria</Text>
        </View>
        {loading ? (
          <ActivityIndicator size={52} color="#041318" />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.flatList}
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TableList
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
