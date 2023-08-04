import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  Dimensions,
  Pressable,
  StatusBar,
} from "react-native";
import { TextInput } from "react-native-paper";
import Colors from "@/constants/Colors";
import { router, useNavigation } from "expo-router";
import { useEffect } from "react";

export default function Signout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      if (e.data.action.type === "GO_BACK") return;
      navigation.dispatch(e.data.action);
    });
  }, [navigation]);

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: "#FFFFFF",
      }}
      keyboardShouldPersistTaps="never"
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          paddingTop: 25,
          gap: 15,
        }}
      >
        <View>
          <Text style={{ fontSize: 24, fontWeight: "600" }}>SIGNOUT</Text>
        </View>
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
          label="Confirm password"
          secureTextEntry={true}
        />
        <Pressable
          style={{
            width: Dimensions.get("screen").width - 25,
            backgroundColor: Colors[colorScheme ?? "light"].tint,
            alignItems: "center",
            paddingVertical: 15,
            borderRadius: 5,
          }}
          onPress={() => console.log("Pressed")}
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
            width: Dimensions.get("screen").width - 25,
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
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
    </ScrollView>
  );
}
