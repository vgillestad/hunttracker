/* global angular, Modernizr */
angular.module("HTControllers")

    .controller("TeamModalCtrl", ["$scope", "$modalInstance", "TeamSource", "UserSource", "MemberSource", function ($scope, $modalInstance, TeamSource, UserSource, MemberSource) {
        $scope.loading = true;
        $scope.newTeam = {};

        var getTeam = function (teamId) {
            return $scope.teams.filter(function (team) {
                return team.id === teamId;
            })[0];
        }

        var getMember = function (teamId, userId) {
            return getTeam(teamId).members.filter(function (member) {
                return member.userId === userId;
            })[0];
        }

        UserSource.me(function (user) {
            $scope.user = user;
            TeamSource.getMyTeams(function (teams) {
                $scope.teams = teams;
                $scope.teams.forEach(function (team) {
                    team.userIsTeamAdmin = team.adminId === $scope.user.id;
                    team.members = MemberSource.getByTeamId({ teamId: team.id }, function (members) {
                        var meAsMember = members.filter(function (member) {
                            return member.userId === $scope.user.id;
                        })[0];
                        team.userMemberStatus = meAsMember.status;
                    });
                });
                if($scope.teams && $scope.teams.length > 0) {
                    $scope.teams[0].isOpen = true;
                }
                $scope.loading = false;
            });
        });

        $scope.createTeam = function () {
            $scope.newTeam.id = Math.uuid();
            $scope.newTeam.adminId = $scope.user.id;
            $scope.loading = true;
            TeamSource.add($scope.newTeam, function () {
                MemberSource.getByTeamId({ teamId: $scope.newTeam.id }, function (members) {
                    $scope.newTeam.members = members;
                    $scope.newTeam.isOpen = true;
                    $scope.newTeam.userIsTeamAdmin = true;
                    $scope.teams.push($scope.newTeam);
                    $scope.newTeam = {};
                    $scope.loading = false;
                });
            });
        }

        $scope.removeTeam = function (id) {
            TeamSource.remove({ id: id }, function () {
                $scope.teams = $scope.teams.filter(function (team) {
                    return team.id !== id;
                });
            });
        }

        $scope.inviteMember = function (teamId, email) {
            $scope.errorMessage = "";
            MemberSource.invite({ teamId: teamId, userEmail: email }).$promise
                .then(function (member) {
                    var team = getTeam(teamId);
                    team.members.push(member);
                }, function (reason) {
                    if (reason.status === 404) {
                        $scope.errorMessage = "We did not find any hunters with that email address."
                        $scope.loading = false;
                    }
                    else if(reason.status === 400 && reason.statusText === "UserAlreadyMemberInTeam") {
                        $scope.errorMessage = "This hunter is already a member in this team.";
                        $scope.loading = false;
                    }
                    else {
                        $scope.errorMessage = "We are sorry, but an unexpected error occured."
                        $scope.loading = false;
                    }
                });
        }
        
        $scope.acceptInvitation = function (teamId) {
            var team = getTeam(teamId);
            team.userMemberStatus = 'active';
            $scope.activateMember(teamId, $scope.user.id);
        };
        
        $scope.declineInvitation = function (teamId) {
            $scope.removeMember(teamId, $scope.user.id);
            $scope.teams = $scope.teams.filter(function (team) {
                return team.id !== teamId;
            });
        };

        $scope.activateMember = function (teamId, userId) {
            MemberSource.activate({ teamId: teamId, userId: userId }, function () {
                var member = getMember(teamId, userId);
                member.status = "active";
            });
        }

        $scope.pauseMember = function (teamId, userId) {
            MemberSource.pause({ teamId: teamId, userId: userId }, function () {
                var member = getMember(teamId, userId);
                member.status = "paused";
            });
        }

        $scope.removeMember = function (teamId, userId) {
            var team = getTeam(teamId);
            MemberSource.remove({ teamId: teamId, userId: userId }, function () {
                team.members = team.members.filter(function (member) {
                    return member.userId !== userId;
                });
            });
        }

        $scope.cancel = function () {
            $modalInstance.dismiss("cancel");
        };
    }]);