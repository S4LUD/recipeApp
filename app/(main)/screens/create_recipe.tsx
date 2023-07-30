import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { memo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/elements";
import DynamicIngredientsInputs, {
  IngredientsInputValue,
} from "@/components/DynamicIngredientsInputs";
import DynamicMethodsInputs, {
  MethodsInputValue,
} from "@/components/DynamicMethodsInputs";

const Create = () => {
  const colorScheme = useColorScheme();
  const headerHeight = useHeaderHeight();
  const [IngredientsData, setIngredientsData] = useState<
    IngredientsInputValue[]
  >([
    {
      id: "54672e68-211f-422e-9b8b-95361c5d8f2b",
      value: "",
      placeholder: "Cilantro - A handful",
    },
    {
      id: "b784cf7b-d885-4a3e-8e66-630a4d622cdd",
      value: "",
      placeholder: "Paprika - 1 tsp (5g)",
    },
  ]);
  const [MethodsData, setMethodsData] = useState<MethodsInputValue[]>([
    {
      id: "54672e68-211f-422e-9b8b-95361c5d8f2b",
      value: "",
      placeholder: "Heat oil in a cooking pot.",
    },
    {
      id: "b784cf7b-d885-4a3e-8e66-630a4d622cdd",
      value: "",
      placeholder:
        "Once the oil gets hot, saute onion and garlic until onion softens.",
    },
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={headerHeight}
      enabled={true}
    >
      <ScrollView
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].screenBackground,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Pressable
          style={{
            height: 205,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            gap: 10,
          }}
          onPress={() => console.log("Pressed")}
        >
          <Ionicons name="ios-fast-food-sharp" size={30} />
          <Text style={{ fontSize: 20 }}>Pick image</Text>
        </Pressable>
        <View
          style={{
            paddingHorizontal: 15,
            paddingTop: 10,
            paddingBottom: 15,
            backgroundColor: "#FFFFFF",
            marginTop: 10,
          }}
        >
          <TextInput
            style={{
              backgroundColor: "#F0F2F5",
            }}
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

const styles = StyleSheet.create({
  createContent: {
    flex: 1,
  },
});
