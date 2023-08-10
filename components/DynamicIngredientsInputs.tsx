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

export interface IngredientsInputValue {
  value: string;
  isSection?: boolean;
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
        value: "",
      },
    ]);
  };

  const handleAddSection = () => {
    setInputValues([
      ...inputValues,
      {
        value: "",
        isSection: true,
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
        <View key={index} style={styles.inputContainer}>
          <View style={{ paddingTop: 20 }}>
            <Ionicons
              color="#D8D8D8"
              name={input.isSection ? "chevron-forward-outline" : "menu-sharp"}
              size={20}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={{
                backgroundColor: "#F0F2F5",
              }}
              value={input.value}
              onChangeText={(text) => handleInputChange(text, index)}
              placeholder={
                input.isSection ? "Section title" : "Paprika - 1 tsp (5g)"
              }
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            style={{
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleAddSection}
          >
            <Ionicons name="add-outline" size={24} />
            <Text style={{ fontSize: 16 }}>Section</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1 }}>
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
