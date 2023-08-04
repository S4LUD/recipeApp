import React, { memo } from "react";
import {
  View,
  Text,
  useColorScheme,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import { router } from "expo-router";
import { useAuth } from "@/context/auth";

const Settings = () => {
  const colorScheme = useColorScheme();
  const { signOut } = useAuth();

  return (
    <ScrollView
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].screenBackground,
      }}
      contentContainerStyle={{ gap: 10 }}
    >
      <View
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].primary,
          alignItems: "center",
          justifyContent: "center",
          height: 155,
        }}
      >
        <Image
          style={styles.userImage}
          source={{
            uri: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80",
          }}
        />
        <View style={{ position: "absolute", right: 125, bottom: 20 }}>
          <View
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].primary,
              padding: 5,
              borderRadius: 100,
            }}
          >
            <Ionicons name="ios-camera" size={20} />
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].primary,
          gap: 15,
          paddingVertical: 15,
          paddingHorizontal: 15,
        }}
      >
        <TextInput
          style={{
            backgroundColor: "#F0F2F5",
          }}
          textColor="black"
          mode="flat"
          outlineColor="transparent"
          activeOutlineColor={Colors[colorScheme ?? "light"].tint}
          label="Username"
        />
        <TextInput
          style={{
            backgroundColor: "#F0F2F5",
          }}
          textColor="black"
          mode="flat"
          outlineColor="transparent"
          activeOutlineColor={Colors[colorScheme ?? "light"].tint}
          label="App ID"
        />
        <TextInput
          style={{
            backgroundColor: "#F0F2F5",
          }}
          textColor="black"
          mode="flat"
          outlineColor="transparent"
          activeOutlineColor={Colors[colorScheme ?? "light"].tint}
          label="Bio"
          multiline={true}
          maxLength={200}
        />
      </View>
      <View
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].primary,
          paddingHorizontal: 15,
          paddingVertical: 15,
        }}
      >
        <Pressable
          onPress={() => signOut()}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: "#FA3636",
            borderRadius: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, color: "#FFFFFF" }}>Logout</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  userImage: { height: 125, width: 125, borderRadius: 100 },
});

export default memo(Settings);
