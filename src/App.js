// React imports
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Firebase imports
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

// Custom services
import { ProtectedRoute } from "./auth/ProtectedRoute";

// Components
import Layout from "./pages/Layout";
import Countries from "./components/Countries";
import CountriesSingle from "./components/CountriesSingle";
import Home from "./components/Home";
import Favourites from "./components/Favourites";
import Login from "./components/Login";
import Register from "./components/Register";

// Styles
import "bootstrap-icons/font/bootstrap-icons.css";
//import "./styles/stylesheet.scss";
import "./App.css";
import "./styles/card.css";
import "./styles/button.css";
import "./styles/countries.css";
import "./styles/countriesSingle.css";
import "./styles/home.css";
import "./styles/form.css";
import "./styles/header.css";

const App = () => {
  ((g) => {
    var h,
      a,
      k,
      p = "The Google Maps JavaScript API",
      c = "google",
      l = "importLibrary",
      q = "__ib__",
      m = document,
      b = window;
    b = b[c] || (b[c] = {});
    var d = b.maps || (b.maps = {}),
      r = new Set(),
      e = new URLSearchParams(),
      u = () =>
        h ||
        (h = new Promise(async (f, n) => {
          await (a = m.createElement("script"));
          e.set("libraries", [...r] + "");
          for (k in g)
            e.set(
              k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
              g[k]
            );
          e.set("callback", c + ".maps." + q);
          a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
          d[q] = f;
          a.onerror = () => (h = n(Error(p + " could not load.")));
          a.nonce = m.querySelector("script[nonce]")?.nonce || "";
          m.head.append(a);
        }));
    d[l]
      ? console.warn(p + " only loads once. Ignoring:", g)
      : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
  })({
    key: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    // Add other bootstrap parameters as needed, using camel case.
    // Use the 'v' parameter to indicate the version to load (alpha, beta, weekly, etc.)
  });
  const auth = getAuth();
  const [user] = useAuthState(auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          {/* Unprotected routes should be at the top */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
