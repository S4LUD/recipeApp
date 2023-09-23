import {
  router,
  useSegments,
  useRootNavigation,
  usePathname,
} from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import path from "path";
import mimeType from "react-native-mime-types";
import {
  ImageInterface,
  MethodsInputValue,
} from "@/components/DynamicMethodsInputs";
import { IngredientsInputValue } from "@/components/DynamicIngredientsInputs";
import { Alert } from "react-native";
import Constants from "expo-constants";

const EXPO_PUBLIC_API_URL = Constants?.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

export interface User {
  _id: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  bio?: string | null;
  image?: string | null;
  image_public_id?: string | null;
  favorites_id?: any;
  recipe_id?: any;
}

interface createRecipe {
  _id: string;
  image?: ImageInterface;
  title?: string;
  info?: string;
  ingredients?: IngredientsInputValue[];
  methods?: MethodsInputValue[];
  categories?: string[]; // Add the categories property
}

interface triggerCreate {
  _id?: string;
  image?: string;
  title?: string;
  info?: string;
  ingredients?: IngredientsInputValue[];
  methods?: MethodsInputValue[];
  categories?: string[];
  userId?: string;
  author?: string;
}

export interface UpdatedUser {
  _id?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
}

interface SignUpResult {
  status: boolean;
  message: string;
}

interface AuthContextValue {
  signIn: (
    username: string | null,
    password: string | null
  ) => Promise<{ status: boolean; message: string } | null>;
  _useUpdate: (
    firstName?: string | null,
    lastName?: string | null,
    bio?: string | null
  ) => void;
  useUpdate: () => void;
  signUp: (
    username: string | null,
    password: string | null,
    firstName: string | null,
    lastName: string | null
  ) => Promise<{ status: boolean; message: string } | null>;
  signOut: () => void;
  authInitialized: boolean;
  createRecipeStatus: boolean;
  user: User | null;
  useUpdateProfile: (uri: string, type: string, name: string) => void;
  uploadProfileImageLoading: boolean;
  uploadProfileLoading: boolean;
  loginStatus: boolean;
  signUpStatus: boolean;
  triggerCreateRecipes: (
    _id: string,
    image: string,
    title: string,
    info: string,
    ingredients: any,
    categories: any,
    methods: any
  ) => void;
  triggerCreateRecipe: triggerCreate;
  SaveCreatedRecipe: () => void;
  triggerUpdateRecipeID: (_id: string) => void;
  GotoUpdateRecipeScreen: () => void;
  DeleteRecipe: () => void;
  fetchRecommendation: () => void;
  RecommendFood: any[];
  addToFavorites: (_id: string) => void;
  deleteToFavorites: (_id: string) => void;
  fetchTopRecipe: () => void;
  TopRecipe: any[];
  fetchRecentRecipe: () => void;
  RecentRecipe: any[];
  getAllRecipe: (text: string, categories: string[]) => void;
  AllRecipe: any[];
  MyRecipes: any[];
  MyFavorites: any[];
  GetMyRecipes: () => void;
  GetMyFavorites: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return authContext;
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  // This hook can be used to access the user info.
  const [user, setAuth] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  const [userUpdated, setUserUpdated] = useState<UpdatedUser | null>(null);
  const [uploadProfileImageLoading, setUploadProfileImageLoading] =
    useState<boolean>(false);
  const [uploadProfileLoading, setUploadProfileLoading] =
    useState<boolean>(false);
  const [loginStatus, setLoginStatus] = useState<boolean>(false);
  const [signUpStatus, setSignUpStatus] = useState<boolean>(false);
  const [createRecipeStatus, setCreateRecipeStatus] = useState<boolean>(false);
  const [triggerCreateRecipe, setTriggerCreateRecipe] = useState<triggerCreate>(
    {}
  );
  const [updateRecipe, setUpdateRecipe] = useState<string>("");
  const [RecommendFood, setRecommendFood] = useState<any[]>([]);
  const [TopRecipe, setTopRecipe] = useState<any[]>([]);
  const [RecentRecipe, setRecentRecipe] = useState<any[]>([]);
  const [AllRecipe, setAllRecipe] = useState<any[]>([]);
  const [MyRecipes, setMyRecipes] = useState<any[]>([]);
  const [MyFavorites, setMyFavorites] = useState<any[]>([]);
  const pathname = usePathname();

