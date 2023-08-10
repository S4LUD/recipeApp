import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  useColorScheme,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/auth";
import { useEffect, useState, useCallback } from "react";
import { ActivityIndicator } from "react-native-paper";

const RecipeItem = ({ recipe, columns }: any) => {
  return (
    <View style={{ flexDirection: "row", gap: 15 }}>
      {recipe.map((_item: any, _index: number) => {
        const { _id, title, categories, image, author } = _item;

        return (
          <Pressable
            key={_id}
            onPress={() =>
              router.push({
                pathname: "/my_view_recipe",
                params: { _id: _id },
              })
            }
          >
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
                <View style={styles.RecipesAdditionalInfo}>
                  <Text style={styles.RecipesAdditionalInfoTitle}>
                    {`By ${author?.name}`}
                  </Text>
                </View>
              </View>
            </View>
            <Image style={styles.RecipesRecipeImage} source={{ uri: image }} />
          </Pressable>
        );
      })}
      {recipe.length < columns &&
        Array.from(Array(columns - recipe.length).keys()).map((i) => (
          <View
            key={i}
            style={{
              width: 165,
              height: 236,
            }}
          ></View>
        ))}
    </View>
  );
};

export default function Recipe() {
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { MyPersonalRecipes, myRecipes } = useAuth();

  useEffect(() => {
    MyPersonalRecipes();
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  // Calculate number of columns and rows
  const columns = 2;
  const rows = Math.ceil(myRecipes.length / columns);
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix[i] = myRecipes.slice(i * columns, i * columns + columns);
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      MyPersonalRecipes();
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.RecipesContainer}>
      {matrix.length !== 0 ? (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            gap: 15,
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: 15,
            paddingBottom: 15,
            alignItems: "center",
          }}
          alwaysBounceVertical={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {matrix.map((recipe: any, index: number) => {
            return <RecipeItem key={index} recipe={recipe} columns={columns} />;
          })}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator size={30} />
          ) : (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/create_recipe",
                  params: {},
                })
              }
              style={{
                paddingHorizontal: 15,
                paddingVertical: 6,
                borderRadius: 5,
                backgroundColor: Colors[colorScheme ?? "light"].tint,
              }}
            >
              <Text style={{ fontSize: 16, color: "#FFFFFF" }}>
                Create recipe
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
