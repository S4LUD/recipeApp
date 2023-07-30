import React, { memo } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import LetterProfile from "@/components/LetterProfile";
import ShowMoreText from "@/components/ShowMoreText";

type SearchParams = {
  id: string;
  title: string;
  category: string;
  author: string;
  img: string;
};

const Viewer = () => {
  const params = useLocalSearchParams();
  const { id, title, category, author, img } = params as SearchParams;

  const desc =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores iusto beatae alias error, aut magnam nesciunt perferendis tenetur reprehenderit ut nulla suscipit atque praesentium accusantium, vitae voluptatum quas consequuntur sint.";

  const ing = [
    "Ingredients 1",
    "Ingredients 2",
    "Ingredients 3",
    "Ingredients 4",
    "Ingredients 5",
    "Ingredients 6",
    "Ingredients 7",
  ];

  const met = [
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores iusto beatae alias error, aut magnam nesciunt perferendis tenetur reprehenderit ut nulla suscipit atque praesentium accusantium, vitae voluptatum quas consequuntur sint.",
    "Method 2",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores iusto beatae alias error, aut magnam nesciunt perferendis tenetur reprehenderit ut nulla suscipit atque praesentium accusantium, vitae voluptatum quas consequuntur sint.",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores iusto beatae alias error, aut magnam nesciunt perferendis tenetur reprehenderit ut nulla suscipit atque praesentium accusantium, vitae voluptatum quas consequuntur sint.",
    "Method 5",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores iusto beatae alias error, aut magnam nesciunt perferendis tenetur reprehenderit ut nulla suscipit atque praesentium accusantium, vitae voluptatum quas consequuntur sint.",
  ];

  return (
    <ScrollView
      key={id}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <Image style={styles.foodImage} source={{ uri: "https://" + img }} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.userContent}>
          <LetterProfile
            name={author}
            size={50}
            fontSize={16}
            backgroundColor="#D4E2D4"
            textColor="#000000"
          />
          <View style={styles.userInfo}>
            <Text>{author}</Text>
            <Text>@{category}</Text>
          </View>
        </View>
        <View style={styles.detailsContent}>
          <ShowMoreText fontSize={16} text={desc} maxLength={100} />
        </View>
        <View>
          <Text style={{ fontSize: 22, fontWeight: "500", paddingBottom: 20 }}>
            Ingredients
          </Text>
          {ing.map((ingredient, index) => (
            <View key={index}>
              <Text style={styles.ingredientText}>{ingredient}</Text>
              {index !== ing.length - 1 && (
                <View
                  style={[
                    styles.separator,
                    {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderStyle: Platform.OS !== "ios" ? "dashed" : undefined,
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </View>
        <Animated.View
          style={{
            borderBottomColor: "gray",
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderStyle: "solid",
            marginVertical: 30,
          }}
        />
        <View>
          <Text style={{ fontSize: 22, fontWeight: "500", paddingBottom: 20 }}>
            Methods
          </Text>
          {met.map((method, index) => (
            <View style={styles.methodContainer} key={index}>
              <View style={styles.circle}>
                <Text style={styles.number}>{index + 1}</Text>
              </View>
              <View style={styles.methodTextContainer}>
                <Text style={styles.methodText}>{method}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default memo(Viewer);

const styles = StyleSheet.create({
  foodImage: {
    // width: 150,
    height: 300,
    resizeMode: "cover",
  },
  content: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  title: { fontSize: 24, fontWeight: "500" },
  userContent: {
    marginTop: 15,
    flexDirection: "row",
    gap: 10,
  },
  userInfo: {
    gap: 3,
  },
  detailsContent: {
    marginTop: 15,
  },
  ingredientText: {
    fontSize: 16,
    paddingVertical: 5,
  },
  separator: {
    borderBottomColor: "gray",
    marginVertical: 5,
  },
  methodContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#454545",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  number: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  methodTextContainer: {
    flex: 1,
  },
  methodText: {
    fontSize: 16,
  },
});
