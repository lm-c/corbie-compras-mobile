import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Feather } from "@expo/vector-icons";

export interface TaskListProps {
  data: {
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
  };
  deleteItem: (id: number) => void;
  editItem: (id: number) => void;
}

export default function HistoryList({
  data,
  deleteItem,
  editItem,
}: TaskListProps) {
  function handleDeleteItem() {
    deleteItem(data.id);
  }
  function handleEditItem() {
    editItem(data.id);
  }
  return (
    <View style={styles.container}>
      <View
        style={[styles.leftMarquer, { backgroundColor: data.sector.color }]}
      />

      <View style={styles.textView}>
        <Text style={styles.valueText}>{data.qty} </Text>
        <Text style={styles.valueText}>{data.unit.abbreviation} </Text>
        <Text style={styles.descriptionText}>{data.description} </Text>
      </View>

      <View style={styles.iconView}>
        {/* <TouchableOpacity onPress={handleEditItem}>
          <Feather name={'edit'} color='#2396C0' size={24} />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={handleDeleteItem}>
          <Feather name={"trash-2"} color="#E7A2A2" size={27} />
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
    marginBottom: 5,
    paddingRight: 15,
    borderRadius: 9,
    minHeight: 50,
  },
  leftMarquer: {
    backgroundColor: "#2396c0",
    flexDirection: "row",
    width: 9,
    height: "100%",
    borderBottomLeftRadius: 9,
    borderTopLeftRadius: 9,
  },
  textView: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    height: "100%",
  },
  valueText: {
    marginVertical: 6,
    textAlign: "right",
    width: 33,
    alignContent: "center",
    color: "#041318",
    fontSize: 18,
  },
  descriptionText: {
    marginVertical: 6,
    marginLeft: 6,
    width: "75%",
    color: "#041318",
    fontSize: 18,
  },
  iconView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "10%",
    height: "100%",
    borderRadius: 9,
  },
});
