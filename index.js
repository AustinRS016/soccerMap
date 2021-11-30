
mapboxgl.accessToken = 'pk.eyJ1IjoiYXVzdGlucnMxNiIsImEiOiJja2hjcjAyYWwwMTIyMnVsNXc3ajUwMmk0In0.b8-Uodu2rXl9TvsX7vatSQ';


var map = new mapboxgl.Map({
  container: 'map', // HTML container id
  style: 'mapbox://styles/mapbox/dark-v10?optimize=true', // style URL
  center: [0, 0], // starting position as [lng, lat]
  zoom: 2, // starting zoom

});


//*********************************************************************************************//
//            Function to create symbol layer and add icon image for each team- begin          //
//*********************************************************************************************//

    //** team = "team_Name.png" (Hertha_BSC.png) | teamName = "team Name" (Hertha BSC) **\\
function addImages(team, teamName){
  map.loadImage('https://raw.githubusercontent.com/AustinRS016/soccerMap/master/signs/' + team, (error, image) => {
    if (error) throw error;
    map.addImage(teamName, image);
    map.addSource(team,{
             type: "geojson",
             data: "jsons/bundesliga.geojson",

         });
    map.addLayer({
       id: team,
        type: "symbol",
        source: team,
        layout: {
          'icon-image': teamName,
          'icon-ignore-placement': true,
            },
        filter: ['==', 'Club', teamName],
      },
    "cluster"
  );


    //******************************************************//
    //            Clicking and Activating Popups- begin
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
    //            Clicking and Activating Popups- end
    //*****************************************************//
    });
  }
//*********************************************************************************************//
//            Function to create symbol layer and add icon image for each team- end            //
//*********************************************************************************************//

map.on('load', function(){

// Clustered Points- begin //
  map.addSource("bundesliga",{
           type: "geojson",
           data: "jsons/bundesliga.geojson",
           cluster: true,
           clusterMaxZoom: 7,
           clusterRadius: 10,
           buffer: 0,
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
// Clustered Points - end //

  //*********************************************************************************************//
  // Use D3 to get json file (key for clubs)//
  //     Iterate over each key
  //     formate variable names
  //     use addImages function
    d3.json("https://raw.githubusercontent.com/AustinRS016/soccerMap/master/Clubs.json", function(json) {
    var l = json['Club'].length
    var i = 0;
    for (i = 0; i < l; i++ ){
        var team = json['Club'][i]
        var teamName = team.replace(/_/g, ' ')
        teamName = teamName.substring(0, teamName.length -4);
        var img = teamName + 'Img'
        // console.log(teamName)
        addImages(team,teamName)
        }
      })
    //*************************************//
    //         End of D3                   //
    //*************************************//
    })


async function forwardGeocoder(query){
    const matchingFeatures = [];
    const customData = await getGeojson();
    for (const feature of customData.features) {
      if (
        feature.properties.Player
          .toLowerCase()
          .includes(query.toLowerCase())
      ){
        feature['place_name'] = feature.properties.Player;
        feature['center'] = feature.geometry.coordinates;
        feature['place_type'] = ['place'];
        matchingFeatures.push(feature);
      }
      // console.log(matchingFeatures)
    }
  return matchingFeatures;
}

async function getGeojson()  {
  const res = await fetch ("https://raw.githubusercontent.com/AustinRS016/soccerMap/master/jsons/bundesliga.geojson");
  const customData = await res.json();
  return(customData)
}

function dummy(){
}

//*******************************************//
//    Create localGeocoder Function- end     //
//*******************************************//
// Add Geocoder Control to map  //
  map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      localGeocoderOnly: true,
      localGeocoder: dummy,
      externalGeocoder: forwardGeocoder,
      zoom: 14,
      placeholder: 'Search for a Player',
      mapboxgl: mapboxgl
    })
  );
