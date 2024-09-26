import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useKeepAwake } from "expo-keep-awake";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Header from "@/src/components/Header";
import { api } from "@/src/services/api";

import { ModalPicker } from "@/src/components/ModalPicker";
import { CategoryProps } from "@/src/pages/Category";

import HistoryList from "@/src/components/HistoryList";

import { AppParamsList } from "@/src/routes/app.routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthContext } from "@/src/contexts/AuthContext";
import { useIsFocused } from "@react-navigation/native";

export interface TaskProps {
  id: number;
  description: string;
  qty: number;
  unit: { id: number; abbreviation: string };
  sector: {
    id: number;
    name: string;
    color: string;
    category: { id: number; name: string };
  };
}

export default function Task() {
  const isFocused = useIsFocused();
  const navigation = useNavigation<NativeStackNavigationProp<AppParamsList>>();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryProps[] | []>([]);
  const [categorySelected, setCategorySelected] = useState<
    CategoryProps | undefined
  >();
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);

  useEffect(() => {
    async function loadCategories() {
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
    }

    loadCategories();
  }, [isFocused]);

  useEffect(() => {
    async function loadTasks() {
      await handleLoadTasks();
    }

    loadTasks();
  }, [categorySelected]);

  const [tasks, setTasks] = useState<TaskProps[] | []>([]);

  async function handleLoadTasks() {
    setLoading(true);

    if (!categorySelected || categorySelected?.id === 0) {
      return;
    }

    const response = await api.get("/task/cons", {
      params: {
        category_id: categorySelected?.id,
      },
    });

    setTasks(response.data);

    setLoading(false);
    return true;
  }

  async function handleChangeCategory(item: CategoryProps) {
    setCategorySelected(item);
    await AsyncStorage.setItem(
      "@corbiecomprasCatSelected",
      JSON.stringify(item)
    );
  }

  async function handleAddTask() {
    navigation.navigate("Compra_Cadastro");
  }

  async function handleDeleteItem(id: number) {
    setLoading(true);
    await api.delete("/task/rem", {
      params: {
        id: id,
      },
    });

    // remover item da lista
    let removeitem = tasks.filter((item) => {
      return item.id !== id;
    });

    setTasks(removeitem);
    setLoading(false);
  }

  async function handleEditItem(id: number) {
    navigation.navigate("Compra_Cadastro");
  }
  useKeepAwake();

  return (
    <View style={styles.background}>
      <Header title={"Compras Pendentes"} />
      {categories.length === 0 ? (
        <View
          style={{
            height: 80,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 55,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              marginRight: 12,
              color: "#2396C0",
            }}
          >
            Carregando Categorias
          </Text>
          <ActivityIndicator size={25} color="#2396C0" />
        </View>
      ) : (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.categoryInput}
            onPress={() => setModalCategoryVisible(true)}
          >
            <Text style={styles.categoryText}>{categorySelected?.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddTask}>
            <Feather name={"plus-circle"} color="#2396C0" size={36} />
          </TouchableOpacity>
        </View>
      )}
      {loading ? (
        <ActivityIndicator size={52} color="#041318" />
      ) : tasks.length === 0 ? (
        <Text style={{ marginLeft: 15, fontSize: 19, color: "#041318" }}>
          Sua lista de compras está vazia
        </Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <HistoryList
              data={item}
              deleteItem={handleDeleteItem}
              editItem={handleEditItem}
            />
          )}
          onRefresh={handleLoadTasks}
          refreshing={loading}
        />
      )}
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
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#eaf8fe",
  },
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 12,
  },
  categoryInput: {
    height: 50,
    width: "85%",
    borderRadius: 9,
    justifyContent: "center",

    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: "#fbfeff",
  },
  categoryText: {
    fontSize: 19,
    color: "#041318",
  },
  flatList: {
    backgroundColor: "#eaf8fe",
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
});
