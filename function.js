var xa = "";
var xy = "";
var map;
var marker;
var bypass = false;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const sleep = (delay) => new Promise( (resolve) => setTimeout(resolve, delay));

function generateValue(){
  if(bypass){
    xa = Math.round(getRandomArbitrary(360041667, 711338889))/10000000;
    xy = Math.round(getRandomArbitrary(-9498885000000000, 66618055555555540))/1000000000000000;
  }
  else{
    xa = Math.round(getRandomArbitrary(423327778, 510716667))/10000000;
    xy = Math.round(getRandomArbitrary(-4795555555555556, 8230555555555556))/1000000000000000;
  }
}

async function verifyCountry(){
  let geocoder = new google.maps.Geocoder();
  return await geocoder.geocode({ location: {lat: xa, lng: xy} }).then((response) => {
      for (a of response.results[0].address_components){
        if(a.types[0] == "country")
        {
          if(a.long_name == "France" || bypass) return false;
        }
      }
      return true;
    });
}

async function loadValue(){
  generateValue();
  while(await verifyCountry()){
    generateValue();
    await sleep(100);
  }
  document.getElementById('cds').innerHTML = "Coordonnées : " + xa + "," + xy;
}

async function loadMap() {
  await loadValue();
  map = new google.maps.Map(document.getElementById("main"), {
    center: { lat: xa, lng: xy },
    zoom: 8});
  marker = new google.maps.Marker({
    position: { lat: xa, lng: xy },
    map,
    title: "Ici"});
}

async function reloadMap(){
  await loadValue();
  marker.setMap(null);
  map.setCenter({lat: xa, lng: xy});
  marker = new google.maps.Marker({
    position: { lat: xa, lng: xy },
    map,
    title: "Ici"});
}

function changeScope{
  if(bypass){
    document.getElementById("changement").innerHTML = "France";
  }
  else{
    document.getElementById("changement").innerHTML = "Europe";
  }
  bypass = !bypass;
  reloadMap();
}
