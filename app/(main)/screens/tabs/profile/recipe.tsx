import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  useColorScheme,
} from "react-native";
import { RecommendFood } from "@/util/tempData";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "@/constants/Colors";

export default function Recipe() {
  const colorScheme = useColorScheme();

  // Calculate number of columns and rows
  const empty = true;
  const columns = 2;
  const rows = Math.ceil(RecommendFood.length / columns);
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix[i] = RecommendFood.slice(i * columns, i * columns + columns);
  }

  return (
    <View style={styles.RecipesContainer}>
      {empty ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(main)/screens/create_recipe",
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
        </View>
      ) : (
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
        >
          {matrix.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: "row", gap: 15 }}>
              {row.map((item) => (
                <View key={item.id} style={styles.RecipesRecipeContainer}>
                  <View style={styles.RecipesTitleWrapper}>
                    <View style={styles.RecipesCategory}>
                      <Text style={styles.RecipesCategoryTitle}>
                        {item.category}
                      </Text>
                    </View>
                    <View style={styles.RecipesDetails}>
                      <View style={styles.RecipesDetailsContainer}>
                        <View style={{ width: 95 }}>
                          <Text
                            numberOfLines={2}
                            style={styles.RecipesDetailsTitle}
                          >
                            {item.title}
                          </Text>
                        </View>
                        <Ionicons
                          name="ios-ellipsis-vertical"
                          size={20}
                          color="white"
                        />
                      </View>
                      <View style={styles.RecipesAdditionalInfo}>
                        <Text style={styles.RecipesAdditionalInfoTitle}>
                          {`By ${item.author}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Image
                    style={styles.RecipesRecipeImage}
                    source={{ uri: "https://" + item.img }}
                  />
                </View>
              ))}
              {/* Show empty space for last row if necessary */}
              {row.length < columns &&
                Array.from(Array(columns - row.length).keys()).map((i) => (
                  <View
                    key={i}
                    style={{
                      width: 165,
                      height: 236,
                    }}
                  ></View>
                ))}
            </View>
          ))}
        </ScrollView>
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
