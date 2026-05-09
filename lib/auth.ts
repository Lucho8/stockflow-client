import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  nameid: string;
  email: string;
  role: string;
  exp: number;
}

const isBrowser = typeof window !== "undefined";

export const getToken = () =>
  isBrowser ? localStorage.getItem("token") : null;
export const removeToken = () => {
  if (isBrowser) localStorage.removeItem("token");
};
export const saveToken = (token: string) => {
  if (isBrowser) localStorage.setItem("token", token);
};

export const getUser = () => {
  const token = getToken();
  if (!token) return null;
  return jwtDecode<JwtPayload>(token);
};

export const isAuthenticated = () => {
  const user = getUser();
  if (!user) return false;
  return user.exp * 1000 > Date.now();
};

export const getRole = () => getUser()?.role ?? null;
