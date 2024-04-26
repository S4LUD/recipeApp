import {
  View,
  Text,
  useColorScheme,
  Pressable,
  StatusBar,
  ScrollView,
} from "react-native";
import { ActivityIndicator, TextInput } from "react-native-paper";
import Colors from "@/constants/Colors";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";

export default function Signout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { signUp, signUpStatus } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassowrd] = useState<string>("");
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassowrd] = useState<string>("");
  const [isError, setError] = useState<string | null>(null);
  const [isSuccess, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      if (e.data.action.type === "GO_BACK") return;
      navigation.dispatch(e.data.action);
    });
  }, [navigation]);

  const _signUp = async () => {
    if (username)
      if (/\s/.test(username)) {
        return setError("The username must not contain spaces.");
      }

    if (password)
      if (/\s/.test(password)) {
        return setError("The password must not contain spaces.");
      }

    if (password !== confirmPassword) {
      setSuccess("");
      setError("Password do not match");
    } else {
      setError("");
      setSuccess("Password matched");
    }

    const result = await signUp(username, password, firstName, lastName);
    if (result?.status === false) {
      setError(result.message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
      }}
    >
      {signUpStatus && (
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
      <ScrollView>
        <View
          style={{
            paddingTop: StatusBar.currentHeight,
            paddingHorizontal: 15,
          }}
        >
          <View
            style={{
              flex: 1,
              paddingTop: 25,
              gap: 15,
            }}
          >
            <Text
              style={{ fontSize: 24, fontWeight: "600", alignSelf: "center" }}
            >
              SIGNOUT
            </Text>
            <View style={{ flexDirection: "row", gap: 15 }}>
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: "#F0F2F5",
                }}
                onChangeText={(text) => setFirstName(text)}
                textColor="black"
                mode="flat"
                outlineColor="transparent"
                activeOutlineColor={Colors[colorScheme ?? "light"].tint}
                label="First Name"
              />
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: "#F0F2F5",
                }}
                onChangeText={(text) => setLastName(text)}
                textColor="black"
                mode="flat"
                outlineColor="transparent"
                activeOutlineColor={Colors[colorScheme ?? "light"].tint}
                label="Last Name"
              />
            </View>
            <TextInput
              style={{
                backgroundColor: "#F0F2F5",
              }}
              onChangeText={(text) => setUsername(text)}
              keyboardType="visible-password" // This prevents spaces from being entered
              textColor="black"
              mode="flat"
              outlineColor="transparent"
              activeOutlineColor={Colors[colorScheme ?? "light"].tint}
              label="Username"
            />
            <View>
              <TextInput
                style={{
                  backgroundColor: "#F0F2F5",
                }}
                onChangeText={(text) => setPassowrd(text)}
                textColor="black"
                mode="flat"
                outlineColor="transparent"
                activeOutlineColor={Colors[colorScheme ?? "light"].tint}
                label="Password"
                secureTextEntry={true}
              />
            </View>
            <TextInput
              style={{
                backgroundColor: "#F0F2F5",
              }}
              onChangeText={(text) => setConfirmPassowrd(text)}
              textColor="black"
              mode="flat"
              outlineColor="transparent"
              activeOutlineColor={Colors[colorScheme ?? "light"].tint}
              label="Confirm password"
              secureTextEntry={true}
            />
            {isError && (
              <Text style={{ fontSize: 12, color: "#FA3636" }}>{isError}</Text>
            )}
            {isSuccess && (
              <Text style={{ fontSize: 12, color: "#8FD04E" }}>
                {isSuccess}
              </Text>
            )}
            <Pressable
              style={{
                backgroundColor: Colors[colorScheme ?? "light"].tint,
                alignItems: "center",
                paddingVertical: 15,
                borderRadius: 5,
              }}
              onPress={() => _signUp()}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: Colors[colorScheme ?? "light"].primary,
                }}
              >
                Signup
              </Text>
            </Pressable>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 10,
                alignItems: "center",
                paddingBottom: 15,
              }}
            >
              <Text>Already have an account yet?</Text>
              <Pressable onPress={() => router.replace("/sign-in")}>
                <Text
                  style={{
                    color: Colors[colorScheme ?? "light"].tint,
                    fontWeight: "600",
                  }}
                >
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
