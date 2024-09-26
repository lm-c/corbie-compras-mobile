import { Feather } from "@expo/vector-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

import { ModalPicker } from "@/src/components/ModalPicker";
import { ModalUnitPicker } from "@/src/components/ModalUnitPicker";
import { CategoryProps } from "@/src/pages/Category";
import { api } from "@/src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "@/src/contexts/AuthContext";
import { UnitProps } from "@/src/pages/Unit";
import { useIsFocused } from "@react-navigation/native";

export default function TaskCad() {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useContext(AuthContext);

  const [idEdit, setIdEdit] = useState(0);

  const [categories, setCategories] = useState<CategoryProps[] | []>([]);
  const [categorySelected, setCategorySelected] = useState<
    CategoryProps | undefined
  >();
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);

  const [sectors, setSectors] = useState<CategoryProps[] | []>([]);
  const [sectorSelected, setSectorSelected] = useState<
    CategoryProps | undefined
  >();
  const [modalSectorVisible, setModalSectorVisible] = useState(false);

  const [units, setUnits] = useState<UnitProps[] | []>([]);
  const [unitSelected, setUnitSelected] = useState<UnitProps | undefined>();
  const [modalUnitVisible, setModalUnitVisible] = useState(false);

  const [qty, setQty] = useState("1");

  const [description, setDescription] = useState("");

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

  useEffect(() => {
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

      setSectorSelected(response.data[0]);

      // const sec = await AsyncStorage.getItem('@corbiecomprasSecSelected');
      // let hasSector: CategoryProps = JSON.parse(sec || '{}');
      // console.log('categoria selecionada: ' + hasSector?.id);
      // if (hasSector?.id) setSectorSelected(hasSector);
      // else setSectorSelected(response.data[0]);

      setLoading(false);
    }

    loadSectors();
  }, [categorySelected, isFocused]);

  useEffect(() => {
    async function loadUnits() {
      setLoading(true);

      const response = await api.get("/unit/cons");
      setUnits(response.data);

      const unitStore = await AsyncStorage.getItem(
        "@corbieComprasUnitSelected"
      );
      let hasUnit: UnitProps = JSON.parse(unitStore || "{}");
      if (hasUnit?.id) setUnitSelected(hasUnit);
      else setUnitSelected(response.data[0]);

      setLoading(false);
    }

    loadUnits();
  }, [isFocused]);

  async function handleChangeCategory(item: CategoryProps) {
    setCategorySelected(item);
    await AsyncStorage.setItem(
      "@corbiecomprasCatSelected",
      JSON.stringify(item)
    );
  }

  async function handleChangeSector(item: CategoryProps) {
    setSectorSelected(item);
    // await AsyncStorage.setItem(
    //   '@corbiecomprasSecSelected',
    //   JSON.stringify(item)
    // );
  }

  async function handleChangeUnit(item: UnitProps) {
    setUnitSelected(item);
    await AsyncStorage.setItem(
      "@corbieComprasUnitSelected",
      JSON.stringify(item)
    );
  }

  async function cancelEditItem() {
    setSaving(false);
    setDescription("");
    setQty("1");
    setIdEdit(0);
    Keyboard.dismiss();
  }

  async function handleCadaster() {
    if (qty === "" || Number(qty) === 0) {
      ToastAndroid.showWithGravity(
        "Informar Quantidade válida!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }
    if (description === "") {
      ToastAndroid.showWithGravity(
        "Informar Descrição!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }
    setSaving(true);

    try {
      // Editar Compra
      if (idEdit !== 0) {
        const response = await api.put("/task/edit", {
          id: idEdit,
          description: description,
          qty: qty,
          sector_id: sectorSelected?.id,
          unit_id: unitSelected?.id,
        });

        setSaving(false);
        setDescription("");
        setQty("1");
        setIdEdit(0);
        Keyboard.dismiss();

        return;
      }

      const response = await api.post("/task/cad", {
        description: description,
        qty: Number(qty),
        sector_id: sectorSelected?.id,
        unit_id: unitSelected?.id,
      });
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        ToastAndroid.showWithGravity(
          "Erro ao Cadastrar Compra.\r\n\r\n" + err.response.data.error,
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      } else {
        ToastAndroid.showWithGravity(
          "Erro ao Cadastrar Compra.\r\n\r\n" + err.message,
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      }
    }

    ToastAndroid.showWithGravity(
      "Cadastrado com sucesso!",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );

    setSaving(false);
    setDescription("");
    setQty("1");
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
        <Header title={"Cadastro de Compra"} />

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

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.categoryInput}
            onPress={() => setModalCategoryVisible(true)}
          >
            <Text style={styles.categoryText}>{categorySelected?.name}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryInput}
            onPress={() => setModalSectorVisible(true)}
          >
            <Text style={styles.categoryText}>{sectorSelected?.name}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            keyboardType="numeric"
            placeholder="Quantidade"
            style={styles.input}
            placeholderTextColor="rgba(4,19,24,0.40)"
            value={qty}
            onChangeText={setQty}
          />

          <TouchableOpacity
            style={styles.categoryInput}
            onPress={() => setModalUnitVisible(true)}
          >
            <Text style={styles.categoryText}>
              {unitSelected?.abbreviation}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Descrição"
            multiline={true}
            numberOfLines={6}
            style={styles.inputArea}
            placeholderTextColor="rgba(4,19,24,0.40)"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCadaster}>
            {saving ? (
              <ActivityIndicator size={25} color="#041318" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>
        </View>

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

        <Modal
          transparent={true}
          visible={modalSectorVisible}
          animationType="fade"
        >
          <ModalPicker
            handleCloseModal={() => setModalSectorVisible(false)}
            options={sectors}
            selectedItem={handleChangeSector}
          />
        </Modal>

        <Modal
          transparent={true}
          visible={modalUnitVisible}
          animationType="fade"
        >
          <ModalUnitPicker
            handleCloseModal={() => setModalUnitVisible(false)}
            options={units}
            selectedItem={handleChangeUnit}
          />
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#eaf8fe",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "space-between",
    justifyContent: "space-between",
    width: "95%",

    paddingHorizontal: 14,
  },
  categoryInput: {
    height: 50,
    width: "48%",
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
  input: {
    fontSize: 18,
    width: "48%",
    height: 50,
    textAlign: "left",
    backgroundColor: "#fbfeff",
    marginBottom: 12,
    borderRadius: 4,
    paddingHorizontal: 12,
    color: "#041318",
  },
  inputArea: {
    fontSize: 18,
    width: "100%",
    height: 70,
    textAlignVertical: "top",
    textAlign: "auto",
    backgroundColor: "#fbfeff",
    marginBottom: 12,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: "#041318",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#2cbcf0",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#041318",
  },
});
