import {
  View,
  Text,
  StyleSheet,
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
  const containsLowercase = /[a-z]/.test(password);
  const containsUppercase = /[A-Z]/.test(password);
  const isAtLeast6Characters = password.length >= 6;
  const containsLetter = /[a-zA-Z]/.test(password);
  const containsDigit = /[0-9]/.test(password);
  const containsSpecialChar = /[_\-.]/.test(password);

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      if (e.data.action.type === "GO_BACK") return;
      navigation.dispatch(e.data.action);
    });
  }, [navigation]);

  const _signUp = async () => {
    const result = await signUp(username, password, firstName, lastName);
    if (result?.status === false) {
      setError(result.message);
    }
  };

  useEffect(() => {
    if (confirmPassword !== "") {
      if (password !== confirmPassword) {
        setSuccess("");
        setError("Password do not match");
      } else {
        setError("");
        setSuccess("Password matched");
      }
    }
  }, [confirmPassword]);

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
              <View style={{ marginTop: 5 }}>
                <Text
                  style={[
                    styles.validationText,
                    isAtLeast6Characters ? {} : styles.invalid,
                  ]}
                >
                  At least 6 characters in length.
                </Text>
                <Text
                  style={[
                    styles.validationText,
                    containsLowercase ? {} : styles.invalid,
                  ]}
                >
                  Contains at least one lowercase.
                </Text>
                <Text
                  style={[
                    styles.validationText,
                    containsUppercase ? {} : styles.invalid,
                  ]}
                >
                  Contains at least one uppercase.
                </Text>
                <Text
                  style={[
                    styles.validationText,
                    containsLetter ? {} : styles.invalid,
                  ]}
                >
                  Contains at least one letter.
                </Text>
                <Text
                  style={[
                    styles.validationText,
                    containsDigit ? {} : styles.invalid,
                  ]}
                >
                  Contains at least one digit.
                </Text>
                <Text
                  style={[
                    styles.validationText,
                    containsSpecialChar ? {} : styles.invalid,
                  ]}
                >
                  Contains at least one of underscore (_), period (.), or hyphen
                  (-).
                </Text>
              </View>
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

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  validationText: {
    color: "green",
    fontSize: 12,
  },
  invalid: {
    color: "red",
  },
});
