var map;

// Initialize google map
function initMap() 
{
  map = new google.maps.Map(document.getElementById('map'), {
    zoom      : 2,
    center    : new google.maps.LatLng(36.3932, 25.4615),
    mapTypeId : 'terrain'
  });

  // Create a <script> tag to access the earthquake data in the js file
  var script = document.createElement('script');
  script.src = 'assets/data/damage.js';
  document.getElementsByTagName('head')[0].appendChild(script);
}

var dataPoints = [];
var pinColors  = [];
var popUpText  = [];

// Loop through the results array obtained from accessing the earthquake.js file and place a marker for each data point
window.eqfeed_callback = function(results) 
{
  for (var i = 0; i < results.features.length; i++) 
  {
    var latLng = new google.maps.LatLng(results.features[i].LATITUDE, results.features[i].LONGITUDE);
    popUpText[i]     = "<span> <b> Country: </b>"      + results.features[i].COUNTRY + 
                       "<br/> <b> Year: </b>"   + results.features[i].YEAR + 
                       "<br/> <b> Damage: </b>$" + results.features[i].DAMAGE + " M</span>";

    if (results.features[i].DAMAGE < 1000)
    {
      pinColors[i]='FA8072';
    }
    else if ((results.features[i].DAMAGE > 1000) && (results.features[i].DAMAGE < 30000))
    {
      pinColors[i]='DC143C';
    }
    else 
    {
      pinColors[i]='8B0000';
    }
      
    var tmp = {
      'lat' : results.features[i].LATITUDE,
      'lng' : results.features[i].LONGITUDE
    };

    dataPoints.push(tmp);
  }//for

  var markers = dataPoints.map(function(location, i) 
  {
    var mark  = new google.maps.Marker({
        position : location,            
        icon     : new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColors[i]),
        text     : popUpText[i]
    });

    var infowindow = new google.maps.InfoWindow({
        content  : mark.text
    });


    mark.addListener('mouseout', function() 
    {
      if (infowindow) 
      {
       infowindow.close();
      }
    });
    
    mark.addListener('mouseover', function() 
    {
      infowindow.open(map, mark);
    });

    return mark;
  });


  var markerCluster = new MarkerClusterer(map, 
                                          markers,
                                          {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
                                         );
}//eqfeed_callback