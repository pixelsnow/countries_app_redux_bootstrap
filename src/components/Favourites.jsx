// React
import React, { useState, useEffect } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  initializeCountries,
  isLoading,
} from "../features/countries/countriesSlice";
import { setFavourites } from "../features/countries/favouritesSlice";

// Bootstrap
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";

const Favourites = () => {
  const dispatch = useDispatch();
  let countriesList = useSelector((state) => state.countries.countries);
  const loading = useSelector((state) => state.countries.isLoading);
  const favouritesList = useSelector((state) => state.favourites.favourites);

  const [search, setSearch] = useState("");

  if (favouritesList !== null) {
    countriesList = countriesList.filter((c) =>
      favouritesList.includes(c.name.common)
    );
  } else {
    countriesList = [];
  }

  useEffect(() => {
    dispatch(initializeCountries());
  }, [dispatch]);

  const handleClearFavourites = () => {
    dispatch(isLoading);
    dispatch(setFavourites([]));
    dispatch(isLoading);
  };

  const addFavouriteHandler = (countryName) => {
    const newList = [...favouritesList, countryName];
    dispatch(setFavourites(newList));
  };

  const removeFavouriteHandler = (countryName) => {
    const newList = favouritesList.filter((item) => item !== countryName);
    dispatch(setFavourites(newList));
  };

  if (loading)
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
  else
    return (
      <Container className="cards-container" fluid>
        <Row>
          <Col className="mt-3 d-flex justify-content-center">
            <h1>Favourites</h1>
          </Col>
        </Row>
        <Row>
          <Col className="mt-3 d-flex justify-content-end">
            <Button variant="custom" onClick={handleClearFavourites}>
              Clear favourites
            </Button>
          </Col>
          <Col className="mt-3 d-flex justify-content-start">
            <Form>
              <Form.Control
                style={{ width: "18rem" }}
                type="search"
                className="me-2"
                placeholder="Search favourites"
                aria-label="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form>
          </Col>
        </Row>
        <Row xs={1} sm={2} md={3} lg={4} xxl={5} className="g-3">
          {countriesList
            .filter(
              (c) =>
                c.name.official.toLowerCase().includes(search.toLowerCase()) ||
                c.name.common.toLowerCase().includes(search.toLowerCase())
            )
            .map((country) => (
              <Col key={country.name.official} className="mt-5">
                <Card className="h-100">
                  {favouritesList.includes(country.name.common) ? (
                    <i
                      className="bi bi-heart-fill text-danger m-1 p-1"
                      onClick={() =>
                        removeFavouriteHandler(country.name.common)
                      }
                    ></i>
                  ) : (
                    <i
                      className="bi bi-heart text-danger m-1 p-1"
                      onClick={() => addFavouriteHandler(country.name.common)}
                    ></i>
                  )}

                  <Card.Body className="d-flex flex-column">
                    <LinkContainer
                      className="card-link-container"
                      to={`/countries/${country.name.common}`}
                      state={{ country: country }}
                    >
                      <div>
                        <Card.Title>{country.name.common}</Card.Title>
                        <Card.Subtitle className="mb-5 text-muted">
                          {country.name.official}
                        </Card.Subtitle>
                        <Card.Img
                          src={country?.flags?.svg}
                          alt={country.name.common}
                        />
                      </div>
                    </LinkContainer>
                    <ListGroup
                      variant="flush"
                      className="flex-grow-1 justify-content-end"
                    >
                      <ListGroup.Item>
                        <i className="bi bi-translate me-2"></i>
                        <span>
                          {country.languages
                            ? Object.values(country.languages).join(", ")
                            : "---"}
                        </span>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <i className="bi bi-cash-coin me-2"></i>
                        <span>
                          {country.currencies
                            ? Object.values(country.currencies)
                                .map((currency) => currency.name)
                                .join(", ")
                            : "---"}
                        </span>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <i className="bi bi-people me-2"></i>
                        <span>
                          {country.population.toLocaleString("fi-FI")}
                        </span>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    );
};

export default Favourites;
