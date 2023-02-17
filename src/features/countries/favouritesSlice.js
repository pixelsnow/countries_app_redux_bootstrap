import { createSlice } from "@reduxjs/toolkit";

const favourites =
  localStorage.getItem("Favourites") !== null
    ? JSON.parse(localStorage.getItem("Favourites"))
    : [];

const favouritesSlice = createSlice({
  name: "favourites",
  initialState: {
    favourites: favourites,
  },
  reducers: {
    getFavourites(state, action) {},
    addFavourite(state, action) {
      state.favourites = [...state.favourites, action.payload];
      localStorage.setItem("Favourites", JSON.stringify(state.favourites));
      console.log(state.favourites);
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
