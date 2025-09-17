// api/auth.ts
import instance from "./index";
import { storeToken } from "./storage";
import { SignUpInfo } from "@/types/SignUpInfo";
import { LoginInfo } from "@/types/LoginInfo";
import { UserInfo } from "@/types/UserProfile";

type RegisterResponse = { token: string; user?: any; message?: string };

const register = async (userInfo: SignUpInfo) => {
  const { data } = await instance.post<RegisterResponse>("/api/signup", userInfo);
  await storeToken(data.token);
  return data;
};

const login = async (userInfo: LoginInfo) => {
  const { data } = await instance.post<RegisterResponse>("/api/signin", userInfo);
  await storeToken(data.token);
  return data;
};

const getUserInfo = async () => {
  const { data } = await instance.get<RegisterResponse>("/api/profile");
  return data;
};

const updateUser = async (UserInfo: UserInfo) => {
  const { data } = await instance.put<RegisterResponse>("/api/profile", { params: UserInfo });
  return data;
};

export { register, login, getUserInfo, updateUser };

