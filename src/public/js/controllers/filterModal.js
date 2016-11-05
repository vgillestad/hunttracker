/* global angular, Modernizr */
angular.module("HTControllers")

    .controller("FilterModalCtrl", ["$scope", "$uibModalInstance", "user", "markers", "teams", "filter", "Helpers", "IconSource", function ($scope, $modalInstance, user, markers, teams, filter, Helpers, IconSource) {
        $scope.user = user;
        $scope.teams = teams;
        $scope.icons = IconSource.getAll();
        $scope.filter = filter || {
            mineOnly: { enabled: false },
            team: { enabled: false,  teams: [] },
            tag: { enabled: false, tags: [] },
            fromDate: { enabled: false, date: new Date() },
            toDate: { enabled: false,  date: new Date() } ,
        };
        
        $scope.actionTags = []; $scope.animalTags = []; $scope.otherTags = []; $scope.customTags = [];
        markers.forEach(function (marker) {
            //IconTags
            var iconTags = $scope.icons[marker.icon].tags;
            if (iconTags) {
                var firstTag = iconTags[0];
                if (firstTag === "shot" || firstTag === "seen") {
                    if ($scope.actionTags.indexOf(firstTag) < 0) {
                        $scope.actionTags.push(firstTag);
                    }
                    var animalTag = iconTags[1];
                    if ($scope.animalTags.indexOf(animalTag) < 0) {
                        $scope.animalTags.push(animalTag);
                    }
                }
                else {
                    iconTags.forEach(function (tag) {
                        if ($scope.otherTags.indexOf(tag) < 0) {
                            $scope.otherTags.push(tag);
                        }
                    })
                }
            }
            //CustomTags
            Helpers.extractTags(marker.description).forEach(function (tag) {
                if ($scope.customTags.indexOf(tag) < 0) {
                    $scope.customTags.push(tag);
                }
            });
        });
        $scope.removedTags = $scope.filter.tag.tags.filter(function (tag) {
            return $scope.filter.tag.tags[tag] && $scope.actionTags.indexOf(tag) < 0 && $scope.animalTags.indexOf(tag) < 0 && $scope.otherTags.indexOf(tag) < 0 && $scope.customTags.indexOf(tag);
        });

        $scope.toggleTeam = function (team) {
            var index = $scope.filter.team.teams.indexOf(team);
            index < 0 ? $scope.filter.team.teams.push(team) : $scope.filter.team.teams.splice(index, 1);
        }
        
        $scope.toggleTag = function (tag) {
            var index = $scope.filter.tag.tags.indexOf(tag);
            index < 0 ? $scope.filter.tag.tags.push(tag) : $scope.filter.tag.tags.splice(index, 1);
        }

        $scope.save = function () {
            $modalInstance.close({ filter: $scope.filter });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss("cancel");
        };
    }]);