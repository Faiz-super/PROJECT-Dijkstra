let map;
let directionsService;
let directionsRenderer;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -6.2, lng: 106.8 }, // Jakarta
    zoom: 11,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: false,
    polylineOptions: {
      strokeColor: "#1976d2",
      strokeWeight: 5,
    },
  });
}

function showMessage(message, type = "info") {
  const output = document.getElementById("output");
  output.innerHTML = `<span style="color:${type === 'error' ? 'red' : '#1976d2'}">${message}</span>`;
}

function validateInput(origin, destination) {
  if (!origin.trim() || !destination.trim()) {
    showMessage("📌 Masukkan lokasi awal dan tujuan.", "error");
    return false;
  }
  return true;
}

function calculateRoute() {
  const origin = document.getElementById("start").value;
  const destination = document.getElementById("end").value;

  if (!validateInput(origin, destination)) return;

  showMessage("🔍 Mencari rute...");

  const request = {
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, function (result, status) {
    if (status === "OK") {
      directionsRenderer.setDirections(result);

      const route = result.routes[0].legs[0];
      showMessage(`
        <strong>📍 Rute:</strong> ${route.start_address} ke ${route.end_address}<br>
        <strong>📏 Jarak:</strong> ${route.distance.text}<br>
        <strong>🕐 Waktu Tempuh:</strong> ${route.duration.text}
      `);
    } else {
      showMessage("⚠️ Rute tidak ditemukan. Coba masukkan lokasi yang lebih spesifik.", "error");
    }
  });
}
