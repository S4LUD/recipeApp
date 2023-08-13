module.exports = {
  expo: {
    name: "recipe",
    slug: "recipe",
    version: "1.7.2",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.miruza.recipe",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router"],
    experiments: {
      tsconfigPaths: true,
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      eas: {
        projectId: "b439ded0-78c6-4aaa-a052-2ce422558b13",
      },
    },
  },
};
