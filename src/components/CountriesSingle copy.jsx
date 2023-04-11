import React, { useEffect, useState, useMemo } from "react";
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
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const google = window.google;

const CountriesSingle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { single } = useParams();
  const center = useMemo(() => ({ lat: 44, lng: -80 }), []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries: ["places"],
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
      setCountry(location.state.country);
      //setLoading(false);
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location.state.country.capital}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`
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
            `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`
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
    const google = window.google;
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
            pics.getUrl({ maxWidth: 500, maxHeight: 500 })
          )
        );
      }
    );
  };

  useEffect(() => {
    console.log(google.maps);
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
  }, [location.state.country]);

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

      <Row className="m-5 mt-4">
        <Row className="count">
          <h2 className="display-4">{country.name.common}</h2>
        </Row>
        <Row className="m-5 gallery">
          {photos &&
            photos
              .slice(0, 6)
              .map((pic) => <Image alt="pic" src={pic} key={pic} />)}
        </Row>
        {/* <Col>
          {
            <Image
              thumbnail
              src={`https://source.unsplash.com/featured/1600x900?${country.capital}`}
            />
          }
        </Col> */}
        <Row>
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
                    key={country.name.common}
                  >
                    <ListGroupItem>{country.name.common}</ListGroupItem>
                  </LinkContainer>
                ))
              : "none"}
          </ListGroup>
        </Row>
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
