mapboxgl.accessToken = mapToken;
console.log(camp.geometry.coordinates);
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: camp.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker({
  color: "blue",
  draggable: true,
})
  .setLngLat(camp.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${camp.title}</h3><p>${camp.location}</p>`
    )
  )
  .addTo(map);
