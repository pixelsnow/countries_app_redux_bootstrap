// React
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Firebase
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
import "./App.css";
import "./styles/card.css";
import "./styles/button.css";
import "./styles/countriesSingle.css";
import "./styles/home.css";
import "./styles/form.css";
import "./styles/header.css";
import "./styles/forms.css";
import "./styles/footer.css";

const App = () => {
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
