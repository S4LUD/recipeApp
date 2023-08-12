import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/auth";
import { useState, useCallback } from "react";

const RecipeItem = ({ item }: any) => {
  const { _id, title, categories, image } = item;

  const goToRecipeDetails = () => {
    router.push({
      pathname: "/my_view_recipe",
      params: { _id: _id },
    });
  };

  return (
    <Pressable key={_id} onPress={() => goToRecipeDetails()}>
      <View style={styles.RecipesTitleWrapper}>
        <View style={styles.CategoriesContainer}>
          {categories.map((cat: any, index: number) => {
            return (
              <View key={index} style={styles.RecipesCategory}>
                <Text style={styles.RecipesCategoryTitle}>{cat}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.RecipesDetails}>
          <View style={styles.RecipesDetailsContainer}>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={3} style={styles.RecipesDetailsTitle}>
                {title}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <Image style={styles.RecipesRecipeImage} source={{ uri: image }} />
    </Pressable>
  );
};

export default function Recipe() {
  const [refreshing, setRefreshing] = useState(false);
  const { MyRecipe, fetchUserData } = useAuth();

  const columns = 2;

  const renderRecipeItem = ({ item }: any) => {
    return <RecipeItem item={item} />;
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData();
    setRefreshing(false);
  }, [fetchUserData]);

  return (
    <View style={styles.RecipesContainer}>
      {MyRecipe.length !== 0 ? (
        <FlatList
          data={MyRecipe}
          keyExtractor={(item) => item._id}
          numColumns={columns}
          renderItem={renderRecipeItem}
          contentContainerStyle={styles.scrollViewContent}
          columnWrapperStyle={{ gap: 15 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.centerContainer}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/create_recipe",
                params: {},
              })
            }
            style={styles.createButton}
          >
            <Text style={styles.createButtonText}>Create recipe</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    gap: 15,
    paddingVertical: 15,
    alignItems: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  createButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 5,
    backgroundColor: "#3CA2FA",
  },
  createButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  RecipesContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  RecipesRecipeContainer: {
    position: "relative",
  },
  RecipesRecipeImage: {
    width: 165,
    height: 236,
    resizeMode: "cover",
    borderRadius: 10,
  },
  RecipesTitleWrapper: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 10,
    justifyContent: "space-between",
  },
  CategoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  RecipesCategory: {
    backgroundColor: "rgba(0, 0, 0, 0.60)",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  RecipesCategoryTitle: {
    textTransform: "capitalize",
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  RecipesDetails: {
    backgroundColor: "rgba(69, 69, 69, 0.30)",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    height: 60,
    justifyContent: "space-between",
  },
  RecipesDetailsTitle: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  RecipesAdditionalInfo: {
    flexDirection: "row",
  },
  RecipesAdditionalInfoTitle: {
    color: "#D8D8D8",
    fontSize: 10,
  },
  RecipesDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
