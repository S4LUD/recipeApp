import React, { memo, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  Pressable,
  Share,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import LetterProfile from "@/components/LetterProfile";
import ShowMoreText from "@/components/ShowMoreText";
import { useAuth } from "@/context/auth";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const EXPO_PUBLIC_API_URL = Constants?.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

const Viewer = () => {
  const params = useLocalSearchParams();
  const { _id } = params as any;
  const { user, MyRecipes, triggerUpdateRecipeID, GetMyRecipes } = useAuth();
  const [cmmnts, setCmmnts] = useState<string>("");
  const [loadingComments, setLoadingComments] = useState(false);

  const recipe = MyRecipes.filter((item: any) => {
    return item._id === _id;
  });

  const sortedMethods = recipe[0].methods
    .slice()
    .sort(
      (a: { number: number }, b: { number: number }) => a.number - b.number
    );

  useEffect(() => {
    triggerUpdateRecipeID(_id);
  });

  const HandleComment = async () => {
    const storedToken = await SecureStore.getItemAsync("token");

    if (storedToken) {
      setLoadingComments(true);
      await axios
        .request({
          method: "patch",
          maxBodyLength: Infinity,
          url: `${EXPO_PUBLIC_API_URL}/api/user/recipe/comment`,
          headers: {
            authorization_r: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            comment: cmmnts,
            recipe_id: _id,
            user_id: user?._id,
          }),
        })
        .then((response) => {
          if (response.data) {
            setCmmnts("");
            GetMyRecipes();
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoadingComments(false);
        });
    }
  };

  const generateInitials = (name: string) => {
    const nameWords = name.split(" ");
    return nameWords
      .map((word: string) => word.charAt(0).toUpperCase())
      .join("");
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      bounces={false}
      contentContainerStyle={{
        backgroundColor: "white",
      }}
    >
      <Image style={styles.foodImage} source={{ uri: recipe[0].image }} />
      <View style={styles.content}>
        <Text style={styles.title}>{recipe[0].title}</Text>
        <View style={styles.userContent}>
          {recipe[0].userId.image ? (
            <Image
              source={{ uri: recipe[0].userId.image }}
              style={{ height: 50, width: 50, borderRadius: 50 }}
            />
          ) : (
            <LetterProfile
              name={recipe[0].author.name}
              size={50}
              fontSize={16}
              backgroundColor="#D4E2D4"
              textColor="#000000"
            />
          )}
          <View style={styles.userInfo}>
            <Text>{recipe[0].author.name}</Text>
            <Text>@{recipe[0].author.username}</Text>
          </View>
        </View>
        <View>
          <Pressable
            onPress={() =>
              Share.share({
                message: `https://recipe-app-36uf.onrender.com/?_id=${_id}`,
                url: `https://recipe-app-36uf.onrender.com/?_id=${_id}`,
              })
            }
            style={{
              marginVertical: 15,
              backgroundColor: "#3CA2FA",
              paddingVertical: 5,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Share</Text>
          </Pressable>
        </View>
        <View style={styles.detailsContent}>
          <ShowMoreText fontSize={16} text={recipe[0].info} maxLength={100} />
        </View>
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 22, fontWeight: "500", paddingBottom: 20 }}>
            Ingredients
          </Text>
          {recipe[0].ingredients.map((ingredient: any, index: number) => {
            const isSection = ingredient.isSection;
            const showMargin = index > 0 && isSection; // Determine whether to show margin
            return (
              <View key={index} style={{ marginTop: showMargin ? 10 : 0 }}>
                <Text
                  style={[
                    styles.ingredientText,
                    {
                      fontSize: isSection ? 18 : 16,
                      fontWeight: isSection ? "600" : "400",
                    },
                  ]}
                >
                  {ingredient.value}
                </Text>
                {index !== recipe[0].ingredients.length - 1 && !isSection && (
                  <View
                    style={[
                      styles.separator,
                      {
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderStyle:
                          Platform.OS !== "ios" ? "dashed" : undefined,
                      },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
        <Animated.View
          style={{
            borderBottomColor: "gray",
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderStyle: "solid",
            marginVertical: 30,
          }}
        />
        <View>
          <Text style={{ fontSize: 22, fontWeight: "500", paddingBottom: 20 }}>
            Methods
          </Text>
          {sortedMethods.map((method: any, index: number) => {
            return (
              <View style={styles.methodContainer} key={index}>
                <View style={styles.circle}>
                  <Text style={styles.number}>{method.number}</Text>
                </View>
                <View style={styles.methodTextContainer}>
                  <Text style={styles.methodText}>{method.value}</Text>
                  {method.secure_url && (
                    <Image
                      source={{ uri: method.secure_url }}
                      style={{
                        height: 200,
                        borderRadius: 5,
                        marginTop: 10,
                      }}
                    />
                  )}
                </View>
              </View>
            );
          })}
        </View>
        <View>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={{ flex: 1 }}
              contentStyle={{
                backgroundColor: "white",
              }}
              mode="flat"
              placeholder="Write feedback here..."
              value={cmmnts}
              onChangeText={(text) => setCmmnts(text)}
              textColor="black"
              disabled={loadingComments}
              multiline={true}
            />
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => HandleComment()}
              disabled={loadingComments}
            >
              {loadingComments ? (
                <ActivityIndicator size="large" color="#72D82D" />
              ) : (
                <Ionicons name="send" color="#3CA2FA" size={24} />
              )}
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 20, paddingVertical: 20, gap: 10 }}>
            {recipe[0].comments_id.map((item: any, index: number) => {
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: "#F2F2F2",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 5,
                    flexDirection: "row",
                    gap: 15,
                    alignItems: "center",
                  }}
                >
                  {item.user_id.image ? (
                    <Image
                      style={{ height: 40, width: 40, borderRadius: 100 }}
                      source={{ uri: item.user_id.image }}
                    />
                  ) : (
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#3CA2FA",
                        height: 40,
                        width: 40,
                        borderRadius: 100,
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 18,
                          fontWeight: "600",
                        }}
                      >
                        {generateInitials(
                          `${item.user_id.firstName} ${item.user_id.lastName}`
                        )}
                      </Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <View>
                      <Text
                        style={{ fontWeight: "600" }}
                      >{`${item.user_id.firstName} ${item.user_id.lastName}`}</Text>
                    </View>
                    <Text>{item.comment}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default memo(Viewer);

const styles = StyleSheet.create({
  foodImage: {
    // width: 150,
    height: 300,
    resizeMode: "cover",
  },
  content: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  title: { fontSize: 24, fontWeight: "500" },
  userContent: {
    marginTop: 15,
    flexDirection: "row",
    gap: 10,
  },
  userInfo: {
    gap: 3,
  },
  detailsContent: {
    marginTop: 15,
  },
  ingredientText: {
    paddingVertical: 5,
  },
  separator: {
    borderBottomColor: "gray",
    marginVertical: 5,
  },
  methodContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#454545",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  number: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  methodTextContainer: {
    flex: 1,
  },
  methodText: {
    fontSize: 16,
  },
});
