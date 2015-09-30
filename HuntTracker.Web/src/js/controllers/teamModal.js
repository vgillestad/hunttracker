/* global angular, Modernizr */
angular.module("HTControllers")

    .controller("TeamModalCtrl", ["$scope", "$modalInstance", "TeamSource", "UserSource", function ($scope, $modalInstance, TeamSource, UserSource) {
        $scope.newTeam = {};

        UserSource.current(function (user) {
            $scope.user = user;
            $scope.teams = TeamSource.getByUserId({ userId: $scope.user.id });
        });

        $scope.createTeam = function () {
            $scope.newTeam.id = Math.uuid();
            $scope.newTeam.adminId = $scope.user.id;
            $scope.newTeam.members = [{ id: $scope.user.id, status: 'active' }];

            TeamSource.add($scope.newTeam, function () {
                $scope.teams.push($scope.newTeam);
                $scope.newTeam = {};
            });
        }

        $scope.removeTeam = function (id) {
            TeamSource.remove({ id: id }, function () {
                $scope.teams = $scope.teams.filter(function (team) {
                    return team.id !== id;
                });
            });
        }

        $scope.cancel = function () {
            $modalInstance.dismiss("cancel");
        };
    }]);