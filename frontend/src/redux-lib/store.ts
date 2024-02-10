import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "@/redux-lib/slices";
import { persistReducer } from "redux-persist";
import storage from "@/redux-lib/customStorage";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
});

const persistedReducer = persistReducer(
  {
    key: "root",
    version: 1,
    storage: storage,
  },
  rootReducer,
);
export const store = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
};

if (typeof window !== "undefined") {
  store().subscribe(() => {
    localStorage.setItem("myState", JSON.stringify(store));
  });
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
