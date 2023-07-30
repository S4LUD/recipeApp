import React, { memo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ShowMoreText = ({
  text,
  maxLength,
  fontSize,
}: {
  text: string;
  maxLength: number;
  fontSize: number;
}) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  const displayText =
    text.length > maxLength && !showFullText
      ? text.slice(0, maxLength) + "..."
      : text;

  return (
    <>
      <Text style={{ fontSize }}>{displayText}</Text>
      {text.length > maxLength && (
        <View style={{ alignItems: "flex-end" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#E4E6EB",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 7,
            }}
            onPress={toggleShowFullText}
          >
            <Text>{showFullText ? "Show less" : "Show more"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default memo(ShowMoreText);
