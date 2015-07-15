angular.module('HTServices')

    .factory('IconSource', function () {
        var icons = {}
        //icons["default"] = "/src/images/bing.png";
        //icons["hooves"] = "/src/images/hooves.png";
        //icons["scope"] = "/src/images/scope.png";
        //icons["person"] = "/src/images/person.png";
        //icons["deer"] = "/src/images/deer-silhouette.png";
        //icons["deer-shot"] = "/src/images/deer-shot-silhouette-20x32.png";

        var defaultSrc = "/src/images/animals4.png";

        icons["default"] = {
            offset: [304, 137],
            size: [161, 162],
            scale: 0.15,
            src: defaultSrc
        };
        icons["person"] = {
            offset: [0, 0],
            size: [25, 25],
            scale: 1,
            src: "/src/images/person.png"
        };
        icons["deer"] = {
            offset: [291, 301],
            size: [105, 142],
            scale: 0.30,
            src: defaultSrc
        };
        icons["moose"] = {
            offset: [0, 0],
            size: [150, 143],
            scale: 0.30,
            src: defaultSrc
        };
        icons["raindeer"] = {
            offset: [125, 160],
            size: [150, 163],
            scale: 0.30,
            src: defaultSrc
        };
        icons["fox"] = {
            offset: [151, 0],
            size: [119, 75],
            scale: 0.30,
            src: defaultSrc
        };
        icons["wolf"] = {
            offset: [152, 76],
            size: [151, 81],
            scale: 0.30,
            src: defaultSrc
        };
        icons["bird"] = {
            offset: [13, 262],
            size: [93, 92],
            scale: 0.40,
            src: defaultSrc
        };
        icons["grouse"] = {
            offset: [445, 0],
            size: [126, 152],
            scale: 0.20,
            src: defaultSrc
        };
        icons["wood-grouse"] = {
            offset: [308, 0],
            size: [130, 134],
            scale: 0.20,
            src: defaultSrc
        };


        return {
            getAll: function () {
                return icons;
            }
        };
    });