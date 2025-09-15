// api/auth.ts
import instance from "./index";
import { storeToken } from "./storage";

export interface UserInfo {
  username: string;
  email: string;
  password: string;
  verifyPassword: string;
  image?: string;
}

type RegisterResponse = { token: string; user?: any; message?: string };

const register = async (userInfo: UserInfo) => {
  const { data } = await instance.post<RegisterResponse>("/api/signup", userInfo);
  await storeToken(data.token);
  return data;
};

export { register };

