import { createSlice } from "@reduxjs/toolkit";

import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../auth/firebase";
// updateDoc - documents needs to exist already
// setDoc - will create if doesn't exist

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
});

export const {
  setFavourites,
  getFavourites,
  addFavourite,
  removeFavourite,
  clearFavourites,
} = favouritesSlice.actions;

export default favouritesSlice.reducer;
