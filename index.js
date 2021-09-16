mapboxgl.accessToken = 'pk.eyJ1IjoiYXVzdGlucnMxNiIsImEiOiJja2hjcjAyYWwwMTIyMnVsNXc3ajUwMmk0In0.b8-Uodu2rXl9TvsX7vatSQ';


var map = new mapboxgl.Map({
  container: 'map', // HTML container id
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [0, 0], // starting position as [lng, lat]
  zoom: 2, // starting zoom
});


function addImages(team, teamName){
  map.loadImage('https://raw.githubusercontent.com/AustinRS016/soccerMap/master/Logos/' + team, (error, image) => {
    if (error) throw error;
    console.log(image)
    map.addImage(teamName, image);
    map.addSource(team,{
             "type": "geojson",
             "data": "jsons/bundesliga.geojson"
         });
    map.addLayer({
       "id":team,
        "type":"symbol",
        "source":team,
        "layout": {
          'icon-image': teamName,
          'icon-size': 0.01,
            },
        "filter": ['==', 'Club', teamName]
        });
});
}


map.on('load', function(){

d3.json("https://raw.githubusercontent.com/AustinRS016/soccerMap/master/Clubs.json", function(json) {

var l = json['Club'].length
var i = 0;

for (i = 0; i < l; i++ ){
  var team = json['Club'][i]
  // console.log(team)
  var teamName = team.replace(/_/g, ' ')
  teamName = teamName.substring(0, teamName.length -4);
  var img = teamName + 'Img'
  // console.log(teamName)
  addImages(team,teamName)
}
})
})



// map.on('load', function(){
//
//       d3.json("https://raw.githubusercontent.com/AustinRS016/soccerMap/master/Clubs.json", function(json) {
//
//       var l = json['Club'].length
//       var i = 0;
//
//         for (i = 0; i < l; i++ ){
//           var team = json['Club'][i]
//           console.log(team)
//           var teamName = team.replace(/_/g, ' ')
//           teamName = teamName.substring(0, teamName.length -4);
//           var img = teamName + 'Img'
//           console.log(teamName)
//
//           map.loadImage('https://raw.githubusercontent.com/AustinRS016/soccerMap/master/Logos/' + team, (error, image) => {
//               if (error) throw error;
//               console.log(image)
//               map.addImage(teamName, image);
//               map.addSource(team,{
//                        "type": "geojson",
//                        "data": "jsons/bundesliga.geojson"
//                    });
//               map.addLayer({
//                  "id":team,
//                   "type":"symbol",
//                   "source":teamName,
//                   "layout": {
//                     'icon-image': 'custom',
//                     'icon-size': 0.01,
//                       },
//                   "filter": ['==', 'Club', teamName]
//                   });
//
//           });
//         }
//       })
//
//
// map.on('mousemove', 'bundesliga', (e) => {
//   map.getCanvas().style.cursor = 'pointer';
// });
// map.on('mouseleave', 'bundesliga', (e) => {
//   map.getCanvas().style.cursor = ''
// });
// map.on('click', 'bundesliga', function(e){
//   window.open('https://www.lemonparty.org', '_blank').focus();
// });
//
//     });
