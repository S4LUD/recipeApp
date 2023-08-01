import React, { memo } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TrendFood } from "@/util/tempData";
import { router } from "expo-router";

const TrendView = () => {
  return (
    <View style={HomeStyle.TrendingContainer}>
      <Text style={HomeStyle.TrendingTitle}>Recipes of the week</Text>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          gap: 15,
          marginTop: 15,
          paddingLeft: 15,
          paddingRight: 15,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {TrendFood.map((item) => {
          const {
            id,
            title,
            category,
            author,
            img,
          }: {
            id: number;
            title: string;
            category: string;
            author: string;
            img: string;
          } = item;

          return (
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/view_recipe",
                  params: {
                    id: id,
                    title: title,
                    category: category,
                    author: author,
                    img: img,
                  },
                });
              }}
              key={id}
              style={HomeStyle.TrendingRecipeContainer}
            >
              <View style={HomeStyle.TrendingTitleWrapper}>
                <View style={HomeStyle.TrendingCategory}>
                  <Text style={HomeStyle.TrendingCategoryTitle}>
                    {category}
                  </Text>
                </View>
                <View style={HomeStyle.TrendingDetails}>
                  <View style={HomeStyle.TrendingDetailsContainer}>
                    <View style={{ width: 95 }}>
                      <Text
                        numberOfLines={2}
                        style={HomeStyle.TrendingDetailsTitle}
                      >
                        {title}
                      </Text>
                    </View>
                    <Ionicons
                      name="ios-heart-outline"
                      size={20}
                      color="#FFFFFF"
                    />
                  </View>
                  <View style={HomeStyle.TrendingAdditionalInfo}>
                    <Text style={HomeStyle.TrendingAdditionalInfoTitle}>
                      {`By ${author}`}
                    </Text>
                  </View>
                </View>
              </View>
              <Image
                style={HomeStyle.TrendingRecipeImage}
                source={{ uri: "https://" + img }}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default memo(TrendView);

const HomeStyle = StyleSheet.create({
  TrendingContainer: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    paddingBottom: 15,
    paddingTop: 15,
    marginBottom: 10,
  },
  TrendingRecipeContainer: {
    position: "relative",
  },
  TrendingRecipeImage: {
    width: 188,
    height: 269,
    resizeMode: "cover",
    borderRadius: 10,
  },
  TrendingTitleWrapper: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 10,
    justifyContent: "space-between",
  },
  TrendingCategory: {
    backgroundColor: "rgba(0, 0, 0, 0.60)",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  TrendingCategoryTitle: {
    textTransform: "capitalize",
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  TrendingDetails: {
    backgroundColor: "rgba(69, 69, 69, 0.30)",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    height: 60,
    justifyContent: "space-between",
  },
  TrendingDetailsTitle: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  TrendingAdditionalInfo: {
    flexDirection: "row",
  },
  TrendingAdditionalInfoTitle: {
    color: "#D8D8D8",
    fontSize: 10,
  },
  TrendingDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  TrendingTitle: {
    fontSize: 16,
    fontWeight: "500",
    paddingLeft: 15,
  },
});
