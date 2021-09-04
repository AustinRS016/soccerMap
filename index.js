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
  map.addLayer({
     "id":"bundesliga",
     "type":"circle",
     "source":"bundesliga",
     "layout": {'visibility': 'visible'},
     "paint": {
      'circle-color': 'red',
      'circle-radius': 10


    },

   });


    });
map.on('mousemove', 'bundesliga', (e) => {
  map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'bundesliga', (e) => {
  map.getCanvas().style.cursor = ''
});
map.on('click', 'bundesliga', function(e){
  window.open('https://www.lemonparty.org', '_blank').focus();
})
