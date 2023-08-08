import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  useColorScheme,
  Text,
  View,
  StatusBar,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import Colors from "@/constants/Colors";
import Recipe from "./recipe";
import Favorite from "./favorite";
import { router } from "expo-router";
import { useAuth } from "@/context/auth";

const Tab = createMaterialTopTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const statusBarHeight = StatusBar.currentHeight
    ? StatusBar.currentHeight
    : 33.318870544433594;
  const { user } = useAuth();

  const fullName: string = `${user?.firstName} ${user?.lastName}`;

  const generateInitials = (name: string) => {
    const nameWords = name.split(" ");
    return nameWords
      .map((word: string) => word.charAt(0).toUpperCase())
      .join("");
  };

  return (
    <>
      <View
        style={[
          styles.profileContent,
          {
            paddingTop: statusBarHeight + 15,
            backgroundColor: Colors[colorScheme ?? "light"].primary,
          },
        ]}
      >
        <View style={styles.userContent}>
          {user?.image ? (
            <Image
              style={styles.userImage}
              source={{
                uri: user?.image,
              }}
            />
          ) : (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F0F2F5",
                height: 45,
                width: 45,
                borderRadius: 100,
              }}
            >
              <Text
                style={{
                  color: "#9BA4B5",
                  fontSize: 20,
                  fontWeight: "600",
                }}
              >
                {generateInitials(fullName)}
              </Text>
            </View>
          )}
          <View>
            <Text
              style={{
                fontSize: 16,
                color: Colors[colorScheme ?? "light"].text,
              }}
            >
              {fullName}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: Colors[colorScheme ?? "light"].text,
              }}
            >
              @{user?.username}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 15 }}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/create_recipe",
                params: {},
              })
            }
          >
            <Ionicons name="ios-add-outline" size={26} />
          </Pressable>
          <Pressable
            onPress={() => router.push({ pathname: "/settings", params: {} })}
          >
            <Ionicons name="ios-settings-outline" size={24} />
          </Pressable>
        </View>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          tabBarInactiveTintColor: Colors[colorScheme ?? "light"].inactiveIint,
          swipeEnabled: false,
        }}
      >
        <Tab.Screen name="recipe" component={Recipe} />
        <Tab.Screen name="favorite" component={Favorite} />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  profileContent: {
    height: 90,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 15,
    alignItems: "center",
  },
  userContent: { flexDirection: "row", alignItems: "center", gap: 15 },
  userImage: { height: 45, width: 45, borderRadius: 100 },
});
