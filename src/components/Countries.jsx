import React, { useState } from "react";
import { useEffect } from "react";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { initializeCountries } from "../features/countries/countriesSlice";
import { Spinner } from "react-bootstrap";
import {
  fetchFavourites,
  setFavourites,
} from "../features/countries/favouritesSlice";

const Countries = () => {
  const dispatch = useDispatch();
  const countriesList = useSelector((state) => state.countries.countries);
  const loading = useSelector((state) => state.countries.isLoading);
  const [search, setSearch] = useState("");
  let favouritesList = useSelector((state) => state.favourites.favourites);

  useEffect(() => {
    dispatch(initializeCountries());
    dispatch(fetchFavourites());
  }, [dispatch]);

  const addFavouriteHandler = (countryName) => {
    const newList = [...favouritesList, countryName];
    //dispatch(setFavourites(newList));
    dispatch(setFavourites(newList));
  };

  const removeFavouriteHandler = (countryName) => {
    const newList = favouritesList.filter((item) => item !== countryName);
    //dispatch(setFavourites(newList));
    dispatch(setFavourites(newList));
  };

  if (loading) return <Spinner animation="border" />;
  else
    return (
      <Container fluid>
        <Row>
          <Col className="mt-5 d-flex justify-content-center">
            <Form>
              <Form.Control
                type="search"
                className="me-2"
                placeholder="Search for countries"
                aria-label="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form>
          </Col>
        </Row>
        <Row xs={2} md={3} lg={4} className=" g-3">
          {countriesList
            .filter(
              (c) =>
                c.name.official.toLowerCase().includes(search.toLowerCase()) ||
                c.name.common.toLowerCase().includes(search.toLowerCase())
            )
            .map((country) => (
              <Col key={country.name.official} className="mt-5">
                <Card className="h-100">
                  <div className="heart">
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
                  </div>

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
                          {
                            country.languages
                              ? Object.values(country.languages).join(", ")
                              : "---"
                            // Another way: {Object.values(country.languages) || {} }
                          }
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

export default Countries;