  async function GetMyRecipes() {
    const storedToken = await SecureStore.getItemAsync("token");
    if (storedToken) {
      await axios
        .request({
          method: "get",
          maxBodyLength: Infinity,
          url: `${EXPO_PUBLIC_API_URL}/api/user/get/all/my/recipe`,
          headers: {
            authorization_r: `Bearer ${storedToken}`,
          },
        })
        .then((response) => {
          if (response.data.status) {
            setMyRecipes(response.data.recipe_id);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async function GetMyFavorites() {
    const storedToken = await SecureStore.getItemAsync("token");
    if (storedToken) {
      await axios
        .request({
          method: "get",
          maxBodyLength: Infinity,
          url: `${EXPO_PUBLIC_API_URL}/api/user/get/all/my/favorites`,
          headers: {
            authorization_r: `Bearer ${storedToken}`,
          },
        })
        .then((response) => {
          if (response.data.status) {
            setMyFavorites(response.data.favorites_id);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async function getAllRecipe(searchText: string, categories: string[]) {
    const storedToken = await SecureStore.getItemAsync("token");
    if (storedToken) {
      await axios
        .request({
          method: "post",
          maxBodyLength: Infinity,
          url: `${EXPO_PUBLIC_API_URL}/api/user/search/recipes`,
          headers: {
            authorization_r: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            searchText: searchText,
            categories: categories,
          }),
        })
        .then((response) => {
          setAllRecipe(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async function fetchRecentRecipe() {
    const storedToken = await SecureStore.getItemAsync("token");

    if (storedToken) {
      await axios
        .request({
          method: "get",
          maxBodyLength: Infinity,
          url: `${EXPO_PUBLIC_API_URL}/api/user/get/all/recent/recipe`,
          headers: {
            authorization_r: `Bearer ${storedToken}`,
          },
        })
        .then((response) => {
          if (response.data.status) {
            setRecentRecipe(response.data.mostRecentRecipe);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async function fetchTopRecipe() {
    const storedToken = await SecureStore.getItemAsync("token");

    if (storedToken) {
      await axios
        .request({
          method: "get",
          maxBodyLength: Infinity,
          url: `${EXPO_PUBLIC_API_URL}/api/user/get/all/best/recipe`,
          headers: {
            authorization_r: `Bearer ${storedToken}`,
          },
        })
        .then((response) => {
          if (response.data.status) {
            setTopRecipe(response.data.topLikedRecipes);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async function fetchRecommendation() {
    try {
      const storedToken = await SecureStore.getItemAsync("token");

      if (storedToken) {
        const response = await axios.get(
          `${EXPO_PUBLIC_API_URL}/api/user/recipes/recommendations`,
          {
            headers: {
              authorization_r: `Bearer ${storedToken}`,
            },
          }
        );

        if (response.data) {
          setRecommendFood(response.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserProfile(token: string) {
    try {
      const profileResponse = await axios.request({
        method: "get",
        maxBodyLength: Infinity,
        url: `${EXPO_PUBLIC_API_URL}/api/user/profile`,
        headers: {
          authorization_r: `Bearer ${token}`,
        },
      });

      return profileResponse.data;
    } catch (error) {
      // Handle API error
      console.log("Error fetching user profile:", error);
      throw error;
    }
  }

  async function deleteToFavorites(_id: string) {
    const storedToken = await SecureStore.getItemAsync("token");
    if (storedToken) {
      try {
        await axios
          .request({
            method: "patch",
            maxBodyLength: Infinity,
            url: `${EXPO_PUBLIC_API_URL}/api/user/remove/favorites`,
            headers: {
              authorization_r: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              _id: _id,
            }),
          })
          .then(async (response) => {
            if (response.data.status) {
              if (pathname === "/view_favorite_recipe") {
                router.back();
              }

              // If verification succeeds, get the user profile
              const userProfile = await getUserProfile(storedToken);
              const {
                _id,
                username,
                firstName,
                lastName,
                bio,
                image,
                image_public_id,
                favorites_id,
                recipe_id,
              } = userProfile;

              // Set user data
              setAuth({
                _id,
                username,
                firstName,
                lastName,
                bio,
                image,
                image_public_id,
                favorites_id,
                recipe_id,
              });
              GetMyRecipes();
              GetMyFavorites();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        // Handle API error
        console.log("Error fetching user profile:", error);
        throw error;
      }
    }
  }

  async function addToFavorites(_id: string) {
    const storedToken = await SecureStore.getItemAsync("token");

    if (storedToken) {
      try {
        await axios
          .request({
            method: "patch",
            maxBodyLength: Infinity,
            url: `${EXPO_PUBLIC_API_URL}/api/user/add/favorites`,
            headers: {
              authorization_r: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              _id: _id,
            }),
          })
          .then(async (response) => {
            if (response.data.status) {
              // If verification succeeds, get the user profile
              const userProfile = await getUserProfile(storedToken);

              const {
                _id,
                username,
                firstName,
                lastName,
                bio,
                image,
                image_public_id,
                favorites_id,
                recipe_id,
              } = userProfile;

              // Set user data
              setAuth({
                _id,
                username,
                firstName,
                lastName,
                bio,
                image,
                image_public_id,
                favorites_id,
                recipe_id,
              });
              GetMyRecipes();
              GetMyFavorites();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        // Handle API error
        console.log("Error fetching user profile:", error);
        throw error;
      }
    }
  }

  useEffect(() => {
    (async () => {
      const storedToken = await SecureStore.getItemAsync("token");

      if (storedToken) {
        setLoginStatus(true);
        try {
          // First, verify the token
          await axios.request({
            method: "post",
            maxBodyLength: Infinity,
            url: `${EXPO_PUBLIC_API_URL}/api/user/verify`,
            headers: {
              authorization_r: `Bearer ${storedToken}`,
            },
          });

          // If verification succeeds, get the user profile
          const userProfile = await getUserProfile(storedToken);

          const {
            _id,
            username,
            firstName,
            lastName,
            bio,
            image,
            image_public_id,
            favorites_id,
            recipe_id,
          } = userProfile;

          // Set user data
          setAuth({
            _id,
            username,
            firstName,
            lastName,
            bio,
            image,
            image_public_id,
            favorites_id,
            recipe_id,
          });
          await GetMyRecipes();
          await GetMyFavorites();
          await getAllRecipe("", []);

          // Once everything is done, set auth initialized to true
          setLoginStatus(false);
          setAuthInitialized(true);
        } catch (error) {
          console.log("Error:", error);
          setAuthInitialized(true);
          setLoginStatus(false); // Set auth initialized even if there's an error
        }
      } else {
        setAuthInitialized(true);
        setLoginStatus(false); // No token, so auth is initialized
      }
    })();
  }, []);

  // This hook will protect the route access based on user authentication.
  async function useProtectedRoute(): Promise<void> {
    const segments = useSegments();
    const [isNavigationReady, setNavigationReady] = useState(false);
    const rooNavigation = useRootNavigation();

    useEffect(() => {
      const unsubscribe = rooNavigation?.addListener("state", () => {
        setNavigationReady(true);
      });
      return function cleanup() {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [rooNavigation]);

    useEffect(() => {
      if (!isNavigationReady) return;

      const inAuthGroup = segments[0] === "(auth)";

      if (!authInitialized) return;

      if (!user && !inAuthGroup) {
        router.replace("/sign-in");
      } else if (user && inAuthGroup) {
        router.replace("/(tabs)/dashboard");
      }
    }, [user, segments, authInitialized, isNavigationReady]);
  }

  async function triggerUpdateRecipeID(_id: string) {
    setUpdateRecipe(_id);
  }

  async function GotoUpdateRecipeScreen() {
    router.push({
      pathname: "/update_recipe",
      params: { _id: updateRecipe },
    });
  }

  async function save(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  }

  async function useSignIn(
    user: string | null,
    pass: string | null
  ): Promise<{ status: boolean; message: string } | null> {
    try {
      if (user === null || pass === null) {
        return { status: false, message: "Please don't leave the field empty" };
      }

      setLoginStatus(true);

      const response = await axios.post(
        `${EXPO_PUBLIC_API_URL}/api/user/login`,
        {
          username: user,
          password: pass,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // If verification succeeds, get the user profile
      if (response.data.status) {
        const userProfile = await getUserProfile(response.headers.token);

        const {
          _id,
          username,
          firstName,
          lastName,
          bio,
          image,
          image_public_id,
          favorites_id,
        } = userProfile;

        // Set user data
        setAuth({
          _id,
          username,
          firstName,
          lastName,
          bio,
          image,
          image_public_id,
          favorites_id,
        });

        await save("token", response.headers.token);
        setLoginStatus(false);
        return { status: true, message: "Sign-in successful" };
      } else {
        setLoginStatus(false);
        return { status: false, message: response.data.message };
      }
    } catch (error) {
      setLoginStatus(false);
      console.error("Error signing in:", error);

      const responseError = error as AxiosError;

      // Handle different error scenarios and return appropriate messages
      if (responseError.response && responseError.response.status === 401) {
        return { status: false, message: "Invalid username or password" };
      } else {
        return { status: false, message: "An error occurred while signing in" };
      }
    }
  }

  async function useSignOut() {
    try {
      setAuth(null);
      await SecureStore.deleteItemAsync("token");
    } catch (error) {
      console.log(error);
    }
  }

  async function signUp(
    username: string | null,
    password: string | null,
    firstName: string | null,
    lastName: string | null
  ): Promise<{ status: boolean; message: string } | null> {
    if (!username || !password || !firstName || !lastName)
      return { status: false, message: "Please don't leave the field empty" };

    try {
      setSignUpStatus(true);
      const result: { data: SignUpResult } = await axios.request({
        method: "post",
        maxBodyLength: Infinity,
        url: `${EXPO_PUBLIC_API_URL}/api/user/register`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          username: username,
          password: password,
        }),
      });

      const { status, message } = result.data;

      if (status === false) {
        return { status, message };
      }

      setSignUpStatus(false);
      if (result.data.status === true) router.replace("/sign-in");
      return null;
    } catch (error) {
      setSignUpStatus(false);
      console.error("Error signing up:", error);
      return { status: false, message: "An error occurred while signing up" };
    }
  }

  async function _useUpdate(
    firstName?: string | null,
    lastName?: string | null,
    bio?: string | null
  ) {
    setUserUpdated({
      _id: user?._id,
      firstName: firstName,
      lastName: lastName,
      bio: bio,
    });
  }

  async function useUpdate() {
    try {
      const storedToken = await SecureStore.getItemAsync("token");
      if (!storedToken) {
        return;
      }

      setUploadProfileLoading(true);

      const response = await axios.patch(
        `${EXPO_PUBLIC_API_URL}/api/user/update`,
        userUpdated,
        {
          headers: {
            authorization_r: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.status === true) {
        await updateUserProfile(storedToken);
        setUploadProfileLoading(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle API error, show error to the user, etc.
    }
  }

  async function updateUserProfile(token: string) {
    try {
      const userProfile = await getUserProfile(token);

      const {
        _id,
        username,
        firstName,
        lastName,
        bio,
        image,
        image_public_id,
        favorites_id,
      } = userProfile;

      // Set user data
      setAuth({
        _id,
        username,
        firstName,
        lastName,
        bio,
        image,
        image_public_id,
        favorites_id,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      // Handle API error, show error to the user, etc.
    }
  }

  async function useUpdateProfile(uri: string, type: string, name: string) {
    try {
      const storedToken = await SecureStore.getItemAsync("token");
      if (!storedToken) {
        return;
      }

      setUploadProfileImageLoading(true);

      if (user?.image_public_id) {
        await deleteProfileImage(user?.image_public_id, storedToken);
      }

      await uploadNewProfileImage(uri, type, name, storedToken);

      setUploadProfileImageLoading(false);
    } catch (error) {
      console.error("Error updating profile image:", error);
      setUploadProfileImageLoading(false);
      // Handle the error, show a message to the user, etc.
    }
  }

  async function deleteProfileImage(imagePublicId: string, token: string) {
    try {
      const result = await axios.delete(
        `${EXPO_PUBLIC_API_URL}/api/user/delete/profile/${imagePublicId}`,
        {
          headers: {
            authorization_r: `Bearer ${token}`,
          },
        }
      );

      if (result.data.result === "ok") {
        console.log("Profile image deleted successfully");
      } else if (result.data.result === "not found") {
        console.log("Profile image not found");
      }
    } catch (error) {
      console.error("Error deleting profile image:", error);
      // Handle the error, show a message to the user, etc.
    }
  }

  async function uploadNewProfileImage(
    uri: string,
    type: string,
    name: string,
    token: string
  ) {
    try {
      const formData = new FormData();
      formData.append("image", {
        uri,
        type,
        name,
      } as any);

      const upload = await axios.post(
        `${EXPO_PUBLIC_API_URL}/api/user/upload/profile`,
        formData,
        {
          headers: {
            authorization_r: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (upload.data?.status === true) {
        updateUserProfile(token);
        console.log("Profile image uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading new profile image:", error);
      // Handle the error, show a message to the user, etc.
    }
  }

  const triggerCreateRecipes = async (
    _id: string,
    image: string,
    title: string,
    info: string,
    ingredients: IngredientsInputValue[],
    categories: any,
    methods: MethodsInputValue[]
  ) => {
    setTriggerCreateRecipe({
      _id,
      image,
      title,
      info,
      ingredients,
      categories,
      methods,
    });
  };

  const SaveCreatedRecipe = async () => {
    const { _id, image, title, info, ingredients, categories, methods } =
      triggerCreateRecipe;

    if (!image) {
      return Alert.alert("Message", "Please select cover image");
    }

    if (!title) {
      // Title is empty
      return Alert.alert("Message", "Please provide a title for the recipe.");
    }

    if (!ingredients || ingredients.length < 2) {
      // Not enough ingredients
      return Alert.alert("Message", "Please provide at least 2 ingredients.");
    }

    if (!categories || categories.length === 0) {
      // No categories selected
      return Alert.alert("Message", "Please select at least one category.");
    }

    setCreateRecipeStatus(true);
    await createRecipes(
      _id || "",
      image,
      title,
      info || "",
      ingredients,
      categories,
      methods || []
    );
    await fetchRecentRecipe();
  };

  const createRecipes = async (
    _id: string,
    image: string,
    title: string,
    info: string,
    ingredients: IngredientsInputValue[],
    categories: any,
    methods: MethodsInputValue[]
  ) => {
    const result = await uploadMethods(methods);
    if (result) {
      const CreateRecipe = {
        _id: _id,
        title: title || "Untitled",
        info: info || "No information available",
        ingredients: ingredients,
        categories: categories,
        methods: result,
      };
      UploadRecipe(image, CreateRecipe);
    }
  };

  const UploadRecipe = async (image: string, createRecipe: createRecipe) => {
    const storedToken = await SecureStore.getItemAsync("token");
    await axios
      .request({
        method: "post",
        maxBodyLength: Infinity,
        url: `${EXPO_PUBLIC_API_URL}/api/create/recipe`,
        headers: {
          "Content-Type": "application/json",
          authorization_r: `Bearer ${storedToken}`,
        },
        data: JSON.stringify(createRecipe),
      })
      .then((response) => {
        const { recipe_id } = response.data;
        const imageUri = image || "";
        const mimeTypeValue = image ? mimeType.lookup(imageUri) || "" : "";
        useUpdateRecipeImage(
          recipe_id,
          imageUri,
          mimeTypeValue,
          path.basename(imageUri)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const uploadMethods = async (methods: MethodsInputValue[]) => {
    const storedToken = await SecureStore.getItemAsync("token");
    const newMethodsData: any[] = []; // Create an array to hold uploaded data

    const uploadPromises = methods.map(async (item) => {
      try {
        if (item.images?.uri) {
          const formData = new FormData();
          formData.append("image", {
            uri: item.images.uri,
            type: item.images.type,
            name: item.images.name,
          } as any);

          if (storedToken) {
            const result = await axios.request({
              method: "post",
              maxBodyLength: Infinity,
              url: `${EXPO_PUBLIC_API_URL}/api/upload/recipe/methods/image`,
              headers: {
                authorization_r: `Bearer ${storedToken}`,
                "Content-Type": "multipart/form-data",
              },
              data: formData,
            });

            newMethodsData.push({
              value: item.value,
              number: item.number,
              ...result.data,
            });
          }
        } else {
          newMethodsData.push({
            value: item.value,
            number: item.number,
          });
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
      return newMethodsData;
    } catch (error) {
      setCreateRecipeStatus(false);
      console.error("Error uploading images:", error);
    }
  };

  async function useUpdateRecipeImage(
    recipe_id: string,
    uri: string,
    type: string,
    name: string
  ) {
    const storedToken = await SecureStore.getItemAsync("token");
    const formData = new FormData();
    formData.append("image", {
      uri: uri,
      type: type,
      name: name,
    } as any);

    if (storedToken) {
      const result = await axios.request({
        method: "post",
        maxBodyLength: Infinity,
        url: `${EXPO_PUBLIC_API_URL}/api/upload/recipe/image/${recipe_id}`,
        headers: {
          authorization_r: `Bearer ${storedToken}`,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });

      if (result.data.status) {
        const userProfile = await getUserProfile(storedToken);

        const {
          _id,
          username,
          firstName,
          lastName,
          bio,
          image,
          image_public_id,
          favorites_id,
          recipe_id,
        } = userProfile;

        // Set user data
        setAuth({
          _id,
          username,
          firstName,
          lastName,
          bio,
          image,
          image_public_id,
          favorites_id,
          recipe_id,
        });
        GetMyRecipes();
        GetMyFavorites();

        setCreateRecipeStatus(false);
        router.back();
      }
    }
    setCreateRecipeStatus(false);
  }

  const DeleteRecipe = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync("token");

      if (storedToken) {
        Alert.alert(
          "Confirm Delete",
          "Are you sure you want to delete this recipe?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
              onPress: async () => {
                await axios
                  .request({
                    method: "delete",
                    maxBodyLength: Infinity,
                    url: `${EXPO_PUBLIC_API_URL}/api/user/delete/recipe`,
                    headers: {
                      authorization_r: `Bearer ${storedToken}`,
                      "Content-Type": "application/json",
                    },
                    data: JSON.stringify({
                      _id: updateRecipe,
                    }),
                  })
                  .then(async (response) => {
                    if (response.data) {
                      const userProfile = await getUserProfile(storedToken);

                      const {
                        _id,
                        username,
                        firstName,
                        lastName,
                        bio,
                        image,
                        image_public_id,
                        favorites_id,
                        recipe_id,
                      } = userProfile;

                      // Set user data
                      setAuth({
                        _id,
                        username,
                        firstName,
                        lastName,
                        bio,
                        image,
                        image_public_id,
                        favorites_id,
                        recipe_id,
                      });

                      GetMyRecipes();
                      GetMyFavorites();

                      router.back();
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              },
              style: "destructive",
            },
          ],
          { cancelable: true }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useProtectedRoute();

  return (
    <AuthContext.Provider
      value={{
        signIn: (username, password) => useSignIn(username, password),
        signUp: async (username, password, firstName, lastName) =>
          signUp(username, password, firstName, lastName),
        signOut: () => useSignOut(),
        authInitialized,
        user,
        _useUpdate: (firstName, lastName, bio) =>
          _useUpdate(firstName, lastName, bio),
        useUpdate: () => useUpdate(),
        useUpdateProfile: (uri, type, name) =>
          useUpdateProfile(uri, type, name),
        uploadProfileImageLoading,
        uploadProfileLoading,
        loginStatus,
        signUpStatus,
        triggerCreateRecipes,
        SaveCreatedRecipe,
        triggerCreateRecipe,
        createRecipeStatus,
        triggerUpdateRecipeID: (_id: string) => triggerUpdateRecipeID(_id),
        GotoUpdateRecipeScreen,
        DeleteRecipe,
        fetchRecommendation,
        RecommendFood,
        addToFavorites,
        deleteToFavorites,
        fetchTopRecipe,
        TopRecipe,
        fetchRecentRecipe,
        RecentRecipe,
        getAllRecipe,
        AllRecipe,
        MyRecipes,
        MyFavorites,
        GetMyRecipes,
        GetMyFavorites,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
