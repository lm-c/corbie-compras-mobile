import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Feather } from "@expo/vector-icons";

interface SectorProps {
  data: {
    id: number;
    name: string;
    color: string;
  };
  deleteItem: (id: number) => void;
  editItem: (id: number, name: string, color: string) => void;
}

export default function SectorList({
  data,
  deleteItem,
  editItem,
}: SectorProps) {
  function handleDeleteItem() {
    deleteItem(data.id);
  }
  function handleEditItem() {
    editItem(data.id, data.name, data.color);
  }
  return (
    <View style={styles.container}>
      <View style={[styles.colorView, { backgroundColor: data.color }]}></View>

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
  colorView: {
    width: 27,
    height: 27,
    marginLeft: 12,
    borderRadius: 15,
  },
  textView: {
    flexDirection: "row",
    alignItems: "center",
    width: "67%",
    height: "100%",
  },
  descriptionText: {
    marginVertical: 6,
    marginLeft: 12,
    width: "100%",
    color: "#041318",
    fontSize: 17,
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
