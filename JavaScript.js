//$(doument).ready(function(){


    var berlinBounds = L.latLngBounds([52.35, 13.08], [52.67, 13.76]);

    var map = L.map('map', {
        center: [52.5200, 13.4050], // Berlin coordinates
        zoom: 11,
        maxBounds: berlinBounds,
        maxBoundsViscosity: 1.0 // Ensures the map is not completely restricted at the boundaries
    });

    var marker = null;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    ////Here wmslayer is included
    var wmsLayer = L.tileLayer.wms("http://localhost:8081/geoserver/mss_2021_Berlin_1/wms", {
        layers: "mss_2021_Berlin_1:berlin_bezirke",
        format: 'image/png', // Change to your desired format
        transparent: true // Change to true or false based on your requirement
    });
    wmsLayer.addTo(map); 


    var wmsLayer1 = L.tileLayer.wms("http://localhost:8081/geoserver/mss_2021_Berlin_1/wms", {
        layers: "mss_2021_Berlin_1:choroplethenkarte_berlin_urban",
        format: 'image/png', // Change to your desired format
        transparent: true // Change to true or false based on your requirement
    });
    wmsLayer1.addTo(map);



//whenever i comment out this section the map runs without any problem but as a WMS Layer.
    /* var wfsLayer = "http://localhost:8081/geoserver/mss_2021_Berlin_1/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=mss_2021_Berlin_1%3Achoroplethenkarte_berlin_urban&maxFeatures=50&outputFormat=application%2Fjson" */

    /* $.getJSON(wfsLayer).then(res=>{
        console.log(res);

    }); */

    function fetchLocation(query) {
        var apiKey = 'iUcWCyFny4vwEZxWkBZ7rA';
        var apiUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${query}&apiKey=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.items.length > 0) {
                    var location = data.items[0].position;

                if (marker) {
                    map.removeLayer(marker);
                }

                marker = L.marker([location.lat, location.lng], {
                    draggable: true
                })
                .bindPopup(query)
                .addTo(map)
                .openPopup();

                map.setView([location.lat, location.lng], 11);
                map.setMaxBounds(berlinBounds);

                infoBox.innerHTML = ''; 
            }
        })
        .catch(error => {
            console.error('Error fetching location:', error);
        });
    }

    document.getElementById('searchButton').addEventListener('click', function() {
        var query = document.getElementById('searchInput').value;
        fetchLocation(query);
    });

    
    function onFeatureClick(e) {
        var properties = e.layer.feature.properties;
        var popupContent = '<div>';
        for (var key in properties) {
            popupContent += key + ': ' + properties[key] + '<br>';
    }
        popupContent += '</div>';
        infoBox.innerHTML = popupContent;
    }
//});

    // Attach click event to the map feature
    // For example, if you have a GeoJSON layer 'geojsonLayer':
    // geojsonLayer.on('click', onFeatureClick);
    /* var wfsLayer = L.Geoserver.wfs("http://localhost:8080/geoserver/wfs", {
    layers: "topp:tasmania_roads",
    });
    wfsLayer.addTo(map); */
