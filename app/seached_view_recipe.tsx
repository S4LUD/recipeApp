import React, { memo } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import LetterProfile from "@/components/LetterProfile";
import ShowMoreText from "@/components/ShowMoreText";
import { useAuth } from "@/context/auth";

const Viewer = () => {
  const params = useLocalSearchParams();
  const { user, AllRecipe, addToFavorites, deleteToFavorites } = useAuth();
  const { _id } = params as any;

  const recipe = AllRecipe.filter((item: any) => {
    return item._id === _id;
  });

  const sortedMethods = recipe[0].methods
    .slice()
    .sort(
      (a: { number: number }, b: { number: number }) => a.number - b.number
    );

  const ToFavotites = () => {
    addToFavorites(_id);
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <Image style={styles.foodImage} source={{ uri: recipe[0]?.image }} />
      <View style={styles.content}>
        <Text style={styles.title}>{recipe[0]?.title}</Text>
        {user?._id === recipe[0].userId ? undefined : user?.favorites_id[0]
            ?._id === recipe[0]._id ? (
          <Pressable
            onPressIn={() => deleteToFavorites(recipe[0]._id)}
            style={{
              marginVertical: 15,
              backgroundColor: "#C70039",
              paddingVertical: 5,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>
              Remove to your favorites
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPressIn={() => ToFavotites()}
            style={{
              marginVertical: 15,
              backgroundColor: "#FFB07F",
              paddingVertical: 5,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>
              Add to favorites
            </Text>
          </Pressable>
        )}
        <View style={styles.userContent}>
          {recipe[0].author.image ? (
            <Image
              source={{ uri: recipe[0].author.image }}
              style={{ height: 50, width: 50, borderRadius: 50 }}
            />
          ) : (
            <LetterProfile
              name={recipe[0].author.name}
              size={50}
              fontSize={16}
              backgroundColor="#D4E2D4"
              textColor="#000000"
            />
          )}
          <View style={styles.userInfo}>
            <Text>{recipe[0]?.author.name}</Text>
            <Text>@{recipe[0]?.author.username}</Text>
          </View>
        </View>
        <View style={styles.detailsContent}>
          <ShowMoreText fontSize={16} text={recipe[0]?.info} maxLength={100} />
        </View>
        <View>
          <Text style={{ fontSize: 22, fontWeight: "500", paddingBottom: 20 }}>
            Ingredients
          </Text>
          {recipe[0].ingredients.map((ingredient: any, index: number) => {
            const isSection = ingredient.isSection;
            const showMargin = index > 0 && isSection; // Determine whether to show margin
            return (
              <View key={index} style={{ marginTop: showMargin ? 10 : 0 }}>
                <Text
                  style={[
                    styles.ingredientText,
                    {
                      fontSize: isSection ? 18 : 16,
                      fontWeight: isSection ? "600" : "400",
                    },
                  ]}
                >
                  {ingredient.value}
                </Text>
                {index !== recipe[0].ingredients.length - 1 && !isSection && (
                  <View
                    style={[
                      styles.separator,
                      {
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderStyle:
                          Platform.OS !== "ios" ? "dashed" : undefined,
                      },
                    ]}
                  />
                )}
              </View>
            );
          })}
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
          {sortedMethods.map((method: any, index: number) => {
            return (
              <View style={styles.methodContainer} key={index}>
                <View style={styles.circle}>
                  <Text style={styles.number}>{method.number}</Text>
                </View>
                <View style={styles.methodTextContainer}>
                  <Text style={styles.methodText}>{method.value}</Text>
                  {method.secure_url && (
                    <Image
                      source={{ uri: method.secure_url }}
                      style={{
                        height: 200,
                        borderRadius: 5,
                        marginTop: 10,
                      }}
                    />
                  )}
                </View>
              </View>
            );
          })}
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
