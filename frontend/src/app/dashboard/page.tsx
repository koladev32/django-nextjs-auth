"use client";

import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import { AuthActions } from "@/app/auth/utils";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import authSlice from "@/redux-lib/slices";
import { useAppDispatch } from "@/redux-lib/hooks";

export default function Home() {
  const router = useRouter();

  const { data: user } = useSWR("/auth/users/me", fetcher);

  const { logout, removeTokens } = AuthActions();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    logout()
      .res(() => {
        console.log("Successful logout");
      })
      .catch(() => {
        console.error("An error occurred. Log this.");
      })
      .finally(() => {
        removeTokens();
        dispatch(authSlice.actions.setAuthStatus({ isAuthenticated: true }));

        router.push("/");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-center">
        <h1 className="text-2xl font-bold mb-4">Hi, {user?.username}!</h1>
        <p className="mb-4">Your account details:</p>
        <ul className="mb-4">
          <li>Username: {user?.username}</li>
          <li>Email: {user?.email}</li>
        </ul>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}
