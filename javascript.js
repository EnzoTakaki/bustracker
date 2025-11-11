// Initialize the map
function initMap() {
  // Default coordinates (can be changed to your city's coordinates)
  const cityCenter = { lat: 40.7128, lng: -74.006 }; // New York City

  // Create the map
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: cityCenter,
    styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit.station",
        stylers: [{ visibility: "on" }],
      },
    ],
  });

  // Sample bus route coordinates
  const routeCoordinates = [
    { lat: 40.7128, lng: -74.026 }, // Start point
    { lat: 40.715, lng: -74.02 },
    { lat: 40.717, lng: -74.015 },
    { lat: 40.719, lng: -74.01 },
    { lat: 40.721, lng: -74.005 },
    { lat: 40.723, lng: -74.0 }, // End point
  ];

  // Draw the route on the map
  const routePath = new google.maps.Polyline({
    path: routeCoordinates,
    geodesic: true,
    strokeColor: "#3B82F6",
    strokeOpacity: 1.0,
    strokeWeight: 4,
  });
  routePath.setMap(map);

  // Add bus stops to the map
  const busStops = [
    { position: routeCoordinates[0], name: "Main St Station" },
    { position: routeCoordinates[2], name: "Market Square" },
    { position: routeCoordinates[4], name: "City Hall" },
    { position: routeCoordinates[5], name: "Central Park" },
  ];

  busStops.forEach((stop, index) => {
    const marker = new google.maps.Marker({
      position: stop.position,
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor:
          index === 0
            ? "#3B82F6"
            : index === busStops.length - 1
            ? "#EF4444"
            : "#6B7280",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "white",
      },
      title: stop.name,
    });

    // Add info window for each stop
    const infowindow = new google.maps.InfoWindow({
      content: `<div class="font-medium">${stop.name}</div>`,
    });

    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
  });

  // Simulate a moving bus
  let busPositionIndex = 0;
  const busMarker = new google.maps.Marker({
    position: routeCoordinates[0],
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: "#3B82F6",
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: "white",
    },
    title: "Bus #B-4271",
  });

  // Animate bus movement along the route
  function moveBus() {
    if (busPositionIndex < routeCoordinates.length - 1) {
      busPositionIndex++;
      const newPosition = routeCoordinates[busPositionIndex];
      busMarker.setPosition(newPosition);

      // Calculate heading for the bus icon to point in direction of travel
      if (busPositionIndex > 0) {
        const prevPosition = routeCoordinates[busPositionIndex - 1];
        const heading = google.maps.geometry.spherical.computeHeading(
          prevPosition,
          newPosition
        );
        busMarker.setIcon({
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 5,
          fillColor: "#3B82F6",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "white",
          rotation: heading,
        });
      }

      setTimeout(moveBus, 3000); // Move every 3 seconds
    } else {
      // Reset to start when reaching the end
      busPositionIndex = 0;
      busMarker.setPosition(routeCoordinates[0]);
      setTimeout(moveBus, 3000);
    }
  }

  // Start bus movement
  setTimeout(moveBus, 1000);

  // Add click event to route cards to center map on that route
  document.querySelectorAll(".route-card button").forEach((button) => {
    button.addEventListener("click", function () {
      // Center map on the route
      const bounds = new google.maps.LatLngBounds();
      routeCoordinates.forEach((coord) => {
        bounds.extend(coord);
      });
      map.fitBounds(bounds);

      // Show the route details panel with animation
      document.querySelector(".slide-in").classList.add("slide-in");
    });
  });
}

// Initialize the map when the window loads
window.onload = initMap;
