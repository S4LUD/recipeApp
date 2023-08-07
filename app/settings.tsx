import React, { memo, useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  useColorScheme,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { useAuth } from "@/context/auth";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import mimeType from "react-native-mime-types";
import path from "path";

const LoadingIndicator = () => (
  <View
    style={{
      position: "absolute",
      zIndex: 1,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    }}
  >
    <ActivityIndicator animating={true} size={30} />
  </View>
);

const Settings = () => {
  const {
    user,
    useUpdateProfile,
    uploadProfileImageLoading,
    uploadProfileLoading,
    signOut,
    _useUpdate,
  } = useAuth();
  const colorScheme = useColorScheme();

  const [image, setImage] = useState<string | undefined>(
    user?.image ? user?.image : undefined
  );
  const [firstName, setFirstName] = useState<string | undefined>(
    user?.firstName ? user?.firstName : undefined
  );
  const [lastName, setLastName] = useState<string | undefined>(
    user?.lastName ? user?.lastName : undefined
  );
  const [bio, setBio] = useState<string | undefined>(
    user?.bio ? user?.bio : undefined
  );

  const fullName: string = `${user?.firstName} ${user?.lastName}`;

  const pickImage = useCallback(async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // Check if the result is not canceled and has valid assets
    if (!result.canceled && result.assets.length > 0 && result.assets[0].uri) {
      const imageType: string | false = mimeType.lookup(result.assets[0].uri);

      if (typeof imageType === "string") {
        useUpdateProfile(
          result.assets[0].uri,
          imageType,
          path.basename(result.assets[0].uri)
        );
      } else {
        console.error("Could not determine image type.");
      }
    }
  }, []);

  const generateInitials = (name: string) => {
    const nameWords = name.split(" ");
    return nameWords
      .map((word: string) => word.charAt(0).toUpperCase())
      .join("");
  };

  useEffect(() => {
    if (user?.image !== null && user?.image !== undefined) {
      setImage(user?.image);
    }
  }, [user?.image]);

  useEffect(() => {
    _useUpdate(firstName, lastName, bio);
  }, [firstName, lastName, bio]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].screenBackground,
      }}
    >
      {(uploadProfileLoading || uploadProfileImageLoading) && (
        <LoadingIndicator />
      )}
      <ScrollView>
        <View
          style={{
            gap: 10,
          }}
        >
          <View
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].primary,
              alignItems: "center",
              justifyContent: "center",
              height: 155,
            }}
          >
            {image ? (
              <Image
                style={styles.userImage}
                source={{
                  uri: image,
                }}
              />
            ) : (
              <View
                style={[
                  styles.userImage,
                  {
                    backgroundColor: "#F1F6F9",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text
                  style={{
                    color: "#9BA4B5",
                    fontSize: 40,
                    fontWeight: "600",
                  }}
                >
                  {generateInitials(fullName)}
                </Text>
              </View>
            )}
            <View style={{ position: "absolute", right: 125, bottom: 20 }}>
              <Pressable
                onPress={() => pickImage()}
                style={{
                  backgroundColor: Colors[colorScheme ?? "light"].primary,
                  padding: 5,
                  borderRadius: 100,
                }}
              >
                <Ionicons name="ios-camera" size={20} />
              </Pressable>
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
            <View style={{ flexDirection: "row", gap: 15 }}>
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: "#F0F2F5",
                }}
                value={firstName}
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
                value={lastName}
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
              value={bio}
              onChangeText={(text) => setBio(text)}
              textColor="black"
              mode="flat"
              outlineColor="transparent"
              activeOutlineColor={Colors[colorScheme ?? "light"].tint}
              label="Bio"
              multiline={true}
              maxLength={200}
            />
          </View>
        </View>
      </ScrollView>
      <View>
        <View
          style={{
            marginTop: 10,
            backgroundColor: "#FFFFFF",
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
        <Text style={{ color: "#9E9FA5", alignSelf: "center" }}>
          Version {Constants.expoConfig?.version}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userImage: { height: 125, width: 125, borderRadius: 100 },
});

export default memo(Settings);
