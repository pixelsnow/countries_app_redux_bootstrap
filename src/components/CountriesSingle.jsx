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

/* import { MAP } from "@react-google-maps/api/lib/constants"; */

let service;
const libraries = ["places"];

const CountriesSingle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { single } = useParams();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries,
  });
  /* const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []); */
  //if (location) country = location.state.country;

  const [error, setError] = useState(false);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState(null);
  const [borders, setBorders] = useState(null);
  const [photos, setPhotos] = useState([]);

  const onMapLoad = (map) => {
    let request = {
      query: country.name.common,
      fields: ["place_id"],
    };

    let service = new window.google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log("RESULTS[0] is ", results[0].place_id);
        service.getDetails(
          {
            placeId: results[0].place_id,
          },
          function (place, status) {
            if (place.photos)
              setPhotos(
                place.photos.map((pics) =>
                  pics.getUrl({ maxWidth: 2000, maxHeight: 2000 })
                )
              );
          }
        );
      } else {
        console.log("failed, status is:", status);
      }
    });
  };

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

  const asyncPlaces = async (request) => {
    console.log("google.maps", window.google.maps);
    /* const { PlacesService } = await google.maps.importLibrary("places"); */
    service = new window.google.maps.places.PlacesService(
      document.getElementById("map")
    );
    console.log("placesService", service);

    let place = null;
    service.findPlaceFromQuery(request, (results, status) => {
      console.log("results, status", results, status);
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        place = results[0];
      }
    });
    console.log("details fetched", place);
    return place;
  };

  const logPlaceDetails = (placeID) => {
    service = new window.google.maps.places.PlacesService(
      document.getElementById("map")
    );
    /*     const service = new google.maps.places.PlacesService(
      document.getElementById("map")
    ); */
    service.getDetails(
      {
        placeId: placeID,
      },
      function (place, status) {
        if (place.photos)
          setPhotos(
            place.photos.map((pics) =>
              pics.getUrl({ maxWidth: 2000, maxHeight: 2000 })
            )
          );
      }
    );
  };

  /* useEffect(() => {
    if (!isLoaded) return;
    const request = {
      query: location.state.country.name.common,
      fields: ["displayName", "location", "photos"],
    };
    asyncPlaces(request)
      .then((data) => {
        console.log("ID", data[0].id);
        logPlaceDetails(data[0].id);
      })
      .catch((err) => console.log("getting id failed", err.message));
  }, [location.state.country, country, isLoaded]); */

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
        setError(true);
      });
  }, [country.capital]); */

  const epochToDate = (epoch) => {
    const d = new Date(epoch * 1000);
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
      <Row className="m-5 mb-4 mt-2">
        <Col>
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
        <Col md="auto">
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
      <Row className="m-5">
        <iframe
          title="GoogleMap"
          height="550"
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps/embed/v1/place?q=${country.capital[0]},${country.name.common}&zoom=5&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`}
        />
      </Row>

      <Row className="map-container-container">
        <GoogleMap
          onLoad={(map) => onMapLoad(map)}
          id="map2"
          zoom={10}
          mapContainerClassName="map-container"
        />
        <div id="map"></div>
      </Row>
    </Container>
  );
};

export default CountriesSingle;
