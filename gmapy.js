/** 
 * Google Maps v3 API easy management
 * @author https://github.com/pepe84
 */
function Gmapy(map) {
    
    // Private
    var _geocoder,
        _lastMarker,
        _lastInfo;
    
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
            
            return new google.maps.Marker(opts);
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
        }
    };
}