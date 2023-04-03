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
    const docRef = doc(db, "favourites", userCredential.user.uid);
    await setDoc(docRef, {
      faves: data,
      uid: userCredential.user.uid,
    });
    return data;
  }
);

const favouritesSlice = createSlice({
  name: "favourites",
  initialState: {
    favourites: [],
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.favourites = action.payload;
      })
      .addCase(setFavouritesAsync.fulfilled, (state, action) => {
        state.favourites = action.payload;
      });
  },
});

export default favouritesSlice.reducer;
