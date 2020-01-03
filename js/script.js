var map;

$(document).ready(function() {
  $(
    "#tripadvisor-info, #menu-info, #disqus_thread, #reddit-info, #poi-info"
  ).css("display", "none");
});

$("#map-info-nav-item-comments").click(function() {
  $("#tripadvisor-info, #menu-info, #reddit-info, #poi-info").fadeOut(
    500,
    function() {
      $("#disqus_thread")
        .delay(500)
        .fadeIn();
    }
  );
});

$("#map-info-nav-item-tripadvisor").click(function() {
  $("#disqus_thread, #menu-info, #reddit-info, #poi-info").fadeOut(
    500,
    function() {
      $("#tripadvisor-info")
        .delay(500)
        .fadeIn();
    }
  );
});
$("#map-info-nav-item-info").click(function() {
  $("#tripadvisor-info, #disqus_thread, #reddit-info, #menu-info").fadeOut(
    500,
    function() {
      $("#poi-info")
        .delay(500)
        .fadeIn();
    }
  );
});
$("#map-info-nav-item-reddit").click(function() {
  $("#tripadvisor-info, #menu-info, #disqus_thread, #poi-info").fadeOut(
    500,
    function() {
      $("#reddit-info")
        .delay(500)
        .fadeIn();
    }
  );
});
let menu_link = "";
$("#map-info-nav-item-menu").click(function() {
  window.open(
    "https://disneyworld.disney.go.com/en_GB/dining/magic-kingdom/" + menu_link,
    "_blank"
  );
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
    menu_link = "";
    if (event.placeId) {
      event.stop();
      placesService.getDetails({ placeId: event.placeId }, function(
        place,
        status
      ) {
        console.log(place);
        $("#poi-info").html("");
        for (var i = 0; i < place.reviews.length; i++) {
          $("#poi-info").append(
            "<div class='collapsible'><div id='collapsible-rating-" +
              i +
              "'></div><div class='collapsible-info'>" +
              place.reviews[i].author_name +
              ": <span>" +
              place.reviews[i].relative_time_description +
              "</span></div></div><div class='content'><p>" +
              place.reviews[i].text +
              "</p></div>"
          );
          for (var k = 0; k < place.reviews[i].rating; k++) {
            $("#collapsible-rating-" + i).append(
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#f0e40a" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>'
            );
          }
        }
        info_dropdown();
        $("#map-info-nav-item-info").css({
          "border-color": "lightblue"
        });
        $("#map-info-nav-item-info svg path").css("fill", "lightblue");
        $("#map-info-title").text(place.name);
        $("#map-info-images").html(
          '<img src="' + place.photos[1].getUrl() + '">'
        );
        $("#map-info-nav").html();
        if (
          place.types.includes("food") ||
          place.types.includes("restaurant")
        ) {
          $.getJSON("json/mk_dining.json", function(result) {
            let found = false;
            for (var i = 0; i < result.length; i++) {
              if (result[i].name === place.name) {
                console.log(result[i].name, place.name, result[i].permalink);
                menu_link = result[i].permalink + "/menus/";
                $("#map-info-nav-item-menu").css({
                  "border-color": "lightgreen",
                  "pointer-events": "all"
                });
                $("#map-info-nav-item-menu svg path").css("fill", "lightgreen");
                found = true;
                break;
              }
            }
            if (!found) {
              console.log("not found");
              menu_link = "#/search=" + place.name + "/sort=relevance/";
              $("#map-info-nav-item-menu").css({
                "border-color": "orange",
                "pointer-events": "all"
              });
              $("#map-info-nav-item-menu svg path").css("fill", "orange");
            }
          });
        } else {
          menu_link = "";
          $("#map-info-nav-item-menu").css({
            "border-color": "grey",
            "pointer-events": "none"
          });
          $("#map-info-nav-item-menu svg path").css("fill", "grey");
        }
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
                $("#map-info-nav-item-reddit").css({
                  "border-color": "#F05236",
                  "pointer-events": "all"
                });
                $("#map-info-nav-item-reddit svg path").css("fill", "#F05236");
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

function info_dropdown() {
  //info collabsible list
  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
    console.log("test");
  }
}
