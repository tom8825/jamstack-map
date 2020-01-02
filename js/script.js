var map;

$(document).ready(function() {
  $("#tripadvisor-info, #menu-info, #disqus_thread, #reddit-info").css(
    "display",
    "none"
  );
});

$("#map-info-nav-item-comments").click(function() {
  $("#tripadvisor-info, #menu-info, #reddit-info").fadeOut(500, function() {
    $("#disqus_thread")
      .delay(500)
      .fadeIn();
  });
});

$("#map-info-nav-item-tripadvisor").click(function() {
  $("#disqus_thread, #menu-info, #reddit-info").fadeOut(500, function() {
    $("#tripadvisor-info")
      .delay(500)
      .fadeIn();
  });
});
$("#map-info-nav-item-menu").click(function() {
  $("#tripadvisor-info, #disqus_thread, #reddit-info").fadeOut(500, function() {
    $("#menu-info")
      .delay(500)
      .fadeIn();
  });
});
$("#map-info-nav-item-reddit").click(function() {
  $("#tripadvisor-info, #menu-info, #disqus_thread").fadeOut(500, function() {
    $("#reddit-info")
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

        $.getJSON(
          "https://www.reddit.com/r/WaltDisneyWorld/search.json?q=title:" +
            place.name +
            "&sort=new&restrict_sr=on&limit=5",
          function(result) {
            var data = result.data.children;
            if (result) {
              $("#reddit-info").html("");
              for (var i = 0; i < data.length; i++) {
                $("#reddit-info").append(
                  "<li class='reddit-list-item'><a href='" +
                    data[i].data.url +
                    "' target='_blank'>" +
                    data[i].data.title +
                    "</a></li></br>"
                );
                console.log(data[i].data.title);
              }
            } else {
              $("#reddit-info").html("");
              $("#reddit-info").append("Sorry folks, no results found!");
            }
          }
        );
      });
    }
  });
}
