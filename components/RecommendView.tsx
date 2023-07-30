import React, { memo } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RecommendFood } from "@/util/tempData";
import { router } from "expo-router";

const RecommendView = () => {
  const filterByCat = [
    "Breakfast",
    "Brunch",
    "Lunch",
    "Dinner",
    "Starter",
    "Main",
    "Dessert",
  ];

  return (
    <View style={styles.RecommendContainer}>
      <Text style={styles.RecommendTitle}>Recommendation</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 15 }}
        style={{ marginTop: 10 }}
      >
        {filterByCat.map((item, index) => {
          return (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(main)/screens/search_filter_categories",
                  params: { filterBy: item },
                })
              }
              key={index}
              style={styles.CategoryButton}
            >
              <Text>{item}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
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
        {RecommendFood.map((item) => {
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
                  pathname: "/(main)/screens/view_recipe",
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
              style={styles.RecommendRecipeContainer}
            >
              <View style={styles.RecommendTitleWrapper}>
                <View style={styles.RecommendCategory}>
                  <Text style={styles.RecommendCategoryTitle}>{category}</Text>
                </View>
                <View style={styles.RecommendDetails}>
                  <View style={styles.RecommendDetailsContainer}>
                    <View style={{ width: 95 }}>
                      <Text
                        numberOfLines={2}
                        style={styles.RecommendDetailsTitle}
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
                  <View style={styles.RecommendAdditionalInfo}>
                    <Text style={styles.RecommendAdditionalInfoTitle}>
                      {`By ${author}`}
                    </Text>
                  </View>
                </View>
              </View>
              <Image
                style={styles.RecommendRecipeImage}
                source={{ uri: "https://" + img }}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default memo(RecommendView);

const styles = StyleSheet.create({
  RecommendContainer: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    paddingBottom: 15,
    paddingTop: 15,
  },
  RecommendRecipeContainer: {
    position: "relative",
  },
  RecommendRecipeImage: {
    width: 150,
    height: 215,
    resizeMode: "cover",
    borderRadius: 10,
  },
  RecommendTitleWrapper: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 10,
    justifyContent: "space-between",
  },
  RecommendCategory: {
    backgroundColor: "rgba(0, 0, 0, 0.60)",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  RecommendCategoryTitle: {
    textTransform: "capitalize",
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  RecommendDetails: {
    backgroundColor: "rgba(69, 69, 69, 0.30)",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    height: 60,
    justifyContent: "space-between",
  },
  RecommendDetailsTitle: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  RecommendAdditionalInfo: {
    flexDirection: "row",
  },
  RecommendAdditionalInfoTitle: {
    color: "#D8D8D8",
    fontSize: 10,
  },
  RecommendDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  RecommendTitle: {
    fontSize: 16,
    fontWeight: "500",
    paddingLeft: 15,
  },
  CategoryButton: {
    backgroundColor: "#F0F2F5",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
