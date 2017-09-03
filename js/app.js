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
        name : 'Library of Alexandria',
        lat : 31.208870 ,
        lng : 29.909201 ,    
        info : 'it was one of the largest and most significant libraries of the ancient world',
    },
    {
        name : 'Stanley_(neighborhood)',
        lat : 31.2350626 ,
        lng : 29.9507728 ,    
        info : 'it was one of the largest and most significant libraries of the ancient world',
    },
    {
        name : 'San Stifano',
        lat : 31.2457614 ,
        lng : 29.9761086 ,    
        info : 'it was one of the largest and most significant libraries of the ancient world',
    },
    
    
];
//inseart map



function gymLocation(value) {
  this.name = ko.observable(value.name);
  this.description = ko.observable(value.info);
  this.latlng = ko.observable(value.lat);
};


//

function ViewModel() {
    
    var self = this;
   
    
    
    
    
    self.marker = ko.observableArray([]);
    self.locations = ko.observableArray(locations);
    self.sortedLocations = ko.observableArray([]);
    self.query = ko.observable("");
    self.map = map;
    
    
    //
    
    //
    self.sortedLocations = ko.computed(function () {

        // Declearing the filter functions to filter text through words
        return ko.utils.arrayFilter(self.locations(), function (item) {

            // Check if search text is exicts or not
            if (item.name.toLowerCase().indexOf(self.query().toLowerCase()) !== -1) {

                // if it exists set the map view to the marker if not remove all markers
                if (item.m)
                    // item.marker.setVisible(true);
                    item.m.setVisible(true);
            } else {
                if (item.m)
                    // item.marker.setVisible(false);
                    item.m.setVisible(false);
            }
            return item.name.toLowerCase().indexOf(self.query().toLowerCase()) !== -1;
        });
    }, self);
    
    self.clickHandler = function (location) {
    

      var latlng = new google.maps.LatLng(location.lat, location.lng);
        var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      title: location.name
   });
  

            
      // Creating the content to be inserted in the infowindow
      var infoContent ='<div id="info_container">' +
            '<div class="info_title">' + location.name + '</div>' + '<br />' +'<div class="info_content">' + location.info + '</div></div>';
      
      
      infoWindow.setContent(infoContent);

      // opening the Info Window in the current map and at the current marker location.
      infoWindow.open(map, marker);

  

    };

    
    
    
  
    
    
    
    
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
    
    
  displayMarkers(locations);
};

// google.maps.event.addDomListener(window, 'load', initMap);





// This function will iterate over markersData array
// creating markers with createMarker function
function displayMarkers(locations){
   
     
   // this variable sets the map bounds and zoom level according to markers position
   var bounds = new google.maps.LatLngBounds();

   // For loop that runs through the info on markersData making it possible to createMarker function to create the markers
   for (var i = 0; i < locations.length; i++){
       
      var latlng = new google.maps.LatLng(locations[i].lat, locations[i].lng);
      var name = locations[i].name;
      var info = locations[i].info;
    
      createMarker(latlng, name, info, locations[i]);
      
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
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: latlng,
      title: name
   });
     marker.addListener('click', toggleBounce);
    function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      };
    
    
     var locationName =name;
        var wikiURL = 'https://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=' + locationName;
        var str = "";
        $.ajax({
            url: wikiURL,
            dataType: "jsonp",
            success: function (response) {
                var articleList = response[1];
                var locName = response[0];
                
                if (articleList.length > 0) {
                    for (var article in articleList) {
                        if (articleList.hasOwnProperty(article)) {
                            var element = articleList[article];
                            str = "<li><a href='https://en.wikipedia.org/wiki/" + element + "'>" + element + "</a></li>"
                        }
                    }
                } else {
                    str = "<li><a href='https://en.wikipedia.org/w/index.php?title=Special:Search&fulltext=1&search=" + locName.replace(' ', '+') + "'>" + locName + "</a></li>"
                }
                
                //console.log(str)
    //infowindow
    google.maps.event.addListener(marker, 'click', function() {
      
      // Creating the content to be inserted in the infowindow
      var infoContent ='<div id="info_container">' +
            '<div class="info_title">' + name + '</div>' + '<br />' +'<div class="info_content">' + info + '</div></div>' + str;
      
      
      infoWindow.setContent(infoContent);

      // opening the Info Window in the current map and at the current marker location.
      infoWindow.open(map, marker);
   });
}})
}
