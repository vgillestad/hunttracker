/* global angular, Modernizr */
angular.module("HTResetPassword", ["gettext", "HTServices"])

    .controller("ResetPasswordCtrl", ["$scope", "$location", "UserSource", function ($scope, $location, UserSource) {

        $scope.resetPassword = function () {
            if ($scope.password !== $scope.confirmPassword) {
                $scope.errorMessage = 'The passwords does not match';
            }
            else {
                $scope.errorMessage = null;
                $scope.loading = true;
                UserSource.resetPassword({ token: $location.search().token, password: $scope.password, confirmPassword: $scope.confirmPassword }).$promise
                    .then(function () {
                        document.location.href = "/";
                    }, function (reason) {
                        if (reason.status === 401) {
                            $scope.errorMessage = "The reset password link is expired."
                            $scope.loading = false;
                        }
                        else {
                            $scope.errorMessage = "We are sorry, but an unexpected error occured."
                            $scope.loading = false;
                        }
                    });
            }
        }
    }]);