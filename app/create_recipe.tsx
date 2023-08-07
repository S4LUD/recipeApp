import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/elements";
import DynamicIngredientsInputs, {
  IngredientsInputValue,
} from "@/components/DynamicIngredientsInputs";
import DynamicMethodsInputs, {
  MethodsInputValue,
} from "@/components/DynamicMethodsInputs";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/context/auth";

const LoadingIndicator = () => (
  <View
    style={{
      position: "absolute",
      zIndex: 1,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    }}
  >
    <ActivityIndicator animating={true} size={30} />
  </View>
);

const Create = () => {
  const { triggerCreateRecipes, createRecipeStatus } = useAuth();
  const colorScheme = useColorScheme();
  const headerHeight = useHeaderHeight();
  const [IngredientsData, setIngredientsData] = useState<
    IngredientsInputValue[]
  >([]);
  const [MethodsData, setMethodsData] = useState<MethodsInputValue[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>("");
  const [recipeTitle, setRecipeTitle] = useState<string | undefined>(undefined);
  const [recipeInfo, setRecipeInfo] = useState<string | undefined>(undefined);

  const categories = [
    "Breakfast",
    "Brunch",
    "Lunch",
    "Dinner",
    "Starter",
    "Main",
    "Dessert",
  ];

  const handleCategoryPress = useCallback((category: string) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter((cat) => cat !== category)
        : prevSelectedCategories.length < 4
        ? [...prevSelectedCategories, category]
        : prevSelectedCategories
    );
  }, []);

  const pickImage = useCallback(async () => {
    try {
      // No permissions request is necessary for launching the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      // Check if the result is not canceled and has valid assets
      if (
        !result.canceled &&
        result.assets.length > 0 &&
        result.assets[0].uri
      ) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  }, []);

  useEffect(() => {
    triggerCreateRecipes(
      image || "",
      recipeTitle || "",
      recipeInfo || "",
      IngredientsData,
      selectedCategories,
      MethodsData
    );
  }, [
    image,
    recipeTitle,
    recipeInfo,
    IngredientsData,
    selectedCategories,
    MethodsData,
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={headerHeight}
      enabled={true}
    >
      {createRecipeStatus && <LoadingIndicator />}
      <ScrollView
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].screenBackground,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Pressable
          style={{
            height: 300,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F0F2F5",
            gap: 10,
          }}
          onPress={() => pickImage()}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              resizeMode="cover"
              style={{ height: 300, width: "100%" }}
            />
          ) : (
            <>
              <Ionicons name="ios-fast-food-sharp" size={30} />
              <Text style={{ fontSize: 20 }}>Pick image</Text>
            </>
          )}
        </Pressable>
        <View
          style={{
            paddingHorizontal: 15,
            paddingTop: 10,
            paddingBottom: 15,
            backgroundColor: "#FFFFFF",
          }}
        >
          <TextInput
            style={{
              backgroundColor: "#F0F2F5",
            }}
            value={recipeTitle}
            onChangeText={(text) => setRecipeTitle(text)}
            textColor="black"
            mode="outlined"
            outlineColor="transparent"
            activeOutlineColor={Colors[colorScheme ?? "light"].tint}
            placeholder="Title: Apple Pie"
            placeholderTextColor="#D8D8D8"
          />
          <TextInput
            style={{
              backgroundColor: "#F0F2F5",
            }}
            value={recipeInfo}
            onChangeText={(text) => setRecipeInfo(text)}
            textColor="black"
            mode="outlined"
            outlineColor="transparent"
            activeOutlineColor={Colors[colorScheme ?? "light"].tint}
            multiline={true}
            numberOfLines={5}
            placeholder="Indulge your taste buds with a delightful array of food likes! From savory delights that dance on your tongue to sweet treats that melt in your mouth, there's something to please every palate. "
            placeholderTextColor="#D8D8D8"
          />
        </View>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            marginTop: 10,
            paddingHorizontal: 15,
          }}
        >
          <DynamicIngredientsInputs
            initialValues={IngredientsData}
            onDataChanged={(data) => setIngredientsData(data)}
          />
        </View>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            marginTop: 10,
            paddingHorizontal: 15,
          }}
        >
          <DynamicMethodsInputs
            initialValues={MethodsData}
            onDataChanged={(data) => setMethodsData(data)}
          />
        </View>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            marginTop: 10,
            paddingHorizontal: 15,
          }}
        >
          <View style={{ paddingVertical: 15 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 20, fontWeight: "600" }}>
                Categories
              </Text>
              <Text>{selectedCategories.length} of 4</Text>
            </View>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default memo(Create);
