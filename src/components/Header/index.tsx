import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";

import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

interface ParamsList {
  toggleDrawer: () => void;
}
interface Params {
  title: string;
}

export default function Header({ title }: Params) {
  const navigation = useNavigation<ParamsList>();

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        style={styles.buttonMenu}
        onPress={() => navigation.toggleDrawer()}
      >
        <Feather name="menu" color="#041318" size={30} />
      </TouchableWithoutFeedback>
      <Text style={styles.headerText}>{title} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    marginTop: 6,
    // marginBottom: 15,
    marginLeft: 15,
    width: "100%",
    height: 50,
  },
  buttonMenu: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 21,
    marginLeft: 15,
  },
});
