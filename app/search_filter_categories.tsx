import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  useColorScheme,
} from "react-native";
import { RecentFood } from "@/util/tempData";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { TextInput } from "react-native-paper";
import Colors from "@/constants/Colors";

export default function FilterCat() {
  const { filterBy } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    filterBy,
  ]);
  const categories = [
    "Breakfast",
    "Brunch",
    "Lunch",
    "Dinner",
    "Starter",
    "Main",
    "Dessert",
  ];

  const handleCategoryPress = (category: string) => {
    if (selectedCategories.includes(category)) {
      // If the category is already selected, remove it from the selectedCategories array
      setSelectedCategories((prevSelectedCategories) =>
        prevSelectedCategories.filter((cat) => cat !== category)
      );
    } else {
      // If the category is not selected, add it to the selectedCategories array
      if (selectedCategories.length < 4) {
        setSelectedCategories((prevSelectedCategories) => [
          ...prevSelectedCategories,
          category,
        ]);
      }
    }
  };

  // Convert 1-dimensional array to 2-dimensional array
  const columns = 3;
  const rows = Math.ceil(RecentFood.length / columns);
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix[i] = RecentFood.slice(i * columns, i * columns + columns);
  }

  return (
    <View style={styles.Container}>
      <View style={{ paddingBottom: 15, paddingHorizontal: 15 }}>
        <TextInput
          style={{
            backgroundColor: "#F0F2F5",
          }}
          textColor="black"
          mode="outlined"
          outlineColor="transparent"
          activeOutlineColor={Colors[colorScheme ?? "light"].tint}
          label="Search"
        />
        <View style={{ paddingTop: 15 }}>
          <Text style={{}}>Filter by categories</Text>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              flexWrap: "wrap",
              paddingTop: 10,
            }}
          >
            {categories.map((category) => (
              <Pressable
                key={category}
                style={[
                  {
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderRadius: 15,
                  },
                  selectedCategories.includes(category) && {
                    backgroundColor: "tomato",
                    borderColor: "tomato",
                  },
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <Text
                  style={[
                    selectedCategories.includes(category) && {
                      color: "#FFFFFF",
                    },
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          gap: 15,
          // marginTop: 15,
          paddingLeft: 15,
          paddingRight: 15,
          paddingBottom: 15,
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
                  style={styles.RecipeContainer}
                >
                  <View style={styles.TitleWrapper}>
                    <View style={styles.Category}>
                      <Text style={styles.CategoryTitle}>{category}</Text>
                    </View>
                    <View style={styles.Details}>
                      <View style={styles.DetailsContainer}>
                        <View style={{ width: 80 }}>
                          <Text numberOfLines={2} style={styles.DetailsTitle}>
                            {title}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.AdditionalInfo}>
                        <Text style={styles.AdditionalInfoTitle}>
                          {`By ${author}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Image
                    style={styles.RecipeImage}
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
                    width: 105,
                    height: 150,
                  }}
                ></View>
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 15,
  },
  RecipeContainer: {
    position: "relative",
  },
  RecipeImage: {
    width: 105,
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
  },
  TitleWrapper: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 10,
    justifyContent: "space-between",
  },
  Category: {
    backgroundColor: "rgba(0, 0, 0, 0.60)",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  CategoryTitle: {
    textTransform: "capitalize",
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  Details: {
    backgroundColor: "rgba(69, 69, 69, 0.30)",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    height: 60,
    justifyContent: "space-between",
  },
  DetailsTitle: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  AdditionalInfo: {
    flexDirection: "row",
  },
  AdditionalInfoTitle: {
    color: "#D8D8D8",
    fontSize: 10,
  },
  DetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
