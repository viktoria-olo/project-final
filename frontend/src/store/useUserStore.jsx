import { create } from "zustand";

const backend_url = import.meta.env.BACKEND_URL || "http://localhost:8080";

export const useUserStore = create((set, get) => ({
  // TODO Breakout this to a useEffect in the sign-up component, this is so that we dont accidentally expose the username/password from any other page/component in the frontend
  signUpData: {
    name: "",
    email: "",
    street: "",
    postCode: "",
    city: "",
    username: "",
    password: "",
    verifyingPassword: "",
  },

  // TODO Breakout this to a useEffect in the sign-in component, this is so that we dont accidentally expose the username/password from any other page/component in the frontend
  loginData: {
    username: "",
    password: "",
  },

  accessToken: "",
  username: "",
  isLoggedIn: false,
  backendError: false,
  errorMessage: "",

  // TODO create function that takes key and value as input and updates keys here in zustand.
  setData: (key, value) => {
    set({ [key]: value });
  },

  resetSignUpData: () =>
    set({
      signUpData: {
        name: "",
        email: "",
        street: "",
        postCode: "",
        city: "",
        username: "",
        password: "",
        verifyingPassword: "",
      },
    }),

  resetLoginData: () => {
    set({
      loginData: {
        username: "",
        password: "",
      },
    });
  },

  // removes accesstoken and username from localstorage and resets/empties the data in zustand when the user sign out.
  signOut: () => {
    console.log("Signing out...");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    set({
      accessToken: "",
      username: "",
      isLoggedIn: false,
    });
  },

  handleSubmitForm: async (event) => {
    event.preventDefault();

    const { signUpData } = get();
    const constructedAddress = `${signUpData.street} ${signUpData.postCode} ${signUpData.city}`;

    if (signUpData.password !== signUpData.verifyingPassword) {
      console.error("Passwords do not match");
      return false;
    }
    try {
      const response = await fetch(`${backend_url}/users`, {
        method: "POST",
        body: JSON.stringify({
          name: signUpData.name,
          username: signUpData.username,
          email: signUpData.email,
          password: signUpData.password,
          address: constructedAddress,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        if (errorResponse.errorType === "password") {
          set((state) => ({
            ...state,
            backendError: true,
            errorMessage: "Password must be at least 8 characters long",
          }));
        }
        if (errorResponse.errorType === "duplication") {
          if (errorResponse.message === "username") {
            set((state) => ({
              ...state,
              backendError: true,
              errorMessage: "An account with that username already exists",
            }));
          }
          if (errorResponse.message === "email") {
            set((state) => ({
              ...state,
              backendError: true,
              errorMessage: "An account with that email already exists",
            }));
          }
        }
        return false;
      } else {
        const result = await response.json();
        set((state) => ({
          ...state,
          accessToken: result.accessToken,
          username: signUpData.username,
        }));
        const updatedAccessToken = get().accessToken;
        const updatedUsername = get().signUpData.username;

        localStorage.setItem("token", updatedAccessToken);
        localStorage.setItem("username", updatedUsername);
        console.log(result.message);

        return true;
      }
    } catch (error) {
      set((state) => ({
        ...state,
        backendError: true,
        errorMessage: "Unable to sign up, try again or contact us by email if this issue persists.",
      }));
      return false;
    }
  },

  handleSignUpChange: (fieldName, value) => {
    set((state) => ({
      signUpData: {
        ...state.signUpData,
        [fieldName]: value,
      },
    }));
  },

  handleLoginChange: (fieldName, value) => {
    set((state) => ({
      loginData: {
        ...state.loginData,
        [fieldName]: value,
      },
    }));
  },

  handleSubmitLogin: async (event) => {
    event.preventDefault();
    const { loginData } = get();
    try {
      const response = await fetch(`${backend_url}/users/sessions`, {
        method: "POST",
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        set((state) => ({
          ...state,
          backendError: true,
          errorMessage: "Incorrect username or password",
        }));
        return false;
      } else {
        const result = await response.json();
        set((state) => ({
          ...state,
          accessToken: result.accessToken,
          username: loginData.username,
        }));
        const updatedAccessToken = get().accessToken;
        const updatedUsername = get().loginData.username;

        localStorage.setItem("token", updatedAccessToken);
        localStorage.setItem("username", updatedUsername);
        set({
          loginData: {
            username: "",
            password: "",
          },
        });
        return true;
      }
    } catch (error) {
      set((state) => ({
        ...state,
        backendError: true,
        errorMessage: "Unable to sign up, try again or contact us by email if this issue persists.",
      }));
      return false;
    }
  },

  validateLoggedInData: async (accessToken) => {
    try {
      const response = await fetch(`${backend_url}/users/membership`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
      });
      if (!response.ok) {
        const result = await response.json();
      }
      const result = await response.json();
      localStorage.setItem("isLoggedIn", result.isLoggedIn);
      set((state) => ({ ...state, isLoggedIn: result.isLoggedIn }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
}));
