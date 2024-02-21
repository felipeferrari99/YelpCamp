mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [longitude, latitude],
    zoom: 9
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat([longitude, latitude])
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${title}<h3>`
        )
    )
    .addTo(map)