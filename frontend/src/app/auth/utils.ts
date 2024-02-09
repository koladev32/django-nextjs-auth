import wretch from "wretch";
import Cookies from "js-cookie";

const api = wretch("http://localhost:8000")
  .accept("application/json")
  .accept("application/json");

const storeToken = (access: string) => {
  Cookies.set("accessToken", access);
};

const getAccessToken = () => {
  return Cookies.get("accessToken");
};
const getRefreshToken = () => {
  return Cookies.get("refreshToken");
};

const register = (email: string, password: string) => {
  return api.post({ email, password }, "/auth/users/");
};
const login = (email: string, password: string) => {
  return api.post({ email, password }, "/auth/jwt/create");
};

const handleJWTRefresh = () => {
  const refreshToken = getRefreshToken();
  return api.post({ refresh: refreshToken }, "/auth/jwt/refresh");
};
const resetPassword = (email: string) => {
  return api.post({ email }, "/users/reset_password");
};

const resetPasswordConfirm = (
  new_password: string,
  re_new_password: string,
  token: string,
  uid: string,
) => {
  return api.post(
    { uid, token, new_password, re_new_password },
    "/auth/users/reset_password_confirm/",
  );
};

export const AuthActions = () => {
  return {
    login,
    resetPasswordConfirm,
    handleJWTRefresh,
    register,
    resetPassword,
    storeToken,
    getRefreshToken,
    getAccessToken,
  };
};
