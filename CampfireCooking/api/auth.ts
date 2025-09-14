import instance from "./index";
import { storeToken } from "./storage";

interface UserInfo {
  username: string;
  password: string;
  image?: string;
}

const register = async (userInfo: UserInfo) => {
  const { data } = await instance.post(
    "/api/signup",
    userInfo
  );
  await storeToken(data.token);
  return data;
};

export { register };
