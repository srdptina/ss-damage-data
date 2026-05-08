// Initialize the map centered on the Philippines
var map = L.map("map", {
    center: [12.8797, 121.7740],
    zoom: 6,
});

// Google Satellite layer (default)
var googleSat = L.tileLayer('https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
    attribution: '&copy; Google'
});
googleSat.addTo(map);

// openstreetmap
var osm = L.tileLayer.provider('OpenStreetMap.Mapnik');

//world imagery
var worldImagery = L.tileLayer.provider('Esri.WorldImagery');

// Layer control to switch between maps
var baseLayers = {
    "Google Satellite": googleSat,
    "OpenStreetMap": osm,
    "World Imagery": worldImagery
};

var ctlmeasure = L.control.polylineMeasure({
    position: 'topleft',
    measurecontroltitle: 'Measure distance',
}).addTo(map);

// Create an empty layer group for the storm surge data
var ssdmgLayerGroup = L.layerGroup();

var overlayMaps = {
    "Storm Surge Damage Data": ssdmgLayerGroup
};

var maplayers = L.control.layers(baseLayers, overlayMaps).addTo(map);

var markers = L.markerClusterGroup();

// Load the storm surge data and add it to the layer group
$.getJSON("data/StormSurgeData_DPWH_260427_cleandata.geojson", function (data) {
    var ssdmgLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 8,
                color: "red",
                weight: 1,
                fillColor: "yellow",
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<b>ID:</b> " + feature.properties["NewID"] + "<br>" +
                "<b>Location:</b> " + feature.properties["Location"] + "<br>" +
                "<b>Damage Cost:</b> Php " + feature.properties["DMGCost"] + "<br>" +
                "<b>Event:</b> " + feature.properties["Event"] + "<br>" +
                "<b>Date:</b> " + feature.properties["Date"] + "<br>" +
                "<b>Source:</b> " + feature.properties["DEO"]
            );
        }
    });
    
    // Add the GeoJSON layer to the cluster group
    markers.addLayer(ssdmgLayer);
    ssdmgLayerGroup.addLayer(markers);
    markers.addTo(map);
});
ssdmgLayerGroup.addTo(map);