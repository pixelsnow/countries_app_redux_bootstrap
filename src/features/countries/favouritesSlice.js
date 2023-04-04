import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { db, auth } from "../../auth/firebase";

// userId will hold uid
//const auth = getAuth();
let userId;
// Observer
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
    const docRef = doc(db, "favourites", userId);
    const docSnap = await getDoc(docRef);
    const faves = await docSnap.data().faves;
    return faves;
  }
);

export const setFavourites = createAsyncThunk(
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
        state.favourites = action.payload;
      })
      .addCase(setFavourites.fulfilled, (state, action) => {
        state.favourites = action.payload;
      });
  },
});

export default favouritesSlice.reducer;
