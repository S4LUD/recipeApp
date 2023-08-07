import React from "react";
import { Stack, router } from "expo-router";
import { Pressable, Text, View, useColorScheme, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/auth";

export default function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const {
    authInitialized,
    user,
    useUpdate,
    createRecipeStatus,
    SaveCreatedRecipe,
  } = useAuth();

  if (!authInitialized && !user) return;

  return (
    <Stack
      initialRouteName="(auth)/sign-in"
      screenOptions={{ animation: "none" }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen
        name="create_recipe"
        options={{
          title: "",
          headerRight: () => (
            <View style={{ gap: 5, flexDirection: "row" }}>
              <Pressable
                onPress={() => router.back()}
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
                onPress={() => SaveCreatedRecipe()}
                disabled={createRecipeStatus}
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
              onPress={() => {
                Keyboard.dismiss();
                useUpdate();
              }}
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
      <Stack.Screen name="[...missing]" options={{ headerShown: false }} />
    </Stack>
  );
}
