import React, { useEffect, memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/context/auth";

const RecipeCard = ({ recipe }: any) => {
  const { _id, userId, title, categories, author, image } = recipe;

  const goToRecipeDetails = () => {
    router.push({
      pathname: "/recent_view_recipe",
      params: {
        _id: _id,
      },
    });
  };

  return (
    <Pressable onPress={goToRecipeDetails} style={styles.recipeContainer}>
      <View style={styles.RecentTitleWrapper}>
        <View style={styles.CategoriesContainer}>
          {categories.map((cat: string, index: number) => {
            return (
              <View key={index} style={styles.RecentCategory}>
                <Text style={styles.RecentCategoryTitle}>{cat}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.RecentDetails}>
          <View style={styles.RecentDetailsContainer}>
            <View style={{ width: 95 }}>
              <Text numberOfLines={2} style={styles.RecentDetailsTitle}>
                {title}
              </Text>
            </View>
            <Ionicons name="ios-heart-outline" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.RecentAdditionalInfo}>
            <Text style={styles.RecentAdditionalInfoTitle}>
              {`By ${author.name}`}
            </Text>
          </View>
        </View>
      </View>
      <Image style={styles.RecentRecipeImage} source={{ uri: image }} />
    </Pressable>
  );
};

const RecentRecipe = () => {
  const { RecentRecipe, fetchRecentRecipe } = useAuth();

  useEffect(() => {
    fetchRecentRecipe();
  }, []);

  const columns = 2;
  const matrix = Array.from(
    { length: Math.ceil(RecentRecipe.length / columns) },
    (_, rowIndex) =>
      RecentRecipe.slice(rowIndex * columns, rowIndex * columns + columns)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Recipe</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {matrix.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item) => (
              <RecipeCard key={item._id} recipe={item} />
            ))}
            {row.length < columns &&
              Array.from(Array(columns - row.length).keys()).map((i) => (
                <View key={i} style={styles.emptyColumn}></View>
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 15,
    paddingTop: 15,
  },
  recipeContainer: {
    position: "relative",
  },
  RecentRecipeImage: {
    width: 165,
    height: 236,
    resizeMode: "cover",
    borderRadius: 10,
  },
  CategoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  RecentTitleWrapper: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 10,
    justifyContent: "space-between",
  },
  RecentCategory: {
    backgroundColor: "rgba(0, 0, 0, 0.60)",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  RecentCategoryTitle: {
    textTransform: "capitalize",
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  RecentDetails: {
    backgroundColor: "rgba(69, 69, 69, 0.30)",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    height: 60,
    justifyContent: "space-between",
  },
  RecentDetailsTitle: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  RecentAdditionalInfo: {
    flexDirection: "row",
  },
  RecentAdditionalInfoTitle: {
    color: "#D8D8D8",
    fontSize: 10,
  },
  RecentDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    paddingLeft: 15,
  },
  emptyColumn: {
    width: 165,
    height: 236,
  },
  scrollViewContent: {
    flexGrow: 1,
    gap: 15,
    marginTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: "center",
  },
  row: { flexDirection: "row", gap: 15 },
});

export default memo(RecentRecipe);
