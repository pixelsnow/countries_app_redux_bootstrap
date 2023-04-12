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
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const libraries = ["places"];

const CountriesSingle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { single } = useParams();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries,
  });

  const mapRef = React.useRef();

  const [error, setError] = useState(false);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState(null);
  const [borders, setBorders] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [center, setCenter] = useState(null);

  const onMapLoad = (map) => {
    mapRef.current = map;
    setCountry(location.state.country);

    const requestCountry = {
      query: country.name.official,
      fields: ["place_id", "name", "geometry"],
    };
    const requestCapital = {
      query: country.capital[0] + ", " + country.name.official,
      fields: ["place_id", "name", "geometry"],
    };

    const service = new window.google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(requestCountry, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log("RESULTS is ", results);
        console.log("RESULTS[0] is ", results[0]);
        service.getDetails(
          {
            placeId: results[0].place_id,
          },
          (place, status) => {
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              place.photos
            ) {
              console.log("place", place);
              setPhotos(
                place.photos.map((pics) =>
                  pics.getUrl({ maxWidth: 2000, maxHeight: 2000 })
                )
              );
            } else {
              console.log("getting details failed, status is", status);
            }
          }
        );
      } else {
        console.log("getting id failed, status is:", status);
      }
    });
    service.findPlaceFromQuery(requestCapital, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log("RESULTS[0] for capital is ", results[0]);
        setCenter(results[0].geometry.location);
      } else {
        console.log("getting id failed, status is:", status);
      }
    });
  };

  useEffect(() => {
    if (isLoaded && country && mapRef.current) {
      console.log("called from useEffect");
      console.log("REF", mapRef.current);
      console.log("country", country);
      onMapLoad(mapRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, isLoaded, mapRef]);

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
          setWeather(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(true);
        });
    } else {
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
                photos.slice(0, 6).map((pic) => (
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
            {country.coatOfArms && country.coatOfArms.svg && (
              <Col md="auto" className="coat-of-arms">
                <img src={country.coatOfArms.svg} alt="coat of arms" />
              </Col>
            )}
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
        <Col className="weather-col" md="auto">
          <div className="weather-container">
            <h3>Current weather</h3>
            {!error && weather && (
              <>
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
              </>
            )}
          </div>
        </Col>
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
