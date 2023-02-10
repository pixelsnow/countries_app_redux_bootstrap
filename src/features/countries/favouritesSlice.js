import { createSlice } from "@reduxjs/toolkit";

const favouritesSlice = createSlice({
  name: "favourites",
  initialState: {
    favourites: [],
  },
  reducers: {
    getFavourites(state, action) {},
    addFavourite(state, action) {
      state.favourites = [...state.favourites, action.payload];
      localStorage.setItem("Favourites", JSON.stringify(state.favourites));
    },
    clearFavourites(state, action) {
      state.favourites = [];
      localStorage.removeItem("Favourites");
    },
  },
});

export const { getFavourites, addFavourite, clearFavourites } =
  favouritesSlice.actions;

export default favouritesSlice.reducer;
