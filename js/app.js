//global variables
var map;
var google;
var infoWindow;
var marker = [];
 
//array of locations which will be in list and marker
var locations = [{
        name: 'citadel Of Qaitbay',
        lat: 31.214709,
        lng: 29.8833703,
        info: 'is a 15th-century defensive fortress located on the Mediterranean sea coast ',
    },
    {
        name: 'Montaza Palace',
        lat: 31.288497,
        lng: 30.01597,
        info: 's a palace and extensive gardens in the Montaza district of Alexandria',
    },
    {
        name: 'Library of Alexandria',
        lat: 31.208870,
        lng: 29.909201,
        info: 'it was one of the largest and most significant libraries of the ancient world',
    },
    {
        name: 'Stanley_(neighborhood)',
        lat: 31.2350626,
        lng: 29.9507728,
        info: 'is a 400 metre-long proudly standing Egyptian modern monument',
    },
    {
        name: 'San Stifano',
        lat: 31.2457614,
        lng: 29.9761086,
        info: 'it is a Shopping Mall and cinema',
    }
 
 
];
 
 
// tells the view model what to do when a change happens
 
 
 
 
//view model
 
function ViewModel() {
    //  variables of view model
    var self = this;
    self.marker = ko.observableArray([]);
    self.locations = ko.observableArray(locations);
    self.sortedLocations = ko.observableArray([]);
    self.query = ko.observable("");
    self.map = map;
 
    self.sortedLocations = ko.computed(function() {
 
        // Declare filter functions
        return ko.utils.arrayFilter(self.locations(), function(item) {
 
            // test if the text in search is exists or not exists
            if (item.name.toLowerCase().indexOf(self.query().toLowerCase()) !== -1) {
 
                // if it exists make view to the marker
 
                if (item.m)
 
                    item.m.setVisible(true); //if not remove all markers
            } else {
                if (item.m)
 
                    item.m.setVisible(false);
            }
            return item.name.toLowerCase().indexOf(self.query().toLowerCase()) !== -1;
        });
    }, self);
 
 
    
    self.clickHandler = function(location) {

        //create new markers at each location in the Locations array

        var latlng = new google.maps.LatLng(location.lat, location.lng);
        var info = location.info;

        locations.forEach(function(locc) {
            locc.m.setVisible(false);
        });
        location.m.setVisible(true);
        infoWindow.setContent(location.m.info);
        infoWindow.open(map, location.m);
        
        var animate = function(marker) {
 
                // Define the Bounce Animation
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 1400);
            };
        animate(location.m);
        


    };
}
 
 
 
 
ko.applyBindings(new ViewModel());
 
 
// insert a map from the Google maps api
 
function initMap() {
    var mapOption = {
        center: new google.maps.LatLng(31.205753, 29.924526),
        zoom: 11
 
    };
    map = new google.maps.Map(document.getElementById('map'), mapOption);
 
    //create info window to each item ia array
 
    infoWindow = new google.maps.InfoWindow();
 
    google.maps.event.addListener(map, 'click', function() {
        infoWindow.close();
    });
 
 
    displayMarkers(locations);
}
 
 
 
 
function displayMarkers(locations) {
 
 
    // this variable sets the map bounds and zoom level according to markers position
    var bounds = new google.maps.LatLngBounds();
 
    // For loop that runs through the info on marker
    for (var i = 0; i < locations.length; i++) {
 
        var latlng = new google.maps.LatLng(locations[i].lat, locations[i].lng);
        var name = locations[i].name;
        var info = locations[i].info;
 
        var marker = new google.maps.Marker({
            map: map,
            position: latlng,
            title: name,
            info: info,
            animation: google.maps.Animation.DROP,
 
        });
        locations[i].m = marker;
        
 
        // Marker’s Lat. and Lng. values are added to bounds variable
        bounds.extend(latlng);
    }
 
    // Finally the bounds variable is used to set the map bounds
    // with API’s fitBounds() function
    map.fitBounds(bounds);
}
 
//funcation to display info in infowindow and show it when marker is clicked
function showinfoWindow(marker) {
    //  display wikipedia api to info window
    var locationName = marker.title;
    var wikiURL = 'https://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=' + locationName;
    var str = "";
    $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        success: function(response) {
            var infoContent = "";
            var articleList = response[1];
            var locName = response[0];
            // console.log(articleList + '<br>' + locName);
            if (articleList.length > 0) {
                for (var article in articleList) {
                    if (articleList.hasOwnProperty(article)) {
                        var element = articleList[article];
                        str = "<li><a href='https://en.wikipedia.org/wiki/" + element + "'>" + element + "</a></li>";
                    }
                }
            } else {
                str = "<li><a href='https://en.wikipedia.org/w/index.php?title=Special:Search&fulltext=1&search=" + locName.replace(' ', '+') + "'>" + locName + "</a></li>";
            }
 
            // console.log(str);
            //make marker animate when it clicked
 
            var animate = function(marker) {
 
                // Define the Bounce Animation
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 1400);
            };
 
            marker.addListener('click', function() {
                // Creating the content to be inserted in the infowindow
                 infoContent = '<div id="info_container">' +
                    '<div class="info_title">' + marker.title + '</div>' + '<br />' + '<div class="info_content">' + marker.info + '</div></div>' + str;
 
                animate(marker);
                infoWindow.setContent(infoContent);
 
                // opening the Info Window in the current map and at the current marker location
                infoWindow.open(map, marker);
            });
 
 
            if (marker.flag == 'done') {
 
                //create the content of info window
                 infoContent = '<div id="info_container">' +
                    '<div class="info_title">' + marker.title + '</div>' + '<br />' + '<div class="info_content">' + marker.info + '</div></div>' + str;
 
                animate(marker);
                infoWindow.setContent(infoContent);
 
                // opening the Info Window in the current map and at the current marker location.
                infoWindow.open(map, marker);
            }
            marker.info = infoContent;
 
        },error:function(XHR, status, errore) {
            alert("error");
        }
    });
}
 
// show error message when the map is not load
function errorMesage() {
    alert("error happend when loading google map ");
}
