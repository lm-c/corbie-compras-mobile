import { UnitProps } from "@/src/pages/Unit";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ModalPickerProps {
  options: UnitProps[];
  handleCloseModal: () => void;
  selectedItem: (item: UnitProps) => void;
}

const { width: WDT, height: HGT } = Dimensions.get("window");

export function ModalUnitPicker({
  options,
  handleCloseModal,
  selectedItem,
}: ModalPickerProps) {
  function onPressItem(item: UnitProps) {
    selectedItem(item);
    handleCloseModal();
  }

  const option = options.map((item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.option}
      onPress={() => onPressItem(item)}
    >
      <Text style={styles.item}>{`${item?.abbreviation} - ${item?.name}`}</Text>
    </TouchableOpacity>
  ));

  return (
    <TouchableOpacity style={styles.container} onPress={handleCloseModal}>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>{option}</ScrollView>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: WDT - 22,
    maxHeight: HGT / 2,
    backgroundColor: "#FBFEFF",
    borderWidth: 2,
    borderColor: "#2396c0",
    borderRadius: 4,
  },
  option: {
    alignItems: "flex-start",
    borderTopWidth: 0.8,
    borderTopColor: "#2396c0",
  },
  item: {
    margin: 18,
    fontSize: 14,
    fontWeight: "bold",
    color: "#041318",
  },
});