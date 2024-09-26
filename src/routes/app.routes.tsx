import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";

import Category from "@/src/pages/Category";
import Family from "@/src/pages/Family";
import Profile from "@/src/pages/Profile";
import Sector from "@/src/pages/Sector";
import Task from "@/src/pages/Task";
import TaskCad from "@/src/pages/TaskCad";
import Unit from "@/src/pages/Unit";

import DrawerCustom from "@/src/components/DrawerCustom";

export type AppParamsList = {
  Compra: undefined;
  Compra_Cadastro: undefined;
  Familia: undefined;
  Categoria: undefined;
  Setor: undefined;
  Unidade: undefined;
  Perfil: undefined;
};

const Drawer = createDrawerNavigator<AppParamsList>();

function AppRoutes() {
  // const { user } = useContext(AuthContext);
  // const [mostrarMenu, setMostrarmenu] = useState(user.family_id);

  return (
    <Drawer.Navigator
      drawerContent={(props: any) => <DrawerCustom {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#FBFEFF",
        },
        drawerLabelStyle: {
          fontWeight: "bold",
        },
        drawerActiveTintColor: "#FBFEFF",
        drawerActiveBackgroundColor: "#2396C0",
        drawerInactiveBackgroundColor: "#FBFEFF",
        drawerInactiveTintColor: "#041318",
        drawerItemStyle: {
          marginVertical: 9,
        },
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Compra" component={Task} />
      <Drawer.Screen name="Compra_Cadastro" component={TaskCad} />
      <Drawer.Screen name="Familia" component={Family} />
      <Drawer.Screen name="Categoria" component={Category} />
      <Drawer.Screen name="Setor" component={Sector} />
      <Drawer.Screen name="Unidade" component={Unit} />
      <Drawer.Screen name="Perfil" component={Profile} />
    </Drawer.Navigator>
  );
}

export default AppRoutes;
