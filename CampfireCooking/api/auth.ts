// api/auth.ts
import instance from "./index";
import { storeToken } from "./storage";
import { SignUpInfo } from "@/types/SignUpInfo";
import { LoginInfo } from "@/types/LoginInfo";
import { UserInfo } from "@/types/Userinfo";

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


export { register, login };

