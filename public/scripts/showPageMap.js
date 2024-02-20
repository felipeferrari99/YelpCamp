mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map',
    center: [longitude, latitude],
    zoom: 9
});

new mapboxgl.Marker()
    .setLngLat([longitude, latitude])
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${title}<h3>`
        )
    )
    .addTo(map)