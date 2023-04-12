// React
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Axios
import axios from "axios";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { setFavourites } from "../features/countries/favouritesSlice";

// Bootstrap
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Carousel from "react-bootstrap/Carousel";
import CarouselItem from "react-bootstrap/CarouselItem";
import LinkContainer from "react-router-bootstrap/LinkContainer";

// Custom services
import countryService from "../services/countries";

// Google API
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const libraries = ["places"];

const CountriesSingle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { single } = useParams();

  // Loading google map script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries,
  });
  // Setting reference to the map
  const mapRef = React.useRef();

  // States
  const [error, setError] = useState(false);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState(null);
  const [borders, setBorders] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [center, setCenter] = useState(null);

  // Redux setup
  const dispatch = useDispatch();
  let favouritesList = useSelector((state) => state.favourites.favourites);

  const addFavouriteHandler = (countryName) => {
    const newList = [...favouritesList, countryName];
    dispatch(setFavourites(newList));
  };

  const removeFavouriteHandler = (countryName) => {
    const newList = favouritesList.filter((item) => item !== countryName);
    dispatch(setFavourites(newList));
  };

  // Fetching information about the country and the capital (coordinates, photos) from Google Places Service
  const onMapLoad = (map) => {
    mapRef.current = map;
    const requestCountry = {
      query: country.name.common,
      fields: ["place_id", "name"],
    };
    const requestCapital = {
      query: country.capital[0] + ", " + country.name.common,
      fields: ["name", "geometry"],
    };
    const service = new window.google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(requestCountry, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        service.getDetails(
          {
            placeId: results[0].place_id,
          },
          (place, status) => {
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              place.photos
            ) {
              setPhotos(
                place.photos.map((pics) =>
                  pics.getUrl({ maxWidth: 2000, maxHeight: 2000 })
                )
              );
            } else {
              setPhotos([]);
            }
          }
        );
      } else {
        setPhotos([]);
      }
    });
    service.findPlaceFromQuery(requestCapital, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setCenter(results[0].geometry.location);
      }
    });
  };

  // make sure that when the country is updated information is fetched again
  useEffect(() => {
    if (isLoaded && country && mapRef.current) {
      onMapLoad(mapRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, isLoaded, mapRef]);

  useEffect(() => {
    if (location.state.country) {
      setCountry(location.state.country);
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location.state.country.capital[0]}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`
        )
        .then((res) => {
          setWeather(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(true);
          setLoading(false);
        });
    } else {
      // In case there was no location.state passed, fetch country
      countryService.getSingle(single).then((res) => {
        setCountry(res.data);
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`
          )
          .then((res) => {
            setWeather(res.data);
            setLoading(false);
          })
          .catch((err) => {
            setError(true);
            setLoading(false);
          });
      });
    }
  }, [country, location.state.country, single]);

  // Fetch bordering countries to enable links and full country names
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

  // Converts epoch date to a time string, allowing sunrise and sunset times from Weather API to be human-readable
  const epochToDate = (epoch) => {
    const d = new Date(epoch * 1000);
    return (
      d.getHours().toString().padStart(2, "0") +
      ":" +
      d.getMinutes().toString().padStart(2, "0")
    );
  };

  if (loading || !isLoaded) {
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
      <Row className="m-5 mb-4 mt-2">
        <Col className="back-button-container">
          <Button variant="custom" onClick={() => navigate("/countries")}>
            <i className="bi bi-arrow-left"></i> Back to countries list
          </Button>
        </Col>
      </Row>
      <Row className="m-5 mt-4 main-country-row">
        <Col md="auto" className="gallery">
          {photos && photos.length > 0 && (
            <Carousel interval={2000}>
              {photos &&
                photos.map((pic) => (
                  <CarouselItem key={pic}>
                    <div>
                      <img alt="pic" src={pic} key={pic} />
                    </div>
                  </CarouselItem>
                ))}
            </Carousel>
          )}
        </Col>
        <Col>
          <Row className="country-title">
            <Col md="auto">
              <h2 className="display-4">{country.name.common}</h2>
            </Col>

            <Col md="auto">
              {favouritesList.includes(country.name.common) ? (
                <i
                  className="bi bi-heart-fill text-danger m-1 p-1"
                  onClick={() => removeFavouriteHandler(country.name.common)}
                ></i>
              ) : (
                <i
                  className="bi bi-heart text-danger m-1 p-1"
                  onClick={() => addFavouriteHandler(country.name.common)}
                ></i>
              )}
            </Col>
          </Row>
          <Row className="country-emblems">
            {country.coatOfArms && country.coatOfArms.svg && (
              <Col md="auto" className="coat-of-arms">
                <img src={country.coatOfArms.svg} alt="coat of arms" />
              </Col>
            )}
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
            {borders && borders.length > 0 ? (
              <h3>Countries bordering {country.name.common}</h3>
            ) : (
              <p>{country.name.common} doesn't border any countries</p>
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
        {!error && weather && (
          <Col className="weather-col" md="auto">
            <div className="weather-container">
              <h3>Current weather</h3>

              <div className="weather-main-info-container">
                <Row>
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
              </div>
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
            </div>
          </Col>
        )}
      </Row>
      <Row className="m-5 map-container-container">
        <GoogleMap
          onLoad={(map) => onMapLoad(map)}
          id="map"
          zoom={6}
          mapContainerClassName="map-container"
          center={center}
        >
          {center && <Marker position={center}></Marker>}
        </GoogleMap>
      </Row>
    </Container>
  );
};

export default CountriesSingle;
