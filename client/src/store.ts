import { create } from "zustand";
import IUserStore from "./interfaces/IUserStore";
import IUser from "./interfaces/IUser";
import axios from "axios";

const backend = import.meta.env.VITE_BACKEND;

const getUserFromLocalStorage = (): IUser | null => {
  const storedUser = localStorage.getItem("future-insights-user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const useUserStore = create<IUserStore>((set) => ({
  user: getUserFromLocalStorage(),
  token: localStorage.getItem("future-insights-token") || null,
  setUser: (user) => {
    localStorage.setItem("future-insights-user", JSON.stringify(user));
    set({ user });
  },
  setToken: (token) => {
    localStorage.setItem("future-insights-token", token);
    localStorage.setItem("future-insights-login-time", Date.now().toString());
    set({ token });
  },
  clearUser: () => {
    localStorage.removeItem("future-insights-token");
    localStorage.removeItem("future-insights-user");
    localStorage.removeItem("future-insights-login-time");
    set({ user: null, token: null });
  },
}));

// Check if the token is valid when the app is initialized
export const checkUserFromCookie = async () => {
  const token = localStorage.getItem("future-insights-token");
  const loginTime = localStorage.getItem("future-insights-login-time");

  const EXPIRATION_LIMIT = 1000 * 60 * 60 * 24; // 24 hours

  if (
    !token ||
    !loginTime ||
    Date.now() - parseInt(loginTime) > EXPIRATION_LIMIT
  ) {
    console.log("Session expired");
    useUserStore.getState().clearUser();
    return;
  }

  try {
    const response = await axios.get(`${backend}/user/get-user`, {
      headers: {
        Authorization: `Bearer ${token}`, // Sending token in header
      },
    });
    useUserStore.getState().setUser(response.data.payload); // Set user to store if valid
  } catch (error) {
    console.log("User not authenticated or token expired", error);
    useUserStore.getState().clearUser(); // Clear the user and token if invalid
  }
};
