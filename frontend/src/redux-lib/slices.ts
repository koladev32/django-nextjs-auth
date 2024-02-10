import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type State = {
  isAuthenticated: boolean;
};

const initialState: State = { isAuthenticated: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthStatus(
      state: State,
      action: PayloadAction<{ isAuthenticated: boolean }>,
    ) {
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    setLogout(state: State) {
      state.isAuthenticated = false;
    },
  },
});

export default authSlice;
