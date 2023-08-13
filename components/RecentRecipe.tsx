import React, { useEffect, memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/context/auth";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - (2 - 1) * 45) / 2;

const RecipeCard = ({ recipe }: any) => {
  const { _id, title, categories, author, image } = recipe;

  const goToRecipeDetails = () => {
    router.push({
      pathname: "/recent_view_recipe",
      params: {
        _id: _id,
      },
    });
  };

  return (
    <Pressable
      onPress={goToRecipeDetails}
      style={[styles.recipeContainer, { width: cardWidth }]}
    >
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
            <View style={{ flex: 1 }}>
              <Text numberOfLines={2} style={styles.RecentDetailsTitle}>
                {title}
              </Text>
            </View>
          </View>
          <View style={styles.RecentAdditionalInfo}>
            <Text style={styles.RecentAdditionalInfoTitle}>
              {`By ${author.name}`}
            </Text>
          </View>
        </View>
      </View>
      <Image
        style={[styles.RecentRecipeImage, { width: cardWidth }]}
        source={{ uri: image }}
      />
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
      <View style={styles.scrollViewContent}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 15,
    paddingTop: 15,
    marginTop: 10,
  },
  recipeContainer: {
    position: "relative",
  },
  RecentRecipeImage: {
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
    height: 236,
  },
  scrollViewContent: {
    flex: 1,
    gap: 15,
    alignItems: "center",
    paddingTop: 15,
  },
  row: { flexDirection: "row", gap: 15 },
});

export default memo(RecentRecipe);
