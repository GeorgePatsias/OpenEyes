// Normalize overlapping markers
function correctPosition(lat, lng) {
    const min = 1;
    const max = 500;

    let random_number = Math.floor(Math.random() * (max - min + 1) + min);

    random_number = "0.000" + random_number.toString();
    random_number = parseFloat(random_number);

    return new google.maps.LatLng(lat + random_number, lng + random_number)
}

function addLocationButton(map) {
    var controlDiv = document.createElement('div');

    var firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '40px';
    firstChild.style.height = '40px';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(/static/img/location.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0 0';
    secondChild.style.backgroundRepeat = 'no-repeat';
    firstChild.appendChild(secondChild);

    google.maps.event.addListener(map, 'center_changed', function () {
        secondChild.style['background-position'] = '0 0';
    });

    firstChild.addEventListener('click', function () {
        var imgX = '0',
            animationInterval = setInterval(function () {
                imgX = imgX === '-18' ? '0' : '-18';
                secondChild.style['background-position'] = imgX + 'px 0';
            }, 500);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(latlng);
                clearInterval(animationInterval);
                secondChild.style['background-position'] = '-144px 0';
            });
        } else {
            clearInterval(animationInterval);
            secondChild.style['background-position'] = '0 0';
        }
    });

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}

function initMap() {
    $("#map").hide();

    // Init map
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: new google.maps.LatLng(45.543, 25.910),
        panControl: true,
        zoomControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var markers = []
    $.getJSON("/get_cams", function (locations) {
        for (let i = 0; i < locations.length; i++) {
            let lat = locations[i]['lat'];
            let lng = locations[i]['lng'];

            if (!lat || !lng) {
                continue;
            }

            let city = locations[i]['city'];
            let stream = locations[i]['stream'];
            let id = locations[i]['id'];
            let country = locations[i]['country'];
            let country_code = locations[i]['country_code'];
            let region = locations[i]['region'];
            let zip = locations[i]['zip'];
            let timezone = locations[i]['timezone'];
            let manufacturer = locations[i]['manufacturer'];

            var latLng = new google.maps.LatLng(lat, lng);

            // Correct position if marker has exact position with another one.
            if (markers.length != 0) {
                for (let y = 0; y < markers.length; y++) {
                    if (markers[y].getPosition().equals(latLng)) {
                        latLng = correctPosition(lat, lng);
                    }
                }
            }

            // Create marker
            let marker = new google.maps.Marker({
                position: latLng,
                map: map,
                url: stream
            });

            // Marker click listener
            google.maps.event.addListener(marker, "click", (function (marker) {
                return function () {
                    let content = `
                    <a target="_blank" href="${stream}"><img src="${stream}" height='100%' width='100%'/></a>
                    <br/>
                    <div style="overflow-x:auto;">
                    <table>
                    <tr>
                        <td>Stream</td>
                        <td><a target="_blank" href="${stream}">${stream}</a></td>
                    </tr>
                    <tr>
                        <td>Country</td>
                        <td>${country}</td>
                    </tr>
                    <tr>
                        <td>Country code</td>
                        <td>${country_code}</td>
                    </tr>
                    <tr>
                        <td>Region</td>
                        <td>${region}</td>
                    </tr>
                    <tr>
                        <td>City</td>
                        <td>${city}</td>
                    </tr>
                    <tr>
                        <td>ZIP</td>
                        <td>${zip}</td>
                    </tr>
                    <tr>
                        <td>Timezone</td>
                        <td>${timezone}</td>
                    </tr>
                    <tr>
                        <td>Manufacturer</td>
                        <td>${manufacturer}</td>
                    </tr>
                    </table>
                    </div>
                    `
                    infowindow.setContent(content);


                    infowindow.open(map, marker);
                }
            })(marker));

            markers.push(marker);
        }
        $("#loader").hide();
        $("#map").show();
    });
    addLocationButton(map);

    addButton(map);

    google.maps.event.addListener(map, 'click', function () {
        infowindow.close();
    });
}// InitMap


function addButton(map) {
    let controlDiv = document.createElement('div');

    let firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.boxShadow = 'rgb(0 0 0 / 30%) 0px 1px 4px -1px;';
    firstChild.style.color = 'rgb(102 102 102)';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '115px';
    firstChild.style.height = '40px';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.margin = '5px';
    firstChild.classList.add("fa");
    firstChild.innerHTML = 'Update \&#xf03d';
    firstChild.title = 'Fetch new Cameras';
    controlDiv.appendChild(firstChild);

    firstChild.addEventListener('click', function () {
        $("#map").hide();
        $("#loader").show();
        window.location.replace("/scrape_cams");
    });

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);
}