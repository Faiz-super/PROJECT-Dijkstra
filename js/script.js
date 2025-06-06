let map;
let directionsService;
let directionsRenderer;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -6.2, lng: 106.8 }, // Jakarta (misalnya)
    zoom: 11,
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

function calculateRoute() {
  const origin = document.getElementById("start").value;
  const destination = document.getElementById("end").value;

  if (!origin || !destination) {
    alert("Masukkan lokasi awal dan tujuan.");
    return;
  }

  const request = {
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, function (result, status) {
    if (status === "OK") {
      directionsRenderer.setDirections(result);

      // Menampilkan jarak dan durasi
      const output = document.getElementById("output");
      const route = result.routes[0].legs[0];
      output.innerHTML = `
        <strong>Rute:</strong> ${route.start_address} ke ${route.end_address}<br>
        <strong>Jarak:</strong> ${route.distance.text} <br>
        <strong>Waktu Tempuh:</strong> ${route.duration.text}
      `;
    } else {
      alert("Rute tidak ditemukan. Pastikan lokasi valid.");
    }
  });
}
