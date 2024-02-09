import wretch from "wretch";
import Cookies from "js-cookie";

// Base API setup for making HTTP requests
const api = wretch("http://localhost:8000").accept("application/json");

/**
 * Stores a token in cookies.
 * @param {string} token - The token to be stored.
 * @param {"access" | "refresh"} type - The type of the token (access or refresh).
 */
const storeToken = (token: string, type: "access" | "refresh") => {
  Cookies.set(type + "Token", token);
};

/**
 * Retrieves a token from cookies.
 * @param {"access" | "refresh"} type - The type of the token to retrieve (access or refresh).
 * @returns {string | undefined} The token, if found.
 */
const getToken = (type: string) => {
  return Cookies.get(type + "Token");
};

/**
 * Removes both access and refresh tokens from cookies.
 */
const removeTokens = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

/**
 * Registers a new user.
 * @param {string} email - The email of the account.
 * @param {string} username - The username of the account.
 * @param {string} password - The password for the account.
 * @returns {Promise} A promise that resolves with the registration response.
 */
const register = (email: string, username: string, password: string) => {
  return api.post({ email, username, password }, "/auth/users/");
};

/**
 * Logs in a user and stores access and refresh tokens.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise} A promise that resolves with the login response.
 */
const login = (email: string, password: string) => {
  return api.post({ username: email, password }, "/auth/jwt/create");
};

/**
 * Logout a user.
 * @returns {Promise} A promise that resolves with the login response.
 */
const logout = () => {
  const refreshToken = getToken("refresh");
  return api.post({ refresh: refreshToken }, "/auth/logout/");
};

/**
 * Refreshes the JWT token using the stored refresh token.
 * @returns {Promise} A promise that resolves with the new access token.
 */
const handleJWTRefresh = () => {
  const refreshToken = getToken("refresh");
  return api.post({ refresh: refreshToken }, "/auth/jwt/refresh");
};

/**
 * Initiates a password reset request.
 * @param {string} email - The email of the user requesting a password reset.
 * @returns {Promise} A promise that resolves with the password reset response.
 */
const resetPassword = (email: string) => {
  return api.post({ email }, "/auth/users/reset_password/");
};

/**
 * Confirms the password reset with new password details.
 * @param {string} new_password - The new password.
 * @param {string} re_new_password - Confirmation of the new password.
 * @param {string} token - The token for authenticating the password reset request.
 * @param {string} uid - The user ID.
 * @returns {Promise} A promise that resolves with the password reset confirmation response.
 */
const resetPasswordConfirm = (
  new_password: string,
  re_new_password: string,
  token: string,
  uid: string
) => {
  return api.post(
    { uid, token, new_password, re_new_password },
    "/auth/users/reset_password_confirm/"
  );
};

/**
 * Exports authentication-related actions.
 * @returns {Object} An object containing all the auth actions.
 */
export const AuthActions = () => {
  return {
    login,
    resetPasswordConfirm,
    handleJWTRefresh,
    register,
    resetPassword,
    storeToken,
    getToken,
    logout,
    removeTokens,
  };
};
