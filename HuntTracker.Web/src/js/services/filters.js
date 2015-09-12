angular.module('HTServices')

    .factory('FilterSource', function () {

        var filters = {};
        filters["all"] = function (markers) {
            return markers.map(function (marker) {
                marker.hidden = false;
                return marker;
            })
        }
        filters["none"] = function (markers) {
            var all = markers.map(function (marker) {
                marker.hidden = true;
                return marker;
            });
            return all;
        }
        filters["date"] = function (markers, days, operator) {
            var oneDayInMS = 86400000;
            var now = new Date();
            var filterDateInMS = now.getTime() - (days * oneDayInMS); 
            return markers.map(function (marker) {
                var markerDate = new Date(marker.dateTime); 
                marker.hidden = markerDate.getTime() < filterDateInMS;
                return marker;
            });
        }
        
        return {
            getAll: function () {
                return filters;
            }
        };
    });