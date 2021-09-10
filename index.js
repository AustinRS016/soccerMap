mapboxgl.accessToken = 'pk.eyJ1IjoiYXVzdGlucnMxNiIsImEiOiJja2hjcjAyYWwwMTIyMnVsNXc3ajUwMmk0In0.b8-Uodu2rXl9TvsX7vatSQ';


var map = new mapboxgl.Map({
  container: 'map', // HTML container id
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [0, 0], // starting position as [lng, lat]
  zoom: 2, // starting zoom
});


map.on('load', function(){


map.addSource('bundesliga',{
       "type": "geojson",
       "data": "jsons/bundesliga.geojson"
   });


d3.json("https://raw.githubusercontent.com/AustinRS016/soccerMap/master/Clubs.json", function(json) {
  console.log(json)

  l = json.length



})
  // map.addLayer({
  //    "id":"bundesliga",
  //    "type":"circle",
  //    "source":"bundesliga",
  //    "layout": {
  //      'visibility':'none'
  //    },
  //    "paint": {
  //     'circle-color': 'red',
  //     'circle-radius': 10
  //
  //
  //   },
  //
  //  });

d3.json("jsons/bundesliga.geojson", function(json) {

  // console.log(json.length)
  var data = json.features
  console.log(data)

  for (let i = 0; i < data.length; i++) {
    const el = document.createElement('div');
    el.classname = 'marker';

    el.style.backgroundImage = 'url(Logos/' + data[i].properties.Club.replace(" ","_") + '.png)'
    el.style.width= '80px'
    el.style.height= '80px'
    // el.style.width = 'auto'
    // el.style.height = 'auto'
    el.style.backgroundSize = '100%'
    new mapboxgl.Marker(el)
      .setLngLat(data[i].geometry.coordinates)
      .addTo(map);
    // console.log(data[i].properties.Club.replace(" ","_"))
    // console.log(data[i].geometry.coordinates[0])
    // console.log(data[i].geometry.coordinates[1])

  }


})

map.on('mousemove', 'bundesliga', (e) => {
  map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'bundesliga', (e) => {
  map.getCanvas().style.cursor = ''
});
map.on('click', 'bundesliga', function(e){
  window.open('https://www.lemonparty.org', '_blank').focus();
});

    });
