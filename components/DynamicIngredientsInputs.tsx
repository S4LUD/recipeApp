import Colors from "@/constants/Colors";
import React, { memo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Pressable,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import uuid from "react-native-uuid";

export interface IngredientsInputValue {
  id: string;
  value: string;
  placeholder: string;
}

interface DynamicInputsProps {
  initialValues?: IngredientsInputValue[];
  onDataChanged: (data: IngredientsInputValue[]) => void;
}

const DynamicIngredientsInputs: React.FC<DynamicInputsProps> = ({
  initialValues = [],
  onDataChanged,
}) => {
  const [inputValues, setInputValues] =
    useState<IngredientsInputValue[]>(initialValues);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const colorScheme = useColorScheme();
  const ingredientsList = [
    "Avocado - 1 medium avocado",
    "Cilantro - A handful",
    "Chicken breast - 2 boneless, skinless breasts (350g)",
    "Garlic - 3 to 4 cloves (1 tsp minced)",
    "Tomato - 1 medium-sized (150g)",
    "Onion - 1 medium-sized (150g)",
    "Lemon - 1 medium-sized (2-3 tbsp juice)",
    "Basil - A handful",
    "Shrimp - 1 pound (450g, approx. 20-25 large shrimp)",
    "Cheddar cheese - 1 cup shredded (120g)",
    "Eggs - 4 large (200g)",
    "Olive oil - 1 tbsp (15ml)",
    "Spinach - A handful (30g)",
    "Paprika - 1 tsp (5g)",
    "Cumin - 1 tsp (5g)",
    "Salmon - 1 fillet (150g)",
    "Cauliflower - 1 medium-sized head (500g)",
    "Rice - 1 cup uncooked (200g)",
    "Coconut milk - 1 cup (240ml)",
    "Quinoa - 1 cup uncooked (170g)",
    "Bell pepper - 1 medium-sized (150g)",
    "Black beans - 1 can (400g)",
    "Zucchini - 2 medium-sized (300g)",
    "Almonds - A handful (30g)",
    "Yogurt - 1 cup (240ml)",
  ];

  const getRandomIngredient = () => {
    const randomIndex = Math.floor(Math.random() * ingredientsList.length);
    return ingredientsList[randomIndex];
  };

  const handleInputChange = (text: string, index: number) => {
    const newInputValues = [...inputValues];
    newInputValues[index].value = text;
    setInputValues(newInputValues);
    onDataChanged(newInputValues);
  };

  const handleAddInput = () => {
    setInputValues([
      ...inputValues,
      {
        id: uuid.v4().toString(),
        value: "",
        placeholder: getRandomIngredient(),
      },
    ]);
  };

  const handleRemoveInput = (index: number) => {
    const newInputValues = inputValues.filter((_, i) => i !== index);
    setInputValues(newInputValues);
    onDataChanged(newInputValues);
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  return (
    <View style={{ gap: 15, paddingVertical: 15 }}>
      <View>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Ingredients</Text>
      </View>
      {inputValues.map((input, index) => (
        <View key={input.id} style={styles.inputContainer}>
          <View style={{ paddingTop: 20 }}>
            <Ionicons color="#D8D8D8" name="menu-sharp" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={{
                backgroundColor: "#F0F2F5",
              }}
              value={input.value}
              onChangeText={(text) => handleInputChange(text, index)}
              placeholder={input.placeholder}
              placeholderTextColor="#D8D8D8"
              textColor="black"
              mode="outlined"
              outlineColor="transparent"
              activeOutlineColor={Colors[colorScheme ?? "light"].tint}
              multiline={true}
              maxLength={200}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              keyboardAppearance="light"
              blurOnSubmit={true}
            />
            <Text style={{ color: "gray", fontSize: 12 }}>
              {focusedIndex === index && `${input.value.length} / 200`}
            </Text>
          </View>
          <View style={{ paddingTop: 20 }}>
            <Pressable onPress={() => handleRemoveInput(index)}>
              <Ionicons color="#D8D8D8" name="trash-outline" size={20} />
            </Pressable>
          </View>
        </View>
      ))}
      <View style={{ alignItems: "center" }}>
        <Pressable
          style={{
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handleAddInput}
        >
          <Ionicons name="add-outline" size={24} />
          <Text style={{ fontSize: 16 }}>Ingredient</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 10,
  },
});

export default memo(DynamicIngredientsInputs);
