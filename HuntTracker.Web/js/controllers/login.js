﻿angular.module("HTLogin", ["gettext", "HTServices"])
    .controller("LoginCtrl", function ($scope, AuthSource, UserSource) {
        $scope.view = "login";

        $scope.submitBtnLbl = "Login";

        $scope.login = function () {
            $scope.view = "login";
        };

        $scope.loginSubmit = function () {
            $scope.errorMessage = "";
            AuthSource.login({ email: $scope.email, password: $scope.password }).$promise
                .then(function () {
                    document.location.href = "/";
                }, function () {
                    $scope.password = "";
                    $scope.errorMessage = "Invalid username/password";
                });
        }

        $scope.register = function () {
            $scope.errorMessage = "";
            $scope.view = "register";
        }

        $scope.registerSubmit = function () {
            $scope.errorMessage = "";
            var newUser = {
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                email: $scope.email,
                password: $scope.password
            }

            UserSource.register(newUser).$promise
                .then(function () {
                    document.location.href = "";
                }, function () {
                console.log("An exception occured");
            });
        }

        $scope.forgot = function () {
            $scope.errorMessage = "";
            $scope.view = "forgot";
        }
    })