import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import React, { useContext } from "react";
import { Image, Text, View } from "react-native";

import { AuthContext } from "@/src/contexts/AuthContext";

export default function DrawerCustom(props: any) {
  const { user, signOut } = useContext(AuthContext);

  return (
    <DrawerContentScrollView>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 18,
        }}
      >
        <Image
          source={require("@/assets/images/LogoCorbie.png")}
          style={{ width: 90, height: 90 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 17, marginTop: 15 }}>Seja bem-vindo</Text>
        <Text
          style={{ fontSize: 15, fontWeight: "bold", marginBottom: 18 }}
          numberOfLines={1}
        >
          {user && user.name}
        </Text>
      </View>
      {user.family_id ? (
        <DrawerItemList {...props} />
      ) : (
        <DrawerItem
          style={{
            backgroundColor: "#d1a6a9",
          }}
          label="Sair"
          onPress={() => {
            signOut();
          }}
        />
      )}
    </DrawerContentScrollView>
  );
}
