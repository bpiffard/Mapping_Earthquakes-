// Setting the tileLayer for light mode map
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

//Setting the tileLayer for dark mode map
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

// Adding basse layer to hold both map options
let baseMaps = {
    'Streets': streets,
    'Satellite Streets': satelliteStreets
};

// Initializing the map, center of earth
let myMap = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
});

// Adding base layers to layer control, and adding that to the main map
L.control.layers(baseMaps).addTo(myMap);

// Adding geoJSON data
// Setting url
let earthquakeData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Adding information to style the earthquake markers
function styleInfo(feature) {
    return {
        stroke: true,
        color: '#000000',
        opacity: 1,
        fillColor: getColor(feature.properties.mag),
        fillOpacity: 1,
        weight: 0.5,
        radius: getRadius(feature.properties.mag)
    }
};

function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    } 
    return magnitude*4
};

function getColor(magnitude) {
    if (magnitude > 5) {
        return '#ea2c2c';
    }
    if (magnitude > 4) {
        return '#ea822c';
    }
    if (magnitude > 3) {
        return '#ee9c00';
    }
    if (magnitude > 2) {
        return '#eecc00';
    }
    if (magnitude > 1) {
        return '#d4ee00';
    }
    return '#98ee00';
};

// Adding data using d3
d3.json(earthquakeData).then(function(data) {
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            console.log(data)
            return L.circleMarker(latlng).bindPopup('<p>Magnitude: ' + feature.properties.mag + 
            '</p> <p> Location: ' + feature.properties.place);
        },
    style: styleInfo
    }).addTo(myMap)
});
