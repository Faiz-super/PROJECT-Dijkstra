let map;
let directionsService;
let directionsRenderer;
let autocompleteStart;
let autocompleteEnd;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -6.9, lng: 107.6 }, // pusat Bandung
    zoom: 12,
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

  initAutocomplete();
}

function initAutocomplete() {
  const bandungBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-7.06, 107.43), // sudut kiri bawah Bandung
    new google.maps.LatLng(-6.80, 107.75)  // sudut kanan atas Bandung
  );

  const options = {
    bounds: bandungBounds,
    strictBounds: true,
    componentRestrictions: { country: "id" },
    fields: ["place_id", "geometry", "name"], // ← pastikan ini untuk hasil lebih presisi
  };

  const inputStart = document.getElementById("start");
  const inputEnd = document.getElementById("end");

  autocompleteStart = new google.maps.places.Autocomplete(inputStart, options);
  autocompleteEnd = new google.maps.places.Autocomplete(inputEnd, options);
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

  const selectedMode = document.getElementById("mode").value;
  const request = {
    origin,
    destination,
    travelMode: google.maps.TravelMode[selectedMode],
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
