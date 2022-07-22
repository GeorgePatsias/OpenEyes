$(document).ready(function () {
    window.initMap = initMap;

    $("#download-loader").hide();
});

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
    firstChild.classList.add("divLocation");
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.classList.add("divLocationInner");
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
            const data = locations[i];

            const lat = data['lat'];
            const lng = data['lng'];
            const city = data['city'];
            const stream = data['stream'];
            // let id = data['id'];
            const country = data['country'];
            const country_code = data['country_code'];
            const region = data['region'];
            const zip = data['zip'];
            const timezone = data['timezone'];
            const manufacturer = data['manufacturer'];            

            let latLng = new google.maps.LatLng(lat, lng);

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
                    const content = `
                    <table>
                        <tr>
                            <a target="_blank" href="${stream}">
                                <img src="${stream}" height='100%' width='100%'/>
                            </a>
                        </tr>
                        <tr>
                            <td class="title">Stream</td>
                            <td class="info"><a target="_blank" href="${stream}">${stream}</a></td>
                        </tr>
                        <tr>
                            <td class="title">Country</td>
                            <td class="info">${country}</td>
                        </tr>
                        <tr>
                            <td class="title">Coordinates</td>
                            <td class="info"><a target="_blank" href="https://www.google.com/maps/place/${lat},${lng}">${lat}, ${lng}</a></td>
                        </tr>
                        <tr>
                            <td class="title">Country code</td>
                            <td class="info">${country_code}</td>
                        </tr>
                        <tr>
                            <td class="title">Region</td>
                            <td class="info"class="info">${region}</td>
                        </tr>
                        <tr>
                            <td class="title">City</td>
                            <td class="info">${city}</td>
                        </tr>
                        <tr>
                            <td class="title">ZIP</td>
                            <td class="info">${zip}</td>
                        </tr>
                        <tr>
                            <td class="title">Timezone</td>
                            <td class="info">${timezone}</td>
                        </tr>
                        <tr>
                            <td class="title">Manufacturer</td>
                            <td class="info"><a target="_blank" href="https://www.google.com/search?q=${manufacturer}">${manufacturer}</a></td>
                        </tr>
                    </table>
                    `;

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

    addButtonUpdate(map);

    google.maps.event.addListener(map, 'click', function () {
        infowindow.close();
    });
}// InitMap


function addButtonUpdate(map) {
    let controlDiv = document.createElement('div');
    controlDiv.classList.add("btnUpdate");

    let firstChild = document.createElement('a');
    firstChild.innerHTML = 'Update <i class="fa-solid fa-video"></i>';
    controlDiv.appendChild(firstChild);

    firstChild.addEventListener('click', function () {
        $("#map").hide();
        $("#download-loader").show();
        window.location.replace("/scrape_cams");
    });

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);
}
