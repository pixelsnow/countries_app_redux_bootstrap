import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Col,
  Container,
  Row,
  Image,
  Button,
  Spinner,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import countryService from "../services/countries";
import { LinkContainer } from "react-router-bootstrap";

const CountriesSingle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { single } = useParams();
  console.log("location", location);
  console.log("single", single);

  //if (location) country = location.state.country;

  const [error, setError] = useState(false);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState(null);
  const [borders, setBorders] = useState(null);

  useEffect(() => {
    if (location.state.country) {
      /*  if (location.state.country) { */
      console.log("state exists");
      setCountry(location.state.country);
      //setLoading(false);
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location.state.country.capital}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`
        )
        .then((res) => {
          console.log("weather data", res.data);
          setWeather(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });
    } else {
      console.log("no state");
      countryService.getSingle(single).then((res) => {
        setCountry(res.data);

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
      });
    }
  }, [country, location.state.country, single]);

  useEffect(() => {
    const codes = location.state.country.borders;
    if (!codes) return;
    const promises = codes.map((code) =>
      axios.get(`https://restcountries.com/v3.1/alpha/${code}`)
    );
    Promise.all(promises).then((values) => {
      console.log(values);
      console.log(values.map((country) => country.data[0]));
      setBorders(values.map((country) => country.data[0]));
    });
  }, [location.state.country.borders]);

  useEffect(() => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURI(
          location.state.country.name.common
        )}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`,
        { headers: { "Access-Control-Allow-Origin": "*" } }
      )
      .then((data) => console.log(data.data));
  }, [location.state.country]);
  useEffect(() => console.log("country changed", country), [country]);

  /*   useEffect(() => {
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
  }, [country.capital]); */

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
    <Container className="countries-single-container">
      <Row className="m-5 mb-4 mt-5">
        <Col>
          <Button variant="light" onClick={() => navigate("/countries")}>
            Back to countries list
          </Button>
        </Col>
      </Row>
      <Row className="m-5 mt-4">
        <Col>
          {
            <Image
              thumbnail
              src={`https://source.unsplash.com/featured/1600x900?${country.capital}`}
            />
          }
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
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
            </div>
          )}
          <h3>Borders:</h3>
          <ListGroup>
            {borders
              ? borders.map((country) => (
                  <LinkContainer
                    to={`/countries/${country.name.common}`}
                    state={{ country: country }}
                  >
                    <ListGroupItem>{country.name.common}</ListGroupItem>
                  </LinkContainer>
                ))
              : "none"}
          </ListGroup>
        </Col>
      </Row>
      <Row className="m-5">
        <iframe
          title="GoogleMap"
          height="350"
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps/embed/v1/place?q=${country.capital}&zoom=10&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`}
        />
      </Row>
    </Container>
  );
};

export default CountriesSingle;
