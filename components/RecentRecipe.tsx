import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { RecentFood } from "@/util/tempData";
import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { router } from "expo-router";

const RecentRecipe = () => {
  // Convert 1-dimensional array to 2-dimensional array
  const columns = 2;
  const rows = Math.ceil(RecentFood.length / columns);
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix[i] = RecentFood.slice(i * columns, i * columns + columns);
  }

  return (
    <View style={styles.RecentContainer}>
      <Text style={styles.RecentTitle}>Recent Recipe</Text>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          gap: 15,
          marginTop: 15,
          paddingLeft: 15,
          paddingRight: 15,
          // paddingBottom: 15,
          alignItems: "center",
        }}
        alwaysBounceVertical={false}
      >
        {matrix.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: "row", gap: 15 }}>
            {row.map((item) => {
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
                  style={styles.RecentRecipeContainer}
                >
                  <View style={styles.RecentTitleWrapper}>
                    <View style={styles.RecentCategory}>
                      <Text style={styles.RecentCategoryTitle}>{category}</Text>
                    </View>
                    <View style={styles.RecentDetails}>
                      <View style={styles.RecentDetailsContainer}>
                        <View style={{ width: 95 }}>
                          <Text
                            numberOfLines={2}
                            style={styles.RecentDetailsTitle}
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
                      <View style={styles.RecentAdditionalInfo}>
                        <Text style={styles.RecentAdditionalInfoTitle}>
                          {`By ${author}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Image
                    style={styles.RecentRecipeImage}
                    source={{ uri: "https://" + img }}
                  />
                </Pressable>
              );
            })}
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
    </View>
  );
};

export default memo(RecentRecipe);

const styles = StyleSheet.create({
  RecentContainer: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 15,
    paddingTop: 15,
  },
  RecentRecipeContainer: {
    position: "relative",
  },
  RecentRecipeImage: {
    width: 165,
    height: 236,
    resizeMode: "cover",
    borderRadius: 10,
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
  RecentTitle: {
    fontSize: 16,
    fontWeight: "500",
    paddingLeft: 15,
  },
});
