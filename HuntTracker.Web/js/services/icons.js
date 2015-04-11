angular.module('HTServices')

    .factory('IconSource', function () {
        var icons = {}
        //icons["default"] = "/images/circle.png";
        icons["default"] = "/images/bing.png";
        icons["hooves"] = "/images/hooves.png";
        icons["scope"] = "/images/scope.png";
        icons["person"] = "/images/person.png";

        return {
            getAll: function () {
                return icons;
            }
        };
    });