//global variables
var map ;
var google ;
var infoWindow;
var marker = [];


var locations = [
    {
        name : 'citadel Of Qaitbay',
        lat : 31.214709 ,
        lng : 29.8833703 ,    
        info : 'is a 15th-century defensive fortress located on the Mediterranean sea coast ',
    },
    {
        name : 'Montaza Palace',
        lat : 31.288497 ,
        lng : 30.01597 ,    
        info :'s a palace and extensive gardens in the Montaza district of Alexandria',
    },
    {
        name : 'Alexandria Library',
        lat : 31.208870 ,
        lng : 29.909201 ,    
        info : 'it was one of the largest and most significant libraries of the ancient world',
    },
    
    
];

function gymLocation(value) {
  this.name = ko.observable(value.name);
  this.description = ko.observable(value.info);
  this.latlng = ko.observable(value.lat);
};

function ViewModel() {
    
    var self = this;
    self.query = ko.observable("");
    self.locationList = ko.observableArray([]);
    self.sortedLocations =ko.observableArray(locations);
    // filter with knockout.js
    
   
    
    
    
    
 //end filter     
}



    ko.applyBindings(new ViewModel());





function initMap() {
       var mapOption = {
         center: new google.maps.LatLng(31.205753,29.924526),
         zoom: 11
         
}
  map = new google.maps.Map(document.getElementById('map'), mapOption); 
    
  infoWindow = new google.maps.InfoWindow();
    
    google.maps.event.addListener(map, 'click', function() {
      infoWindow.close();
   });
    
    
  displayMarkers();
};

google.maps.event.addDomListener(window, 'load', initMap);





// This function will iterate over markersData array
// creating markers with createMarker function
function displayMarkers(){

   // this variable sets the map bounds and zoom level according to markers position
   var bounds = new google.maps.LatLngBounds();

   // For loop that runs through the info on markersData making it possible to createMarker function to create the markers
   for (var i = 0; i < locations.length; i++){

      var latlng = new google.maps.LatLng(locations[i].lat, locations[i].lng);
      var name = locations[i].name;
      var info = locations[i].info;

      createMarker(latlng, name, info);

      // Marker’s Lat. and Lng. values are added to bounds variable
      bounds.extend(latlng); 
   }

   // Finally the bounds variable is used to set the map bounds
   // with API’s fitBounds() function
   map.fitBounds(bounds);
}

// This function creates each marker and it sets their Info Window content
function createMarker(latlng, name, info){
   var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      title: name
   });
    
    //infowindow
    google.maps.event.addListener(marker, 'click', function() {
      
      // Creating the content to be inserted in the infowindow
      var infoContent ='<div id="info_container">' +
            '<div class="info_title">' + name + '</div>' + '<br />' +'<div class="info_content">' + info + '</div></div>';
      
      
      infoWindow.setContent(infoContent);

      // opening the Info Window in the current map and at the current marker location.
      infoWindow.open(map, marker);
   });
}


  
