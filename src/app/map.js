let map;
let centerCoordinates = { lat: 37.4161493, lng: -122.0812166 };

const google = window.google;

function initMap() {
  findPlace();
}

async function findPlace() {
  const request = {
    query: "Austria",
    fields: ["displayName", "location", "photos"],
  };
  const { places } = await google.maps.places.Place.findPlaceFromQuery(request);
  console.log("PLACES", places);

  if (places.length) {
    const place = places[0];
    const location = place.location;
    const markerView = new google.maps.marker.AdvancedMarkerView({
      map,
      position: place.location,
      title: place.displayName,
    });

    map.setCenter(location);
  } else {
    console.log("No results");
  }
}
