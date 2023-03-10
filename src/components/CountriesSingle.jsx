import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Container, Row, Image, Button, Spinner } from "react-bootstrap";

const CountriesSingle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location);
  const country = location.state.country;

  const [error, setError] = useState(false);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`
      )
      .then((res) => {
        console.log(res.data);
        setWeather(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log();
        setError(true);
      });
  }, [country.capital]);

  console.log(weather);

  if (loading) {
    return (
      <Col className="text-center m-5">
        <Spinner
          animation="border"
          role="status"
          className="center"
          variant="info"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Col>
    );
  }
  return (
    <Container>
      <Row className="m-5">
        <Col>
          <Image
            thumbnail
            src={`https://source.unsplash.com/featured/1600x900?${country.capital}`}
          />
        </Col>
        <Col>
          <h2 className="display-4">{country.name.common}</h2>
          <h3>{country.capital}</h3>
          {!error && weather && (
            <div>
              <p>
                Right now it is <strong>{weather.main.temp}</strong> degrees in{" "}
                {country.capital} and {weather.weather[0].description}
              </p>
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="light" onClick={() => navigate("/countries")}>
            Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CountriesSingle;
