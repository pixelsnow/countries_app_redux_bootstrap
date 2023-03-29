import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { doc, updateDoc, getDoc } from "firebase/firestore";
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
  "favourites/favourites",
  async () => {
    const docRef = doc(db, "favourites", userCredential.user.uid);
    const docSnap = await getDoc(docRef);
    const faves = await docSnap.data().faves;
    return faves;
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
      localStorage.setItem("Favourites", JSON.stringify(state.favourites));
    },
    removeFavourite(state, action) {
      state.favourites = state.favourites.filter(
        (item) => item !== action.payload
      );
      localStorage.setItem("Favourites", JSON.stringify(state.favourites));
    },
    clearFavourites(state) {
      state.favourites = [];
      localStorage.removeItem("Favourites");
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchFavourites.fulfilled, (state, action) => {
      state.favourites = action.payload;
    });
  },
});

export const { setFavourites, addFavourite, removeFavourite, clearFavourites } =
  favouritesSlice.actions;

export default favouritesSlice.reducer;
