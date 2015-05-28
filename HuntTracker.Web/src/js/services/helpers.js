angular.module('HTServices')

    .factory('Helpers', function () {
        var helpers = {};

        helpers.markerIcons = {};
        helpers.markerIcons["default"] = "src/images/bing.png";
        helpers.markerIcons["hooves"] = "src/images/hooves.png";
        helpers.markerIcons["you"] = "src/images/you.png";

        return helpers;
    });