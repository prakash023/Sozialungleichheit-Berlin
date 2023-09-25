    //$(doument).ready(function(){
document.addEventListener("DOMContentLoaded", function() {
    

    var berlinBounds = L.latLngBounds([52.35, 13.08], [52.67, 13.76]);

    var map = L.map('map', {
        center: [52.5200, 13.4050], 
        zoom: 11,
        maxBounds: berlinBounds,
        maxBoundsViscosity: 1.0 
    });

    var marker = null;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    ////Here wmslayer is included
    var wmsLayer1 = L.tileLayer.betterWms("http://localhost:8081/geoserver/mss_2021_Berlin_1/wms", {
        layers: "mss_2021_Berlin_1:berlin_bezirke",
        format: 'image/png', 
        transparent: true 
    });
    wmsLayer1.addTo(map); 


    var wmsLayer2 = L.tileLayer.betterWms("http://localhost:8081/geoserver/mss_2021_Berlin_1/wms", {
        layers: "mss_2021_Berlin_1:choroplethenkarte_berlin_urban",
        format: 'image/png', 
        transparent: true 
    });
    wmsLayer2.addTo(map);

    var wfsLayer = "http://localhost:8081/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=mss_2021_Berlin_1:choroplethenkarte_berlin_urban&outputFormat=application/json" 
    fetch(wfsLayer, {
        method: 'GET',
        credentials: 'include', // Include cookies
        headers: {
            'SameSite': 'None',    // Set SameSite attribute
            
            'Secure': 'true'       // Use secure connection (HTTPS)      
        }
    })
        .then(response => response.json())
        .then(res => {
        
        // Handle the WFS layer data
        console.log(res);
    })
    .catch(error => {
        console.error('Error fetching WFS layer:', error); 

      /*   $.getJSON(wfsLayer).then(res=>{
            console.log(res); */

    }); 
    function fetchLocation(query) {
        var apiKey = 'YourAPIKey';
        var apiUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${query}&apiKey=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.items.length > 0) {
                    var location = data.items[0].position;


                if (marker) {
                    try {
                        map.removeLayer(marker);
                    } catch (error){
                        console.error('Error manipulating layer:', error); 
                    }   
                } 

                marker = L.marker([location.lat, location.lng], {
                    draggable: true
                })
                .bindPopup(query)
                .addTo(map)
                .openPopup();

                map.setView([location.lat, location.lng], 11);
                map.setMaxBounds(berlinBounds);

                //infoBox.innerHTML = '';
            }
        })
        .catch(error => {
            console.error('Error fetching location:', error);
        });
}

    function onFeatureClick(e) {
        var properties = e.layer.feature.properties;
        var popupContent = '<div>';
        for (var key in properties) {
            popupContent += key + ': ' + properties[key] + '<br>';
    }
        popupContent += '</div>';
        infoBox.innerHTML = popupContent;
    }

});
