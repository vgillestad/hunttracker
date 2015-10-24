/* global angular, Modernizr */
angular.module("HTControllers")

    .controller("MarkerOtherModalCtrl", ["$scope", "$uibModalInstance", "marker", "icons", "teams", "UserSource", "Helpers", "UserSource", function ($scope, $modalInstance, marker, icons, teams, UserSource, helpers, UserSource) {
        $scope.marker = marker;
        $scope.marker.sharedWithTeamIds = $scope.marker.sharedWithTeamIds || [];

        $scope.addedBy = UserSource.getById({ id: $scope.marker.userId });
        $scope.sharedWithTeams = $scope.marker.sharedWithTeamIds.map(function (teamId) {
            var t = teams.filter(function (team) {
                return team.id === teamId;
            });
            return t.length > 0 ? t[0] : ""; //Only teams visible to you will be displayed
        });
        $scope.descriptionTags = helpers.extractTags($scope.marker.description);
        $scope.formattedDateTime = moment($scope.marker.dateTime).format("LLLL");
        $scope.icon = icons[$scope.marker.icon];

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }]);