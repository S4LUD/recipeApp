import { router, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect } from "react";

interface User {
  // Add any user-related properties here.
  // For example, you might have 'name', 'email', etc.
  auth: boolean;
}

interface AuthContextType {
  signIn: () => void;
  signOut: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

// This hook can be used to access the user info.
export function useAuth(): AuthContextType {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return authContext;
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user: User | null): void {
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[1] === "(auth)";
    console.log(segments);

    if (!user && !inAuthGroup) {
      router.replace("/sign-in");
    } else if (user && inAuthGroup) {
      router.replace("/(main)/screens/tabs/");
    }
  }, [user, segments]);
}

export function AuthProvider(props: {
  children: React.ReactNode;
}): JSX.Element {
  const [user, setAuth] = React.useState<User | null>(null);

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: () => setAuth({ auth: true }),
        signOut: () => setAuth(null),
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
