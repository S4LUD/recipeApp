import { router } from "expo-router";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  useMemo,
} from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Reducer, initialState, State } from "./reducer";
import { ACTION_TYPES } from "./action";

let API_URL = "http://192.168.1.72:3000";

interface AuthContextType {
  signIn: (username: string | null, password: string | null) => void;
  signUp: (
    username: string,
    password: string,
    bio: string,
    image: string
  ) => void;
  signOut: () => void;
  state: State;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return authContext;
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  // This hook can be used to access the user info.
  const [state, setDispatch] = useReducer(Reducer, initialState);

  async function save(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  }

  // This hook will protect the route access based on user authentication.
  async function useProtectedRoute(): Promise<void> {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
      const fetchToken = async () => {
        try {
          const storedToken = await SecureStore.getItemAsync("token");
          setToken(storedToken);
        } catch (error) {
          console.error("Error retrieving token:", error);
        }
      };

      fetchToken();
    }, []);

    useEffect(() => {
      const Authenticate = async () => {
        if (token) {
          await axios
            .request({
              method: "post",
              maxBodyLength: Infinity,
              url: `${API_URL}/api/user/verify`,
              headers: {
                authorization_r: `Bearer ${token}`,
              },
            })
            .then((response) => {
              if (!response.data.status) {
                setDispatch({ type: ACTION_TYPES.signOut });
                router.replace("/sign-in");
              } else if (response.data.status) {
                console.log(response.data.status);
                setDispatch({ type: ACTION_TYPES.signIn });
                router.replace("/(tabs)");
              }
            })
            .catch((error) => {
              if (error.response) {
                console.log("Error response data:", error.response.data);
                console.log("Error response status:", error.response.status);
                console.log("Error response headers:", error.response.headers);
              } else {
                console.log("Error:", error.message);
              }
            });
        } else {
          setDispatch({ type: ACTION_TYPES.signOut });
          router.replace("/sign-in");
        }
      };

      Authenticate();
    }, [token]);
  }

  async function useSignIn(username: string | null, password: string | null) {
    try {
      const response = await axios.request({
        method: "post",
        maxBodyLength: Infinity,
        url: `${API_URL}/api/user/login`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.data.status) {
        setDispatch({ type: ACTION_TYPES.signIn });
        await save("token", response.headers.token);
        router.replace("/(tabs)");
      } else {
        setDispatch({ type: ACTION_TYPES.signOut });
        router.replace("/sign-in");
      }
    } catch (error) {
      console.log(error);
      // Handle API error, show error to the user, etc.
    }
  }

  function signUp(
    username: string,
    password: string,
    bio: string,
    image: string
  ) {}

  const ActionType = useMemo(
    () => ({
      signIn: async (username: string | null, password: string | null) => {
        await useSignIn(username, password);
      },
      signOut: async () => {
        setDispatch({ type: ACTION_TYPES.signOut });
        console.log("signOut");
        await SecureStore.deleteItemAsync("token");
        router.replace("/sign-in");
      },
    }),
    []
  );

  useProtectedRoute();

  return (
    <AuthContext.Provider
      value={{
        signIn: (username, password) => ActionType.signIn(username, password),
        signUp,
        signOut: async () => ActionType.signOut(),
        state,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
