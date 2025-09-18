import instance from ".";
import { UserInfo } from "@/types/Userinfo";

export const getProfile = async () => {
  const { data } = await instance.get("/api/profile");
  return data;
};

const updateUser = async (UserInfo: UserInfo) => {
  const { data } = await instance.put("/api/updateprofile", { params: UserInfo });
  return data;
};

  const getUserInfo = async () => {
    try{
    const { data } = await instance.get<{users: UserInfo[]}>("/api/users");
    return data.users;
    } catch (error) {
      console.error("Error getting user recipes:", error);
      throw error;
    }
  };

  export { getUserInfo, updateUser };