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
  hotels: L.featureGroup().addTo(map),
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

async function loadStops(url) {
  // console.log("Loading", url);
  let response = await fetch(url)
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
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
