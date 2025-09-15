import { createContext } from "react";

interface AuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export default AuthContext;
