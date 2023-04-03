import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../auth/firebase";
// updateDoc - documents needs to exist already
// setDoc - will create if doesn't exist

import { userCredential } from "../../auth/firebase";

/* const getFavourites = async () => {
  const docRef = doc(db, "favourites", userCredential.user.uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data().faves;
}; */

export const fetchFavourites = createAsyncThunk(
  "favourites/fetch",
  async () => {
    const docRef = doc(db, "favourites", userCredential.user.uid);
    const docSnap = await getDoc(docRef);
    const faves = await docSnap.data().faves;
    return faves;
  }
);

export const setFavouritesAsync = createAsyncThunk(
  "favourites/set",
  async (data) => {
    console.log("setting faves");
    const docRef = doc(db, "favourites", userCredential.user.uid);
    await setDoc(docRef, {
      faves: data,
      uid: userCredential.user.uid,
    });
  }
);

const favouritesSlice = createSlice({
  name: "favourites",
  initialState: {
    favourites: [],
  },
  reducers: {
    setFavourites(state, action) {
      state.favourites = action.payload;
      console.log("state", state.favourites);
    },
    addFavourite(state, action) {
      state.favourites = [...state.favourites, action.payload];
    },
    removeFavourite(state, action) {
      state.favourites = state.favourites.filter(
        (item) => item !== action.payload
      );
    },
    clearFavourites(state) {
      state.favourites = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.favourites = action.payload;
      })
      .addCase(setFavouritesAsync.fulfilled, (state, action) => {
        console.log("setting faves payload", action.payload);
      });
  },
});

export const { setFavourites, addFavourite, removeFavourite, clearFavourites } =
  favouritesSlice.actions;

export default favouritesSlice.reducer;
