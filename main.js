/* Vienna Sightseeing Beispiel */
// Stephansdom Objekt
let stephansdom = {
  lat: 48.208493,
  lng: 16.373118,
  title: "Stephansdom",
};

// Karte initialisieren
let map = L.map("map").setView([stephansdom.lat, stephansdom.lng], 12);

// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
let startLayer = L.tileLayer.provider("BasemapAT.grau");
startLayer.addTo(map);

let themaLayer = {
  sights: L.featureGroup().addTo(map),
  lines: L.featureGroup().addTo(map),
  stops: L.featureGroup().addTo(map),
  zones: L.featureGroup().addTo(map),
  hotels: L.featureGroup(),
}

// Hintergrundlayer
L.control
  .layers({
    "BasemapAT Grau": startLayer,
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
    "Esri.WorldImagery": L.tileLayer.provider("Esri.WorldImagery"),
  }, {
    "Sehenswürdigkeiten": themaLayer.sights,
    "Buslinien": themaLayer.lines,
    "Haltestellen": themaLayer.stops,
    "Fußgängerzonen": themaLayer.zones,
    "Hotels": themaLayer.hotels,
  })
  .addTo(map);

// Marker Stephansdom
// L.marker([stephansdom.lat, stephansdom.lng])
//   .addTo(map)
//   .bindPopup(stephansdom.title)
//   .openPopup();

// Maßstab
L.control
  .scale({
    imperial: false,
  })
  .addTo(map);

L.control
  .fullscreen()
  .addTo(map);

async function loadSights(url) {
  //console.log("Loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  //console.log(geojson);
  L.geoJSON(geojson, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: "icons/photo.png",
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
        })
      });
    },
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(feature.properties.NAME);
      layer.bindPopup(`
        <img src="${feature.properties.THUMBNAIL}" als=" alt="*">
      <h4><a href="${feature.properties.WEITERE_INF}"
      target="wien">${feature.properties.NAME}</a></h4>
      <address>${feature.properties.ADRESSE}</address>
      `);
    }
  }).addTo(themaLayer.sights);
}
loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json")

async function loadLines(url) {
  // console.log("Loading", url);
  let response = await fetch(url)
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    style: function (feature) {
      console.log(feature.properties.LINE_NAME);
      let lineName = feature.properties.LINE_NAME;
      let lineColor = "black";
      if (lineName == "Red Line") {
        lineColor = "#F44136";
      } else if (lineName == "Blue Line") {
        lineColor = "#0074D9";
      } else if (lineName == "Grey Line") {
        lineColor = "#AAAAAA";
      } else if (lineName == "Orange Line") {
        lineColor = "#FF851B";
      } else if (lineName == "Yellow Line") {
        lineColor = "#FFDC00";
      } else if (lineName == "Green Line") {
        lineColor = "#2ECC40";
      }
      else {
        //Vielleicht kommen noch andere Farben dazu ...
      }
      return {
        color: lineColor,
      }
    },
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(feature.properties.NAME);
      layer.bindPopup(`
    
     <p> <i class="fa-solid fa-bus-simple"></i>
      <strong>${feature.properties.LINE_NAME}</strong> </p>
      
      <i class="fa-solid fa-circle-stop"></i> 
      ${feature.properties.FROM_NAME} <br>
      <i class="fa-solid fa-up-down"></i> <br>
      <i class="fa-solid fa-circle-stop"></i>
      ${feature.properties.TO_NAME}
        `);
    }
  }).addTo(themaLayer.lines);
}
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");

/*
bus_1.png Red
bus_2.png Yellow
bus_3.png Blue
bus_4.png Green
bus_5.png Grey
bus_6.png Orange
*/

async function loadStops(url) {
  // console.log("Loading", url);
  let response = await fetch(url)
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: `icons/bus_${feature.properties.LINE_ID}.png`,
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
        })
      });
    },
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(feature.properties.NAME);
      layer.bindPopup(`
      <i class="fa-solid fa-bus-simple"></i>
      <strong>${feature.properties.LINE_NAME}</strong> </p>
      ${feature.properties.STAT_ID}
      ${feature.properties.STAT_NAME}
        `);
    }
  }).addTo(themaLayer.stops);
}
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");

async function loadZones(url) {
  // console.log("Loading", url);
  let response = await fetch(url)
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    style: function (feature) {
      return {
        color: "#F012BE",
        weight: 1,
        opacity: 0.4,
        fillOpacity: 0.1,
      };
    },
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(feature.properties.NAME);
      layer.bindPopup(`
      <p><strong>Fußgängerzone ${feature.properties.ADRESSE} </strong></p>
      <i class="fa-regular fa-clock"></i>
      ${feature.properties.ZEITRAUM || "dauerhaft"}
      <p><i class="fa-solid fa-circle-info"></i> 
      ${feature.properties.AUSN_TEXT || "ohne Ausnahme"}
      </p>
        `);
    }
  }).addTo(themaLayer.zones);
}
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");


async function loadHotels(url) {
  // console.log("Loading", url);
  let response = await fetch(url)
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    pointToLayer: function (feature, latlng) {
      //console.log(feature.properties.LINE_NAME);
      let hotelKat = feature.properties.KATEGORIE_TXT;
      let iconName;
      if (hotelKat == "nicht kategorisiert") {
        iconName = "hotel_0star";
      } else if (hotelKat == "1*") {
        iconName = "hotel_1star";
      } else if (hotelKat == "2*") {
        iconName = "hotel_2stars";
      } else if (hotelKat == "3*") {
        iconName = "hotel_3stars";
      } else if (hotelKat == "4*") {
        iconName = "hotel_4stars";
      } else if (hotelKat == "5*") {
        iconName = "hotel_5stars";
      }
      else {
        //Vielleicht gibts irgendwann 6* ...
      }
      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: `icons/${iconName}.png`,
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
        })
      });
    },
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(feature.properties.NAME);
      layer.bindPopup(`
<h3><i class="fa-solid fa-hotel"> </i>${feature.properties.BETRIEB} </h3>
<h3><p>${feature.properties.BETRIEBSART_TXT} ${feature.properties.KATEGORIE_TXT}</p></h3>
<hr>
<p>Addr.: ${feature.properties.ADRESSE} <br>
<a href="tel:${feature.properties.KONTAKT_TEL}"><i class="fa-solid fa-phone"></i> ${feature.properties.KONTAKT_TEL}</a> <br>
<a href="mailto:${feature.properties.KONTAKT_EMAIL}"><i class="fa-solid fa-envelope"></i> ${feature.properties.KONTAKT_EMAIL}</a> <br>
<a href= "${feature.properties.WEBLINK1}"target="hotel"> <i class="fa-solid fa-globe"></i>Homepage</a>
</p>
        `);
    }
  }).addTo(themaLayer.hotels);
}
loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json");
