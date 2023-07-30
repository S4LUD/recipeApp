import { Stack } from "expo-router";

export default function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        animation: "none",
      }}
      initialRouteName="(auth)/sign-in"
    >
      <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="screens" options={{ headerShown: false }} />
    </Stack>
  );
}
