import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  StatusBar,
  Pressable,
  Animated,
  RefreshControl,
} from "react-native";
import { useColorScheme } from "react-native";
import { memo } from "react";
import TrendView from "@/components/TrendView";
import RecommendView from "@/components/RecommendView";
import RecentRecipe from "@/components/RecentRecipe";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth";
import { useState, useCallback } from "react";

const Index = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { user, fetchRecentRecipe, fetchTopRecipe, fetchRecommendation } =
    useAuth();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fullName: string = `${user?.firstName} ${user?.lastName}`;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRecentRecipe();
    fetchTopRecipe();
    fetchRecommendation();
    setRefreshing(false);
  }, [fetchRecentRecipe, fetchTopRecipe, fetchRecommendation]);

  return (
    <View>
      <StatusBar backgroundColor={Colors[colorScheme ?? "light"].primary} />
      <ScrollView
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].screenBackground,
          paddingTop: StatusBar.currentHeight, // Add paddingTop to push content below the status bar
        }}
        showsVerticalScrollIndicator={false}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        stickyHeaderIndices={[1]}
        stickyHeaderHiddenOnScroll={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
          }}
        >
          <View style={styles.titleContainer}>
            <View style={styles.titleWrapper}>
              <Text
                style={[
                  styles.welcomeUser,
                  {
                    color: Colors[colorScheme ?? "light"].text,
                  },
                ]}
              >
                Hello, {fullName}
              </Text>
              <Text
                style={[
                  styles.title,
                  {
                    color: Colors[colorScheme ?? "light"].text,
                  },
                ]}
              >
                What would you like to cook today?
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/search_filter_categories",
                params: {},
              })
            }
            style={[
              styles.leftContent,
              {
                backgroundColor:
                  Colors[colorScheme ?? "light"].screenBackground,
              },
            ]}
          >
            <Ionicons
              name="ios-search-sharp"
              size={24}
              color={Colors[colorScheme ?? "light"].placeholder}
            />
            <Text style={{ color: Colors[colorScheme ?? "light"].placeholder }}>
              Type Ingredients
            </Text>
          </Pressable>
        </View>
        <RecommendView />
        <TrendView />
        <RecentRecipe />
        <Animated.View style={{ paddingBottom: StatusBar.currentHeight }} />
      </ScrollView>
    </View>
  );
};

export default memo(Index);

const styles = StyleSheet.create({
  fabStyle: {
    bottom: 16,
    right: 16,
    position: "absolute",
    backgroundColor: "#FFFFFF",
  },
  titleContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  titleWrapper: {
    width: 280,
  },
  welcomeUser: {
    fontSize: 16,
    fontWeight: "300",
  },
  title: {
    fontSize: 28,
    fontWeight: "500",
  },
  searchContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  leftContent: {
    height: 40,
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});
