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
        filters["date"] = function (markers, date, operator) {
            var d = new Date();
            d.setDate(d.getDate() - date);
            return markers.map(function (marker) {
                marker.hidden = new Date(marker.dateTime) > d;
                return marker;
            });
        }
        
        return {
            getAll: function () {
                return filters;
            }
        };
    });