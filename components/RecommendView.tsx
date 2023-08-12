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
      pathname: "/recommend_view_recipe",
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

const RecommendView = () => {
  const { RecommendFood, fetchRecommendation } = useAuth();

  const filterByCat = [
    "Breakfast",
    "Brunch",
    "Lunch",
    "Dinner",
    "Starter",
    "Main",
    "Dessert",
  ];

  useEffect(() => {
    fetchRecommendation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommendation</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 15 }}
        style={styles.categoryScrollView}
      >
        {filterByCat.map((item, index) => {
          return (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/search_filter_categories",
                  params: { filterBy: item },
                })
              }
              key={index}
              style={styles.categoryButton}
            >
              <Text>{item}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <ScrollView
        contentContainerStyle={styles.recipeScrollViewContent}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {RecommendFood.map((item) => (
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
  recipeContainer: {
    position: "relative",
  },
  recipeImage: {
    width: 150,
    height: 215,
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
  categoryButton: {
    backgroundColor: "#F0F2F5",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryScrollView: { marginTop: 10 },
  recipeScrollViewContent: {
    flexGrow: 1,
    gap: 15,
    marginTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
});

export default memo(RecommendView);
