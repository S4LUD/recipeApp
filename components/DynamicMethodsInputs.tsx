import Colors from "@/constants/Colors";
import React, { useEffect, useState } from "react";
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

export interface MethodsInputValue {
  id: string;
  value: string;
  placeholder: string;
}

interface DynamicInputsProps {
  initialValues?: MethodsInputValue[];
  onDataChanged: (data: MethodsInputValue[]) => void;
}

const DynamicMethodsInputs: React.FC<DynamicInputsProps> = ({
  initialValues = [],
  onDataChanged,
}) => {
  const [inputValues, setInputValues] =
    useState<MethodsInputValue[]>(initialValues);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const colorScheme = useColorScheme();
  const ingredientsList = [
    "Heat oil in a cooking pot.",
    "Once the oil gets hot, saute onion and garlic until onion softens.",
    "Add pork Saute until brown.",
    "Pour tomato sauce and water. Stir and let boil.",
    "Add Knorr Pork Cube. Stir. Add dried bay leaves. Cover and cook in medium heat for 30 minutes. Note: Add more water if needed.",
    "Add hotdogs. Cook for 10 minutes.",
    "Add carrot and potato. Cover and cook for 8 minutes.",
    "Add green peas. Cook for 3 to 5 minutes.",
    "Season with salt and ground black pepper.",
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
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Methods</Text>
      </View>
      {inputValues.map((input, index) => (
        <View key={input.id} style={styles.inputContainer}>
          <View style={{ paddingTop: 15 }}>
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
            <View
              style={{
                alignItems: "flex-start",
                marginTop: 6,
                flexDirection: "row",
                gap: 6,
              }}
            >
              <Pressable
                style={{
                  padding: 25,
                  backgroundColor: "#F0F2F5",
                  borderRadius: 5,
                }}
              >
                <Ionicons name="images-outline" size={30} color="#D8D8D8" />
              </Pressable>
              <Pressable
                style={{
                  padding: 25,
                  backgroundColor: "#F0F2F5",
                  borderRadius: 5,
                }}
              >
                <Ionicons name="images-outline" size={30} color="#D8D8D8" />
              </Pressable>
              <Pressable
                style={{
                  padding: 25,
                  backgroundColor: "#F0F2F5",
                  borderRadius: 5,
                }}
              >
                <Ionicons name="images-outline" size={30} color="#D8D8D8" />
              </Pressable>
            </View>
          </View>
          <View style={{ paddingTop: 15 }}>
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
          <Text style={{ fontSize: 16 }}>Steps</Text>
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

export default DynamicMethodsInputs;
