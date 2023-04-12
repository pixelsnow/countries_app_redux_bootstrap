import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Row } from "react-bootstrap";

const Home = () => {
  const [flags, setFlags] = useState([]);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((res) => {
        console.log("num", res.data.length);
        setFlags(res.data.map((country) => country.flags.svg));
      })
      .catch((err) => alert(err.message));
  }, []);

  useEffect(() => {
    console.log("num of flags", flags.length);
  }, [flags]);

  return (
    <>
      <div className="home-container">
        <div className="home-content-container">
          <div className="home-content">
            <span>Countries app </span>is a simple React application made in
            Business College Helsinki lessons. App uses{" "}
            <a href="https://restcountries.com/">REST Countries API </a>,{" "}
            <a href="https://openweathermap.org/">Open weather API</a>
            <Button variant="custom">Log in</Button>
            <Button variant="custom">Sign up</Button>
          </div>
        </div>
      </div>
      <Row>
        <div className="slider">
          <div className="all-flags">
            {flags.map((flag) => (
              <div className="flag-container">
                <img alt="flag" key={flag} src={flag} />
              </div>
            ))}
            {flags.map((flag) => (
              <div className="flag-container">
                <img alt="flag" key={flag} src={flag} />
              </div>
            ))}
          </div>
        </div>
      </Row>
    </>
  );
};

export default Home;
