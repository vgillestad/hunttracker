/* global angular, Modernizr */
angular.module("HTControllers")

    .controller("MarkerMineModalCtrl", ["$scope", "$modalInstance", "Helpers", "marker", "icons", "position", "teams", function ($scope, $modalInstance, helpers, marker, icons, position, teams) {
        $scope.marker = marker;
        $scope.marker.sharedWithTeamIds = $scope.marker.sharedWithTeamIds || []; 
        $scope.icons = icons;
        $scope.position = position;
        $scope.teams = teams;

        var editMarker = $scope.marker.id && $scope.marker.id !== "you";
        $scope.submitText = editMarker ? "Save" : "Add";
        $scope.showDelBtn = editMarker;

        $scope.shotIcons = helpers.filterByTags(icons, ['shot']);
        $scope.seenIcons = helpers.filterByTags(icons, ['seen']);
        $scope.otherIcons = helpers.filterByTags(icons, ['shot', 'seen'], 'none');

        $scope.descriptionTags = helpers.extractTags($scope.marker.description);
        $scope.extractDescriptionTags = function () {
            $scope.descriptionTags = helpers.extractTags($scope.marker.description);
        }

        $scope.setIcon = function (icon) {
            $scope.marker.icon = icon;
            $scope.marker.iconSrc = $scope.icons[icon];
        }

        $scope.submit = function () {
            $modalInstance.close({ action: "submit" });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss("cancel");
        };

        $scope.delete = function () {
            $scope.showDelBtn = false;
            $scope.showDelConfirmBtn = true;
        }

        $scope.deleteConfirm = function () {
            $modalInstance.close({ action: "delete" });
        }
        
        $scope.shareWithTeam = function (teamId) {
            var shareWithTeam = $scope.marker.sharedWithTeamIds.indexOf(teamId) < 0;
            if(shareWithTeam) {
                $scope.marker.sharedWithTeamIds.push(teamId);    
            }
            else {
                $scope.marker.sharedWithTeamIds = $scope.marker.sharedWithTeamIds.filter(function (tId) {
                    return tId !== teamId;
                });
            }
        }

        var first = true;
        var startTime = new Date();
        $scope.$on('modal.closing', function (event, reason, closing) {
            var now = new Date();
            var duration = now.getTime() - startTime.getTime();
            if (!editMarker && reason === "backdrop click" && first && duration < 2000 && Modernizr.touch) {
                first = false;
                event.preventDefault();
            }
        });
    }]);