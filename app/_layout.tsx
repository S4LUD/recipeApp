import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Slot } from "expo-router";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/context/auth";
import { PaperProvider } from "react-native-paper";
import { Pressable, Text, View, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <Slot />;
  }

  return (
    <PaperProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </PaperProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      initialRouteName="(auth)"
      screenOptions={{ headerShown: false, animation: "none" }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen
        name="create_recipe"
        options={{
          title: "",
          headerRight: () => (
            <View style={{ gap: 5, flexDirection: "row" }}>
              <Pressable
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 6,
                  borderRadius: 5,
                  borderColor: "#FA3636",
                  borderWidth: 1.5,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#FA3636",
                  }}
                >
                  Discard
                </Text>
              </Pressable>
              <Pressable
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 6,
                  borderRadius: 5,
                  borderColor: Colors[colorScheme ?? "light"].tint,
                  borderWidth: 1.5,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors[colorScheme ?? "light"].tint,
                  }}
                >
                  Save
                </Text>
              </Pressable>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="view_recipe"
        options={{
          title: "",
          headerRight: () => (
            <Pressable onPress={() => console.log("Pressed")}>
              <Ionicons name="ios-heart-outline" size={24} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "",
          headerRight: () => (
            <Pressable
              style={{
                paddingHorizontal: 15,
                paddingVertical: 6,
                borderRadius: 5,
                backgroundColor: Colors[colorScheme ?? "light"].tint,
              }}
              onPress={() => console.log("Pressed")}
            >
              <Text style={{ fontSize: 16, color: "#FFFFFF" }}>Update</Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="search_filter_categories"
        options={{ title: "Search" }}
      />
    </Stack>
  );
}
