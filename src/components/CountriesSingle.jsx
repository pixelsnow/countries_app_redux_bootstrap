import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Col,
  Container,
  Row,
  Button,
  Spinner,
  Carousel,
  CarouselItem,
} from "react-bootstrap";
import countryService from "../services/countries";
import { LinkContainer } from "react-router-bootstrap";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

let google = window.google;

const CountriesSingle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { single } = useParams();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY /* ,
    libraries: ["places"], */,
  });

  //if (location) country = location.state.country;

  const [error, setError] = useState(false);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState(null);
  const [borders, setBorders] = useState(null);
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    if (location.state.country) {
      /*  if (location.state.country) { */
      console.log("state exists");
      setCountry(location.state.country);
      //setLoading(false);
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location.state.country.capital[0]}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`
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
            `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`
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
      setBorders(values.map((country) => country.data[0]));
    });
  }, [location.state.country.borders]);

  const asyncPlaces = async (request) => {
    if (!google) google = window.google;
    const { places } = await google.maps.places.Place.findPlaceFromQuery(
      request
    );
    return places;
  };

  const logPlaceDetails = (placeID) => {
    var service = new google.maps.places.PlacesService(
      document.getElementById("map")
    );
    service.getDetails(
      {
        placeId: placeID,
      },
      function (place, status) {
        setPhotos(
          place.photos.map((pics) =>
            pics.getUrl({ maxWidth: 2000, maxHeight: 2000 })
          )
        );
        console.log("photos set");
      }
    );
  };

  useEffect(() => {
    console.log("new photos set", photos);
  }, [photos]);

  useEffect(() => {
    console.log("refetching photos", location.state.country.name.common);
    /*axios
       .get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURI(
          location.state.country.name.common
        )}&types=(regions)&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      )
      .then((data) => console.log("data!!!", data))
      .catch((err) => console.log(err)); */
    /* axios
      .get(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURI(
          location.state.country.name.common
        )}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`,
        { headers: { "Access-Control-Allow-Origin": "*" } }
      )
      .then((data) => console.log(data.data)); */
    /* axios
      .get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJMVd4MymgVA0R99lHx5Y__Ws&fields=photo&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`
      )
      .then((data) => console.log("places fetched!", data)); */
    /* const map = new google.maps.Map(document.getElementById("map"), {
      center: sydney,
      zoom: 15,
    }); */
    const request = {
      query: location.state.country.name.common,
      fields: ["displayName", "location"],
    };
    asyncPlaces(request).then((data) => {
      console.log("ID", data[0].id);
      /* const requestPhotos = {
        placeId: data[0].id,
        fields: ["photos"],
      }; */
      logPlaceDetails(data[0].id);
    });
  }, [location.state.country, country]);

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

  const epochToDate = (epoch) => {
    const d = new Date(epoch * 1000);
    console.log(d);
    return (
      d.getHours().toString().padStart(2, "0") +
      ":" +
      d.getMinutes().toString().padStart(2, "0")
    );
  };

  if (loading /* || !google || !google.maps  */ || !isLoaded) {
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
      <Row className="m-5 mt-4 main-country-row">
        <Col md="auto" className="gallery">
          <Carousel interval={2000}>
            {photos &&
              photos.slice(0, 6).map((pic) => (
                <CarouselItem key={pic}>
                  <div>
                    <img alt="pic" src={pic} key={pic} />
                  </div>
                </CarouselItem>
              ))}
          </Carousel>
        </Col>
        {/* <Col>
          {
            <Image
              thumbnail
              src={`https://source.unsplash.com/featured/1600x900?${country.capital}`}
            />
          }
        </Col> */}
        <Col>
          <Row className="country-title">
            <Col md="auto" className="coat-of-arms">
              {country.coatOfArms.svg && (
                <img src={country.coatOfArms.svg} alt="coatOfArms" />
              )}
            </Col>
            <Col md="auto">
              <h2 className="display-4">{country.name.common}</h2>
            </Col>
            <Col md="auto" className="flag-container">
              {country.flags.svg ? (
                <img src={country.flags.svg} alt={country.flags.alt} />
              ) : (
                <img src={country.flags.png} alt={country.flags.alt} />
              )}
            </Col>
          </Row>
          <Col>
            <Row className="country-info">
              <Col>
                Capital: <span>{country.capital.join(" ,")}</span>{" "}
              </Col>
            </Row>
            <Row className="country-info">
              <Col>
                Area: <span>{country.area.toLocaleString("fi-FI")}</span> km²{" "}
              </Col>
            </Row>
            <Row className="country-info">
              <Col>
                Population:{" "}
                <span>{country.population.toLocaleString("fi-FI")}</span>{" "}
              </Col>
            </Row>
          </Col>

          <Row className="borders-heading">
            {borders ? (
              <h3>Countries bordering {country.name.common}</h3>
            ) : (
              <h3>{country.name.common} doesn't border any countries</h3>
            )}
          </Row>
          <Row className="borders-container" fluid="true">
            {borders &&
              borders.map((country) => (
                <Col
                  key={country.name.common}
                  className="border-container"
                  md="auto"
                >
                  <LinkContainer
                    to={`/countries/${country.name.common}`}
                    state={{ country: country }}
                    key={country.name.common}
                  >
                    <Button variant="custom">{country.name.common}</Button>
                  </LinkContainer>
                </Col>
              ))}
          </Row>
        </Col>
        <Col md="auto">
          <div className="weather-container">
            <h3>Current weather</h3>
            {!error && weather && (
              <>
                <Row className="weather-main-info-container">
                  <Col md="auto">
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                      alt={weather.weather[0].description}
                    />
                  </Col>
                  <Col>
                    <p>
                      Right now it is <span> {weather.main.temp}°C </span>{" "}
                      degrees in {country.capital[0]} and{" "}
                      {weather.weather[0].description}
                    </p>
                  </Col>
                </Row>
                <Row className="weather-item-container" fluid="true">
                  <Col className="weather-item" md="auto">
                    <i className="bi bi-wind"></i> {weather.wind.speed}m/s
                  </Col>
                  <Col className="weather-item" md="auto">
                    <i className="bi bi-moisture"></i> {weather.main.humidity}%
                  </Col>

                  <Col className="weather-item" md="auto">
                    <i className="bi bi-sunrise"></i>{" "}
                    {epochToDate(weather.sys.sunrise)}
                  </Col>
                  <Col className="weather-item" md="auto">
                    <i className="bi bi-sunset"></i>{" "}
                    {epochToDate(weather.sys.sunset)}
                  </Col>
                </Row>
              </>
            )}
          </div>
        </Col>
      </Row>
      <Row className="m-5">
        <iframe
          title="GoogleMap"
          height="550"
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps/embed/v1/place?q=${country.capital}&zoom=5&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`}
        />
      </Row>

      <Row className="m-5">
        <GoogleMap
          id="map"
          zoom={10}
          center={{ lat: 44, lng: -80 }}
          mapContainerClassName="map-container"
        ></GoogleMap>
      </Row>
    </Container>
  );
};

export default CountriesSingle;
