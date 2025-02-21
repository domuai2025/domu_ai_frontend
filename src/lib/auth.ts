import supabase from "./supabaseClient";

// ✅ Sign up a new user with email, password, and name
export const signUp = async (email: string, password: string, name: string) => {
  // Validate input
  if (!email || !password || !name) {
    throw new Error("Name, email, and password are required.");
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }, // Store name in user metadata
      },
    });

    if (error) {
      console.error("SignUp Error:", error.message);
      throw new Error(error.message);
    }

    return data.user;
  } catch (error) {
    console.error("Unexpected SignUp Error:", error);
    throw error; // Re-throw error for the caller to handle
  }
};

// ✅ Sign in a user with email and password
export const signIn = async (email: string, password: string) => {
  // Validate input
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("SignIn Error:", error.message);
      throw new Error(error.message);
    }

    return data.user;
  } catch (error) {
    console.error("Unexpected SignIn Error:", error);
    throw error;
  }
};

// ✅ Sign in or sign up with Google/GitHub (OAuth)
export const signInWithProvider = async (provider: "google" | "github") => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({ provider });

    if (error) {
      console.error(`OAuth SignIn Error with ${provider}:`, error.message);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Unexpected OAuth SignIn Error:", error);
    throw error;
  }
};

// ✅ Sign out user
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("SignOut Error:", error.message);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Unexpected SignOut Error:", error);
    throw error;
  }
};
