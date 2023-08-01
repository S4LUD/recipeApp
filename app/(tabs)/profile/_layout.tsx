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

const Tab = createMaterialTopTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const statusBarHeight = StatusBar.currentHeight
    ? StatusBar.currentHeight
    : 33.318870544433594;

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
          <Image
            style={styles.userImage}
            source={{
              uri: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80",
            }}
          />
          <View style={{ gap: 5 }}>
            <Text
              style={{
                fontSize: 16,
                color: Colors[colorScheme ?? "light"].text,
              }}
            >
              Priscilla Du Preez
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
