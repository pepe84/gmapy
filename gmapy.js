/** 
 * Google Maps v3 API easy management
 * @author https://github.com/pepe84
 */
function Gmapy(map) {
    // Private
    var _geocoder,
        _markers = [],
        _lastMarker,
        _lastInfo;
    
    function _setMarkersMap(map) {
        if (_markers.length) {
            for (var i in _markers) {
                if (_markers[i].setMap) {
                    _markers[i].setMap(map);
                }
            }
        }
    }
    
    // Public
    return {
        addMarker: function (text, lat, lng, icon) {
            var opts = {
              map: map,
              position: new google.maps.LatLng(lat, lng),
              title: text
            };
            if (icon) {
                opts.icon = icon;
            }
            var marker = new google.maps.Marker(opts);
            
            // Maintain markers list
            _markers.push(marker);
            
            return marker;
        },
        addInfoWindow: function (text, marker, callback) {
            var info = new google.maps.InfoWindow({
                content: text
            });
            google.maps.event.addListener(marker, 'click', function() {
                info.open(map, marker);
                if (_lastMarker && callback) {
                    callback(_lastMarker, _lastInfo);
                }
                _lastMarker = marker;
                _lastInfo = info;
            });
            
            return info;
        },
        getCoordsByAddress: function (address, callback) {
            if (!_geocoder) {
                _geocoder = new google.maps.Geocoder();
            }
            if (_geocoder) {
                _geocoder.geocode({address: address}, function(result, status) {
                    if (result &&
                        result[0] &&
                        result[0].geometry && 
                        result[0].geometry.location) {
                        var x = result[0].geometry.location.lat();
                        var y = result[0].geometry.location.lng();
                        callback(x, y);
                    }
                });
            }
        },
        clearOverlays: function () {
            // Removes the overlays from the map, but keeps them in the array
            _setMarkersMap(null);
        },
        showOverlays: function () {
            // Shows any overlays currently in the array
            _setMarkersMap(map);
        },
        deleteOverlays: function () {
            // Deletes all markers in the array by removing references to them
            this.clearOverlays();
            _markers = [];
        }
    };
}