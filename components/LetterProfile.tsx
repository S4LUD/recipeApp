import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

const LetterProfile = ({
  name,
  size,
  fontSize,
  backgroundColor,
  textColor,
}: {
  name: string;
  size: number;
  fontSize: number;
  backgroundColor: string;
  textColor: string;
}) => {
  const getInitials = (name: string) => {
    const names = name.split(" ");
    const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");
    return initials;
  };

  return (
    <View
      style={[styles.container, { width: size, height: size, backgroundColor }]}
    >
      <Text style={[styles.text, { color: textColor, fontSize }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

export default memo(LetterProfile);

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
  },
});
