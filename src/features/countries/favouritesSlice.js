import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../auth/firebase";
// updateDoc - documents needs to exist already
// setDoc - will create if doesn't exist

/* const getFavourites = async () => {
  const docRef = doc(db, "favourites", userCredential.user.uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data().faves;
}; */
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

console.log("auth", auth);
let userId;
onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
    console.log("auth state changed, user:", user);
  } else {
    console.log("auth state changed, sign out");
  }
});

export const fetchFavourites = createAsyncThunk(
  "favourites/fetch",
  async () => {
    console.log("fetching faves, user cred:", userId);
    const docRef = doc(db, "favourites", userId);
    const docSnap = await getDoc(docRef);
    const faves = await docSnap.data().faves;
    return faves;
  }
);

export const setFavouritesAsync = createAsyncThunk(
  "favourites/set",
  async (data) => {
    const docRef = doc(db, "favourites", userId);
    await setDoc(docRef, {
      faves: data,
      uid: userId,
    });
    return data;
  }
);

const favouritesSlice = createSlice({
  name: "favourites",
  initialState: {
    favourites: [],
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        console.log("fetching faves, payload:", action.payload);
        state.favourites = action.payload;
      })
      .addCase(setFavouritesAsync.fulfilled, (state, action) => {
        console.log("setting faves, payload:", action.payload);
        state.favourites = action.payload;
      });
  },
});

export default favouritesSlice.reducer;
