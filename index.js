mapboxgl.accessToken = 'pk.eyJ1IjoiYXVzdGlucnMxNiIsImEiOiJja2hjcjAyYWwwMTIyMnVsNXc3ajUwMmk0In0.b8-Uodu2rXl9TvsX7vatSQ';


var map = new mapboxgl.Map({
  container: 'map', // HTML container id
  style: 'mapbox://styles/mapbox/dark-v10', // style URL
  center: [0, 0], // starting position as [lng, lat]
  zoom: 2, // starting zoom

});

//** team = "team_Name.png" (Hertha_BSC.png) | teamName = "team Name" (Hertha BSC) **\\
function addImages(team, teamName){
  map.loadImage('https://raw.githubusercontent.com/AustinRS016/soccerMap/master/signs/' + team, (error, image) => {
    if (error) throw error;
    console.log(image)
    map.addImage(teamName, image);
    map.addSource(team,{
             type: "geojson",
             data: "jsons/bundesliga.geojson",

         });
    map.addLayer({
       id: team, /* Unclustered Points*/
        type: "symbol",
        source: team,
        layout: {
          'icon-image': teamName,
          // 'icon-size': 0.04,
          'icon-size': [
            'step',
            ['zoom'],
            .04, //Default to this size
            9, //At this zoom decrease to...
            .06, //This size
            10, //At this zoom decrease to...
            .07 //This size
          ],
          // 'icon-allow-overlap': true,
          'icon-ignore-placement': true,
            },
        filter: ['==', 'Club', teamName],
      },
    "cluster"
  );


    //******************************************************//
    //            Clicking and Activating Popups
    //******************************************************//
    map.on('click', team, (e) => {
        const logo = "<p><img src='signs/" + team + "' alt='"+ teamName + " Logo' style='width:220px;'></p>"
        const coordinates = e.features[0].geometry.coordinates.slice();
        // const coordinates = e.features[0].geometry.coordinates[0][0].slice(); // for checking the point alignment
        const club = e.features[0].properties.Club;
        const player = e.features[0].properties.Player;
        const number = e.features[0].properties.Number;
        const position = e.features[0].properties.Position;
        const teamnation = e.features[0].properties['National Team'];
        const birthnation = e.features[0].properties.Birthplace;

        console.log(coordinates); //Checking Coordinates On Click

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML((logo+
            teamName+
            "<br><br><strong>" + player + "</strong>"+
            " #" + number +
            "<br><br>Position: " + position +
            "<p>National Team: " + teamnation +
            "</p>Birth Place: " + birthnation))
          .addTo(map);
        });

      map.on('mouseenter', team, () => {
          map.getCanvas().style.cursor = 'pointer';
        });

      map.on('mouseleave', team, () => {
          map.getCanvas().style.cursor = '';
        });
    //******************************************************//

    });
  }

map.on('load', function(){
  // Clustered Points //
  map.addSource("bundesliga",{
           type: "geojson",
           data: "jsons/bundesliga.geojson",
           cluster: true,
           clusterMaxZoom: 7,
           clusterRadius: 10
           });
  map.addLayer({
     id: "cluster",
      type: "circle",
      source: "bundesliga",
      filter: ['has', 'point_count'],
      paint: {
        'circle-blur': 1,
        'circle-color': 'red',
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              30,
              4,
              40,
              12,
              50
            ]
      }

      });
  map.addLayer({
         id: "clusterCount",
          type: "symbol",
          source: "bundesliga",
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
              },
          paint: {
            'text-halo-color': 'red',
            'text-color': 'white',
            'text-halo-width': 1,
          },
          filter: ['has','point_count']
          });
  // -----------------//
    d3.json("https://raw.githubusercontent.com/AustinRS016/soccerMap/master/Clubs.json", function(json) {
    var l = json['Club'].length
    var i = 0;
    for (i = 0; i < l; i++ ){
        var team = json['Club'][i]
        console.log(team)
        var teamName = team.replace(/_/g, ' ')
        teamName = teamName.substring(0, teamName.length -4);
        var img = teamName + 'Img'
        // console.log(teamName)
        addImages(team,teamName)
        }
      })


    })

// (logo+team+"<br><br><strong>" + player + "</strong>"+ "<br>" + number + position + "<p>National Team: " + teamnation + "</p>Birth Place: " + birthnation)
