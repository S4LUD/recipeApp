import Colors from "@/constants/Colors";
import React, { memo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Pressable,
  Image,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import * as ImagePicker from "expo-image-picker";
import mimeType from "react-native-mime-types";
import path from "path";

export interface ImageInterface {
  uri: string;
  type: string;
  name: string;
}

export interface MethodsInputValue {
  id: string;
  number: number;
  value: string;
  images?: ImageInterface;
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

  const handleInputChange = (text: string, index: number) => {
    const newInputValues = [...inputValues];
    newInputValues[index].value = text;
    setInputValues(newInputValues);
    onDataChanged(newInputValues);
  };

  const handleAddInput = () => {
    const nextMethodNumber = inputValues.length + 1;

    setInputValues([
      ...inputValues,
      {
        id: uuid.v4().toString(),
        number: nextMethodNumber,
        value: "",
      },
    ]);
  };

  const handleRemoveInput = (index: number) => {
    const newInputValues = inputValues.filter((_, i) => i !== index);

    // Update method numbers of the remaining methods
    const updatedInputValues = newInputValues.map((input, i) => ({
      ...input,
      number: i + 1,
    }));

    setInputValues(updatedInputValues);
    onDataChanged(updatedInputValues);
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  const pickImage = async (id: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newMethodImages = inputValues.map((input) => {
        if (input.id === id) {
          return {
            ...input,
            images: {
              uri: result.assets[0].uri,
              type: mimeType.lookup(result.assets[0].uri) || "",
              name: path.basename(result.assets[0].uri),
            },
          };
        }
        return input;
      });
      setInputValues(newMethodImages);
      onDataChanged(newMethodImages);
    }
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
              placeholder="Heat oil in a cooking pot."
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
              {input.images ? (
                <Pressable key={index} onPress={() => pickImage(input.id)}>
                  <Image
                    source={{ uri: input.images.uri }}
                    style={{ height: 85, width: 85, borderRadius: 5 }}
                  />
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => pickImage(input.id)}
                  style={{
                    padding: 25,
                    backgroundColor: "#F0F2F5",
                    borderRadius: 5,
                  }}
                >
                  <Ionicons name="images-outline" size={30} color="#D8D8D8" />
                </Pressable>
              )}
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

export default memo(DynamicMethodsInputs);
