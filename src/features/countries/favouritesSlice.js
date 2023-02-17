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
    getFavourites(state) {},
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
    clearFavourites(state, action) {
      state.favourites = [];
      localStorage.removeItem("Favourites");
    },
  },
});

export const { getFavourites, addFavourite, removeFavourite, clearFavourites } =
  favouritesSlice.actions;

export default favouritesSlice.reducer;
