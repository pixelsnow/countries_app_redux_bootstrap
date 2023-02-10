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
import { Spinner, Button } from "react-bootstrap";
import {
  addFavourite,
  clearFavourites,
} from "../features/countries/favouritesSlice";

const Favourites = () => {
  const dispatch = useDispatch();
  let countriesList = useSelector((state) => state.countries.countries);
  const loading = useSelector((state) => state.countries.isLoading);
  const [search, setSearch] = useState("");

  const [favouritesList, setFavouritesList] = useState([]);
  if (favouritesList !== null) {
    countriesList = countriesList.filter((c) =>
      favouritesList.includes(c.name.common)
    );
  } else {
    countriesList = [];
  }

  useEffect(() => {
    dispatch(initializeCountries());
    setFavouritesList(localStorage.getItem("Favourites"));
  }, [dispatch]);

  if (loading) return <Spinner animation="border" />;
  else
    return (
      <Container fluid>
        <Row>
          <Col className="mt-5 d-flex justify-content-center">
            <Form>
              <Form.Control
                style={{ width: "18rem" }}
                type="search"
                className="me-2 "
                placeholder="Search for countries"
                aria-label="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form>
          </Col>
        </Row>
        <Row xs={2} md={3} lg={4} className=" g-3">
          <Button
            onClick={() => {
              dispatch(clearFavourites);
            }}
          >
            Clear favourites
          </Button>
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
                <LinkContainer
                  to={`/countries/${country.name.common}`}
                  state={{ country: country }}
                >
                  <Card className="h-100">
                    <i
                      className="bi bi-heart-fill text-danger m-1 p-1"
                      onClick={() =>
                        dispatch(addFavourite(country.name.common))
                      }
                    ></i>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{country.name.common}</Card.Title>
                      <Card.Subtitle className="mb-5 text-muted">
                        {country.name.official}
                      </Card.Subtitle>
                      <Card.Img
                        src={country?.flags?.svg}
                        alt={country.name.common}
                      />
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
                </LinkContainer>
              </Col>
            ))}
        </Row>
      </Container>
    );
};

export default Favourites;
