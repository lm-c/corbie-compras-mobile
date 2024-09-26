import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Feather } from "@expo/vector-icons";

interface ItemProps {
  data: {
    id: number;
    name: string;
  };
  deleteItem: (id: number) => void;
  editItem: (id: number, name: string) => void;
}

export default function TableList({ data, deleteItem, editItem }: ItemProps) {
  function handleDeleteItem() {
    deleteItem(data.id);
  }
  function handleEditItem() {
    editItem(data.id, data.name);
  }
  return (
    <View style={styles.container}>
      <View style={styles.textView}>
        <Text style={styles.descriptionText}>{data.name} </Text>
      </View>

      <View style={styles.iconView}>
        <TouchableOpacity onPress={handleEditItem}>
          <Feather name={"edit"} color="#2396C0" size={27} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 6 }} onPress={handleDeleteItem}>
          <Feather name={"trash-2"} color="#E7A2A2" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "#cceffb",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 15,
    minHeight: 50,
    borderBottomColor: "#2396c0",
    borderBottomWidth: 2,
  },
  textView: {
    flexDirection: "row",
    alignItems: "center",
    width: "78%",
    height: "100%",
  },
  descriptionText: {
    marginVertical: 6,
    marginLeft: 12,
    width: "75%",
    color: "#041318",
    fontSize: 18,
  },
  iconView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    height: "100%",
    borderRadius: 9,
    paddingLeft: 9,
  },
});
