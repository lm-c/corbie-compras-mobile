import { Feather } from "@expo/vector-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { TriangleColorPicker } from "react-native-color-picker";

import { api } from "@/src/services/api";

import Header from "@/src/components/Header";
import SectorList from "@/src/components/SectorList";

import { ModalPicker } from "@/src/components/ModalPicker";
import { CategoryProps } from "@/src/pages/Category";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "@/src/contexts/AuthContext";
import { useIsFocused } from "@react-navigation/native";

export type SectorProps = {
  id: number;
  name: string;
  color: string;
};

export default function Sector() {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useContext(AuthContext);

  const [idEdit, setIdEdit] = useState(0);
  const [name, setName] = useState("");
  const [colorSector, setColorSector] = useState("#2396C0");

  const [categories, setCategories] = useState<CategoryProps[] | []>([]);
  const [categorySelected, setCategorySelected] = useState<
    CategoryProps | undefined
  >();
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  const [sectors, setSectors] = useState<SectorProps[] | []>([]);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    async function loadCategories() {
      setLoading(true);
      const response = await api.get("/category/cons", {
        params: {
          family_id: user.family_id,
        },
      });
      setCategories(response.data);

      const cat = await AsyncStorage.getItem("@corbiecomprasCatSelected");
      let hasCategory: CategoryProps = JSON.parse(cat || "{}");
      if (hasCategory?.id) setCategorySelected(hasCategory);
      else setCategorySelected(response.data[0]);
      setLoading(false);
    }

    loadCategories();
  }, [isFocused]);

  async function loadSectors() {
    setLoading(true);
    if (!categorySelected || categorySelected?.id === 0) {
      return;
    }
    const response = await api.get("/sector/cons", {
      params: {
        category_id: categorySelected?.id,
      },
    });
    setSectors(response.data);

    setLoading(false);
  }

  useEffect(() => {
    loadSectors();
  }, [categorySelected, isFocused]);

  async function handleChangeCategory(item: CategoryProps) {
    setCategorySelected(item);
    await AsyncStorage.setItem(
      "@corbiecomprasCatSelected",
      JSON.stringify(item)
    );
  }

  async function handleDeleteItem(id: number) {
    setLoading(true);
    await api.delete("/sector/rem", {
      params: {
        id: id,
      },
    });

    // remover item da lista
    let removeitem = sectors.filter((item) => {
      return item.id !== id;
    });

    setSectors(removeitem);
    setLoading(false);
  }

  async function handleEditItem(id: number, name: string, color: string) {
    setIdEdit(id);
    setName(name);
    setColorSector(color);

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
      // Editar Setor
      if (idEdit !== 0) {
        const response = await api.put("/sector/edit", {
          id: idEdit,
          name: name,
          category_id: categorySelected?.id,
          color: colorSector,
        });

        const index = sectors.findIndex((item) => item.id === idEdit);
        const clone = sectors;
        clone[index].name = name;
        clone[index].color = colorSector;

        setSectors([...clone]);

        setSaving(false);
        setName("");
        setIdEdit(0);
        Keyboard.dismiss();

        return;
      }

      const response = await api.post("/sector/cad", {
        name: name,
        category_id: categorySelected?.id,
        color: colorSector,
      });

      let data = {
        id: response.data.id,
        name: response.data.name,
        color: response.data.color,
      };
      setSectors((oldArray) => [...oldArray, data]);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        ToastAndroid.showWithGravity(
          "Erro ao Cadastrar Setor.\r\n\r\n" + err.response.data.error,
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      } else {
        ToastAndroid.showWithGravity(
          "Erro ao Cadastrar Setor.\r\n\r\n" + err.message,
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

  interface ColorPickerProps {
    color: string;
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    // <TouchableWithoutFeedback
    //   style={styles.container}
    //   onPress={dismissKeyboard}
    // >
    <View style={styles.container}>
      <Header title={"Setores"} />

      {idEdit > 0 && (
        <View>
          <TouchableOpacity
            style={{ flexDirection: "row", marginBottom: 8 }}
            onPress={cancelEditItem}
          >
            <Feather name="x-circle" color="#FF0000" size={20} />
            <Text style={{ marginLeft: 5, color: "#FF0000" }}>
              Você está editando um setor!
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.categoryInput,
          { backgroundColor: colorSector, alignItems: "center" },
        ]}
        onPress={() => setColorPickerVisible(true)}
      >
        <Text style={styles.sectorColorText}>{"Cor do Setor"}</Text>
      </TouchableOpacity>

      {categories.length !== 0 && (
        <TouchableOpacity
          style={styles.categoryInput}
          onPress={() => setModalCategoryVisible(true)}
        >
          <Text style={styles.categoryText}>{categorySelected?.name}</Text>
        </TouchableOpacity>
      )}

      <TextInput
        placeholder="Descrição do Setor"
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
        <Text style={styles.categoryText}>Descrição Setor</Text>
      </View>

      {loading ? (
        <ActivityIndicator size={52} color="#041318" />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
          data={sectors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SectorList
              data={item}
              deleteItem={handleDeleteItem}
              editItem={handleEditItem}
            />
          )}
        />
      )}

      <Modal
        transparent={false}
        visible={colorPickerVisible}
        animationType="fade"
      >
        <TriangleColorPicker
          defaultColor={colorSector}
          oldColor={colorSector}
          onColorSelected={(color) => {
            setColorSector(color);
            setColorPickerVisible(false);
          }}
          style={{ flex: 1 }}
        />
      </Modal>

      <Modal
        transparent={true}
        visible={modalCategoryVisible}
        animationType="fade"
      >
        <ModalPicker
          handleCloseModal={() => setModalCategoryVisible(false)}
          options={categories}
          selectedItem={handleChangeCategory}
        />
      </Modal>
    </View>
    // </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaf8fe",
    alignItems: "center",
  },
  categoryInput: {
    height: 50,
    width: "90%",
    borderRadius: 9,
    justifyContent: "center",
    marginBottom: 9,
    paddingHorizontal: 12,
    backgroundColor: "#fbfeff",
  },
  categoryText: {
    fontSize: 18,
    color: "#041318",
  },
  sectorColorText: {
    fontSize: 18,
    color: "#fbfeff",
  },
  input: {
    fontSize: 18,
    width: "90%",
    height: 50,
    backgroundColor: "#fbfeff",
    marginBottom: 9,
    borderRadius: 9,
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
  flatList: {
    backgroundColor: "#eaf8fe",
    width: "90%",
  },
});
