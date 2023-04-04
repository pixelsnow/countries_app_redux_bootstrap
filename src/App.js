import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import Countries from "./components/Countries";
import CountriesSingle from "./components/CountriesSingle";
import Home from "./components/Home";
import Layout from "./pages/Layout";
import Favourites from "./components/Favourites";
import Login from "./components/Login";
import Register from "./components/Register";

//import { auth } from "./auth/firebase";

import "bootstrap-icons/font/bootstrap-icons.css";
//import "./styles/stylesheet.scss";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { fetchFavourites } from "./features/countries/favouritesSlice";
import { useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const App = () => {
  const dispatch = useDispatch();
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("user signed in!", user);
      dispatch(fetchFavourites());
    } else {
      console.log("user signed out");
    }
  });
  const [user] = useAuthState(auth);
  /* const [user] = useAuthState(auth);
  useEffect(() => {
    dispatch(fetchFavourites());
    console.log("user changed!", user);
  }, [user, dispatch]);

  onAuthStateChanged(auth, (user) => {
    if (user) dispatch(fetchFavourites());
  }); */

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          {/* Unprotected routes should be at the top */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected routes are inside ProtectedRoute */}
          <Route element={<ProtectedRoute user={user} />}>
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/countries/:single" element={<CountriesSingle />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
