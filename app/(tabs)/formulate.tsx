import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  useColorScheme,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { TextInput } from "react-native-paper";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/auth";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - (2 - 1) * 45) / 2;

interface CategoryButtonProps {
  category: string;
  selected: boolean;
  onPress: (category: string) => void;
}

const CategoryButton = ({
  category,
  selected,
  onPress,
}: CategoryButtonProps) => (
  <Pressable
    style={[styles.categoryButton, selected && styles.selectedCategoryButton]}
    onPress={() => onPress(category)}
  >
    <Text style={[selected && styles.selectedCategoryText]}>{category}</Text>
  </Pressable>
);

const RecipeCard = ({ recipe }: any) => {
  const { _id, title, categories, author, image } = recipe;

  const goToRecipeDetails = () => {
    router.push({
      pathname: "/seached_view_recipe",
      params: {
        _id: _id,
      },
    });
  };

  return (
    <Pressable
      onPress={() => goToRecipeDetails()}
      key={_id}
      style={[styles.RecipeContainer, { width: cardWidth }]}
    >
      <View style={styles.TitleWrapper}>
        <View style={styles.CategoriesContainer}>
          {categories.map((cat: string, index: number) => {
            return (
              <View key={index} style={styles.Category}>
                <Text style={styles.CategoryTitle}>{cat}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.Details}>
          <View style={styles.DetailsContainer}>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={2} style={styles.DetailsTitle}>
                {title}
              </Text>
            </View>
          </View>
          <View style={styles.AdditionalInfo}>
            <Text
              style={styles.AdditionalInfoTitle}
            >{`By ${author.name}`}</Text>
          </View>
        </View>
      </View>
      <Image
        style={[styles.RecipeImage, { width: cardWidth }]}
        source={{ uri: image }}
      />
    </Pressable>
  );
};

export default function Formulate() {
  const { getAllRecipe, AllRecipe } = useAuth();
  const { filterBy }: { filterBy: string } = useLocalSearchParams();
  const selectedCategory = filterBy ? [filterBy] : [];

  const colorScheme = useColorScheme();
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(selectedCategory);
  const [searchText, setSearchText] = useState<string>("");
  const [searchDelayTimeout, setSearchDelayTimeout] =
    useState<NodeJS.Timeout | null>(null); // State for the timeout

  const categories = [
    "Breakfast",
    "Brunch",
    "Lunch",
    "Dinner",
    "Starter",
    "Main",
    "Dessert",
  ];

  useEffect(() => {
    // Clear previous timeout whenever searchText or selectedCategories change
    if (searchDelayTimeout) {
      clearTimeout(searchDelayTimeout);
    }

    // Set a new timeout to trigger the search after a delay (e.g., 500ms)
    const newTimeout = setTimeout(() => {
      getAllRecipe(searchText, selectedCategories);
    }, 500);

    setSearchDelayTimeout(newTimeout); // Update the timeout state

    // Clean up the timeout on component unmount
    return () => {
      if (searchDelayTimeout) {
        clearTimeout(searchDelayTimeout);
      }
    };
  }, [searchText, selectedCategories]);

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
  const columns = 2;
  const matrix = Array.from(
    { length: Math.ceil(AllRecipe.length / columns) },
    (_, rowIndex) =>
      AllRecipe.slice(rowIndex * columns, rowIndex * columns + columns)
  );

  return (
    <View style={styles.Container}>
      <View style={{ paddingBottom: 15, paddingHorizontal: 15 }}>
        <TextInput
          style={{
            backgroundColor: "#F0F2F5",
          }}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          textColor="black"
          mode="outlined"
          outlineColor="transparent"
          activeOutlineColor={Colors[colorScheme ?? "light"].tint}
          label="Search"
        />
        <View style={{ paddingTop: 15 }}>
          <Text>Formulate by categories</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 5, paddingTop: 10, paddingBottom: 5 }}
          >
            {categories.map((category) => (
              <CategoryButton
                key={category}
                category={category}
                selected={selectedCategories.includes(category)}
                onPress={handleCategoryPress}
              />
            ))}
          </ScrollView>
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
            {row.map((item) => (
              <RecipeCard key={item._id} recipe={item} />
            ))}
            {/* Show empty space for last row if necessary */}
            {row.length < columns &&
              Array.from(Array(columns - row.length).keys()).map((i) => (
                <View
                  key={i}
                  style={{
                    width: cardWidth,
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
  selectedCategoryText: { color: "#FFFFFF" },
  selectedCategoryButton: {
    backgroundColor: "tomato",
    borderColor: "tomato",
  },
  categoryButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 15,
  },
  Container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  RecipeContainer: {
    position: "relative",
  },
  RecipeImage: {
    height: 236,
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
  CategoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
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
