import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { db } from "../../auth/firebase";

//
const auth = getAuth();
let userId;

onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
    console.log("SLICE auth state changed, user:", user);
  } else {
    console.log("SLICE auth state changed, sign out");
  }
});

export const fetchFavourites = createAsyncThunk(
  "favourites/fetch",
  async () => {
    console.log("SLICE fetching faves, user cred:", userId);
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
