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
                var hashTags = text.match(/\B#\w*[a-zæøåA-ZÆØÅ]+\w*/g);
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

        helpers.applyFilter = function (filter, markers, user, icons) {
            var hidden, markerDate;
            return markers.map(function (marker) {
                hidden = false;
                if (filter.mineOnly.enabled && user.id !== marker.userId) {
                    hidden = true;
                }
                if (!hidden && filter.team.enabled && filter.team.teams) {
                    filter.team.teams.forEach(function (team) {
                        if (!marker.sharedWithTeamIds || !(marker.sharedWithTeamIds.indexOf(team) > -1)) {
                            hidden = true;
                        }
                    });
                }
                if (!hidden && filter.tag.enabled && filter.tag.tags) {
                    filter.tag.tags.forEach(function (tag) {
                        var iconTags = icons[marker.icon].tags || [];
                        var customTags = helpers.extractTags(marker.description);
                        if (iconTags.indexOf(tag) < 0 && customTags.indexOf(tag) < 0) {
                            hidden = true;
                        }
                    });
                }
                markerDate = new Date(marker.dateTime);
                if (!hidden && filter.fromDate.enabled && new Date(filter.fromDate.date) > markerDate) {
                    hidden = true;
                }
                if (!hidden && filter.toDate.enabled && new Date(filter.toDate.date) < markerDate) {
                    hidden = true;
                }

                marker.hidden = hidden;
                return marker;
            });
        }

        return helpers;
    });