var map;

$(document).ready(function() {
  $("#tripadvisor-info, #menu-info, #disqus_thread").fadeOut(500);
});

$("#map-info-nav-item-comments").click(function() {
  $("#tripadvisor-info, #menu-info").fadeOut(500, function() {
    $("#disqus_thread")
      .delay(500)
      .fadeIn();
  });
});

$("#map-info-nav-item-tripadvisor").click(function() {
  $("#disqus_thread, #menu-info").fadeOut(500, function() {
    $("#tripadvisor-info")
      .delay(500)
      .fadeIn();
  });
});
$("#map-info-nav-item-menu").click(function() {
  $("#tripadvisor-info, #disqus_thread").fadeOut(500, function() {
    $("#menu-info")
      .delay(500)
      .fadeIn();
  });
});
$("#map-info-nav-item-wait-time").click(function() {
  CheckWaitTimes();
});

function initMap() {
  map = new google.maps.Map(document.getElementById("map-content"), {
    center: { lat: 28.4177, lng: -81.5812 },
    zoom: 19,
    mapTypeId: "hybrid",
    tilt: 60
  });

  var placesService = new google.maps.places.PlacesService(map);

  map.addListener("click", function(event) {
    if (event.placeId) {
      event.stop();
      placesService.getDetails({ placeId: event.placeId }, function(
        place,
        status
      ) {
        $("#map-info-title").text(place.name);
        $("#map-info-images").html(
          '<img src="' + place.photos[1].getUrl() + '">'
        );
        $("#map-info-nav").html();
      });
    }
  });
}

const Themeparks = require("themeparks");

const DisneyWorldMagicKingdom = new Themeparks.Parks.WaltDisneyWorldMagicKingdom();

const CheckWaitTimes = () => {
  DisneyWorldMagicKingdom.GetWaitTimes()
    .then(rideTimes => {
      rideTimes.forEach(ride => {
        console.log(
          `${ride.name}: ${ride.waitTime} minutes wait (${ride.status})`
        );
      });
    })
    .catch(error => {
      console.error(error);
    })
    .then(() => {
      setTimeout(CheckWaitTimes, 500 * 60 * 5); // refresh every 5 minutes
    });
};
