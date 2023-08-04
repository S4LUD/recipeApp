import { router, useSegments, useRootNavigation } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface User {
  _id: string;
  username: string;
  bio?: string;
  image?: string;
}

interface AuthContextValue {
  signIn: (username: string | null, password: string | null) => void;
  signUp: (
    username: string,
    password: string,
    bio: string,
    image: string
  ) => void;
  signOut: () => void;
  authInitialized: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
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
  const [user, setAuth] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const storedToken = await SecureStore.getItemAsync("token");
      if (storedToken) {
        await axios
          .request({
            method: "post",
            maxBodyLength: Infinity,
            url: `${process.env.EXPO_PUBLIC_API_URL}/api/user/verify`,
            headers: {
              authorization_r: `Bearer ${storedToken}`,
            },
          })
          .then((response) => {
            if (response.data) {
              setAuth(response.data);
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
      }
      setAuthInitialized(true);
    })();
  }, []);

  // This hook will protect the route access based on user authentication.
  async function useProtectedRoute(): Promise<void> {
    const segments = useSegments();
    const [isNavigationReady, setNavigationReady] = useState(false);
    const rooNavigation = useRootNavigation();

    useEffect(() => {
      const unsubscribe = rooNavigation?.addListener("state", () => {
        setNavigationReady(true);
      });
      return function cleanup() {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [rooNavigation]);

    useEffect(() => {
      if (!isNavigationReady) return;

      const inAuthGroup = segments[0] === "(auth)";

      if (!authInitialized) return;

      if (!user && !inAuthGroup) {
        router.replace("/sign-in");
      } else if (user && inAuthGroup) {
        router.replace("/(tabs)/dashboard");
      }
    }, [user, segments, authInitialized, isNavigationReady]);
  }

  async function save(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  }

  async function useSignIn(username: string | null, password: string | null) {
    try {
      const response = await axios.request({
        method: "post",
        maxBodyLength: Infinity,
        url: `${process.env.EXPO_PUBLIC_API_URL}/api/user/login`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          username,
          password,
        }),
      });

      setAuth(response.data);
      await save("token", response.headers.token);
    } catch (error) {
      console.log(error);
      // Handle API error, show error to the user, etc.
    }
  }

  async function useSignOut() {
    try {
      setAuth(null);
      await SecureStore.deleteItemAsync("token");
    } catch (error) {
      console.log(error);
    }
  }

  function signUp(username: string, password: string) {
    console.log(username, password);
  }

  useProtectedRoute();

  return (
    <AuthContext.Provider
      value={{
        signIn: (username, password) => useSignIn(username, password),
        signUp: (username, password) => signUp(username, password),
        signOut: async () => useSignOut(),
        authInitialized,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
