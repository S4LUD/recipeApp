import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  Dimensions,
  Pressable,
  StatusBar,
} from "react-native";
import { ActivityIndicator, TextInput } from "react-native-paper";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/auth";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";

export default function Signin() {
  const colorScheme = useColorScheme();
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const { signIn, loginStatus } = useAuth();
  const navigation = useNavigation();
  const [isError, setError] = useState<string | null>(null);

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      if (e.data.action.type === "GO_BACK") return;
      navigation.dispatch(e.data.action);
    });
  }, [navigation]);

  const _signIn = async (username: string | null, password: string | null) => {
    const result = await signIn(username, password);
    if (result?.status === false) {
      setError(result.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: "#FFFFFF",
        position: "relative",
      }}
      keyboardShouldPersistTaps="never"
    >
      {loginStatus && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
        >
          <ActivityIndicator size={30} />
        </View>
      )}
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          paddingTop: 25,
          gap: 15,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "600" }}>SIGNIN</Text>
        <TextInput
          style={{
            backgroundColor: "#F0F2F5",
            width: Dimensions.get("screen").width - 25,
          }}
          textColor="black"
          mode="flat"
          outlineColor="transparent"
          activeOutlineColor={Colors[colorScheme ?? "light"].tint}
          label="Username"
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={{
            backgroundColor: "#F0F2F5",
            width: Dimensions.get("screen").width - 25,
          }}
          textColor="black"
          mode="flat"
          outlineColor="transparent"
          activeOutlineColor={Colors[colorScheme ?? "light"].tint}
          label="Password"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        {isError && (
          <Text
            style={{
              paddingLeft: 15,
              fontSize: 12,
              color: "#FA3636",
              alignSelf: "flex-start",
            }}
          >
            {isError}
          </Text>
        )}
        <Pressable
          style={{
            width: Dimensions.get("screen").width - 25,
            backgroundColor: Colors[colorScheme ?? "light"].tint,
            alignItems: "center",
            paddingVertical: 15,
            borderRadius: 5,
          }}
          onPress={() => _signIn(username, password)}
        >
          <Text
            style={{
              fontSize: 16,
              color: Colors[colorScheme ?? "light"].primary,
            }}
          >
            Sign In
          </Text>
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            width: Dimensions.get("screen").width - 25,
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Text>Don't have an account yet?</Text>
          <Pressable onPress={() => router.replace("/sign-up")}>
            <Text
              style={{
                color: Colors[colorScheme ?? "light"].tint,
                fontWeight: "600",
              }}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
