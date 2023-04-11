import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [flags, setFlags] = useState([]);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((res) => {
        setFlags(res.data.map((country) => country.flags.svg));
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="home-container">
      <div>
        <span>Countries app </span>is a simple React application made in
        Business College Helsinki lessons. App uses{" "}
        <a href="https://restcountries.com/">https://restcountries.com/ </a> and{" "}
        <a href="https://openweathermap.org/">https://openweathermap.org/</a>
      </div>
      <div className="all-flags">
        {flags.map((flag) => (
          <img key={flag} src={flag} />
        ))}
      </div>
    </div>
  );
};

export default Home;
