angular.module('HTServices')
    .factory('Helpers', function () {
        var helpers = {};

        helpers.filterByTags = function (items, tags, comparison) { //comparison = 'all', 'one', 'none'
            comparison = comparison || 'all';
            var filtered = {};
            Object.keys(items).forEach(function (key) {
                var item = items[key];
                var hits = 0;
                for (var i = 0; i < tags.length; i++) {
                    if (item.tags && item.tags.indexOf(tags[i]) > -1) {
                        hits++;
                    };
                }
                if ((comparison === 'all' && tags.length === hits) ||
                    (comparison === 'one' && hits > 0) ||
                    (comparison === 'none' && hits === 0)) {
                    filtered[key] = item;
                }
            });
            return filtered;
        }

        helpers.extractTags = function (text) {
            if (text) {
                var hashTags = text.match(/\B#\w*[a-zA-Z]+\w*/g);
                if (hashTags) {
                    return hashTags.map(function (hashTag) {
                        return hashTag.replace("#", "");
                    });
                }
            }
            return [];
        }
        
        helpers.mapIcons = function (markers, icons) {
            if (!markers || markers.length < 1) return markers;
            return markers.map(function (marker) {
                marker.iconSrc = icons[marker.icon] || icons["default"];
                return marker;
            });
        }

        return helpers;
    });