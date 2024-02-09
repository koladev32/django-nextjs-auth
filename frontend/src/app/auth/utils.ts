import wretch from "wretch";
import Cookies from "js-cookie";

const api = wretch("http://localhost:8000");

const register = (email: string, password: string) => {
  return api.post({ email, password }, "/auth/users/");
};
const login = (email: string, password: string) => {
  return api.post({ email, password }, "/auth/jwt/create");
};

const refreshToken = () => {
  const refreshToken = Cookies.get("refreshToken");
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
  // Requires the user to be authenticated
  const accessToken = Cookies.get("accessToken");
  api.options({ headers: { Authorization: `Bearer ${accessToken}` } });

  return api.post(
    { uid, token, new_password, re_new_password },
    "/auth/users/reset_password_confirm/",
  );
};

export const authActions = () => {
  return {
    login,
    resetPasswordConfirm,
    refreshToken,
    register,
    resetPassword,
  };
};
