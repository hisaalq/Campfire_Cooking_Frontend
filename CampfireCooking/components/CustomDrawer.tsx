import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
  } from "@react-navigation/drawer";
  import AuthContext from "@/context/AuthContext";
import { deleteToken } from "@/api/storage";
import { useContext } from "react";
  
  export default function CustomDrawer(props: any) {
    const { setIsAuthenticated } = useContext(AuthContext);
    //handle logout
    const handleLogout = () => {
        deleteToken();
        setIsAuthenticated(false);
    };
  
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Log out"
          onPress={handleLogout}
        />
      </DrawerContentScrollView>
    );
  }
  