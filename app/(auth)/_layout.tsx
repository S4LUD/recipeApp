import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack
      initialRouteName="sign-in"
      // screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
