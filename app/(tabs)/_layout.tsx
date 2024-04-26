import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  size: number;
  color: string;
}) {
  return <Ionicons {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].inactiveIint,
        // tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          headerShown: false,
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="ios-home-sharp" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="formulate"
        options={{
          headerShown: true,
          title: "Formulate Recipe",
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="bulb-sharp" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="ios-person-sharp" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
