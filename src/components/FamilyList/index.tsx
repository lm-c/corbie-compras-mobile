import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AuthContext } from "@/src/contexts/AuthContext";
import { Feather } from "@expo/vector-icons";

interface FamilyListListProps {
  data: {
    id: string;
    user: { id: number; name: string };
    family: { id: string; name: string };
  };
  editItem: (id: string, name: string) => void;
  selectItem: (id: string) => void;
  copyItem: (id: string) => void;
}

export default function FamilyList({
  data,
  editItem,
  selectItem,
  copyItem,
}: FamilyListListProps) {
  const { user, updateUserFamily } = useContext(AuthContext);

  function handleEditItem() {
    editItem(data.family.id, data.family.name);
  }

  function handleSelectItem() {
    selectItem(data.family.id);
  }

  function handleCopyItem() {
    copyItem(data.family.id);
  }

  return (
    <View style={styles.container}>
      <View style={styles.textView}>
        <TouchableOpacity onPress={handleSelectItem}>
          {data.family.id == user.family_id ? (
            <Feather name={"check-square"} color="#2396C0" size={27} />
          ) : (
            <Feather name={"square"} color="#2396C0" size={27} />
          )}
        </TouchableOpacity>
        <Text style={styles.descriptionText}>{`${data.family.name}`}</Text>
      </View>

      <View style={styles.iconView}>
        <TouchableOpacity onPress={handleEditItem}>
          <Feather name={"edit"} color="#2396C0" size={27} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 6 }} onPress={handleCopyItem}>
          <Feather name={"copy"} color="#041318" size={30} />
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
    width: "77%",
    height: "100%",
    marginLeft: 6,
  },
  descriptionText: {
    marginVertical: 6,
    marginLeft: 12,
    width: "72%",
    color: "#041318",
    fontSize: 18,
  },
  iconView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "20%",
    height: "100%",
    borderRadius: 9,
    paddingLeft: 9,
    paddingRight: 6,
  },
});
