import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { ProtectedRoute } from "./auth/ProtectedRoute";
import { fetchFavourites } from "./features/countries/favouritesSlice";

import Layout from "./pages/Layout";
import Countries from "./components/Countries";
import CountriesSingle from "./components/CountriesSingle";
import Home from "./components/Home";
import Favourites from "./components/Favourites";
import Login from "./components/Login";
import Register from "./components/Register";

import "bootstrap-icons/font/bootstrap-icons.css";
//import "./styles/stylesheet.scss";

const App = () => {
  const dispatch = useDispatch();

  const auth = getAuth();

  // Make sure to fetch favourites from database after authorisation
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("user signed in!", user);
      dispatch(fetchFavourites());
    } else {
      console.log("user signed out");
    }
  });

  const [user] = useAuthState(auth);

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
