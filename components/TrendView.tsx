import React, { memo, useCallback, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/auth";

const RecipeCard = ({ recipe }: any) => {
  const { _id, title, categories, author, image } = recipe;

  const goToRecipeDetails = useCallback(() => {
    router.push({
      pathname: "/trend_view_recipe",
      params: {
        _id: _id,
      },
    });
  }, [_id]);

  return (
    <Pressable onPress={goToRecipeDetails} style={styles.recipeContainer}>
      <View style={styles.titleWrapper}>
        <View style={styles.categoriesContainer}>
          {categories.map((cat: string, index: number) => {
            return (
              <View key={index} style={styles.category}>
                <Text style={styles.categoryTitle}>{cat}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.details}>
          <View style={styles.detailsContainer}>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={2} style={styles.detailsTitle}>
                {title}
              </Text>
            </View>
          </View>
          <View style={styles.additionalInfo}>
            <Text style={styles.additionalInfoTitle}>
              {`By ${author?.name}`}
            </Text>
          </View>
        </View>
      </View>
      <Image style={styles.recipeImage} source={{ uri: image }} />
    </Pressable>
  );
};

const TrendView = () => {
  const { TopRecipe, fetchTopRecipe } = useAuth();

  useEffect(() => {
    fetchTopRecipe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipes of the week</Text>
      <ScrollView
        contentContainerStyle={styles.recipeScrollViewContent}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {TopRecipe.map((item) => (
          <RecipeCard key={item._id} recipe={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    paddingBottom: 15,
    paddingTop: 15,
  },
  recipeContainer: {
    position: "relative",
  },
  recipeImage: {
    width: 188,
    height: 269,
    resizeMode: "cover",
    borderRadius: 10,
  },
  titleWrapper: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 10,
    justifyContent: "space-between",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  category: {
    backgroundColor: "rgba(0, 0, 0, 0.60)",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  categoryTitle: {
    textTransform: "capitalize",
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  details: {
    backgroundColor: "rgba(69, 69, 69, 0.30)",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    height: 60,
    justifyContent: "space-between",
  },
  detailsTitle: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  additionalInfo: {
    flexDirection: "row",
  },
  additionalInfoTitle: {
    color: "#D8D8D8",
    fontSize: 10,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    paddingLeft: 15,
  },
  recipeScrollViewContent: {
    flexGrow: 1,
    gap: 15,
    marginTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
});

export default memo(TrendView);
