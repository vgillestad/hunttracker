angular.module('HTServices')

    .factory('IconSource', function () {
        var defaultSrc = "/src/images/animals8.png";
        var icons = {}

        icons["you"] = { type: "font", class: "icon-you", text: "\ue900", font: "normal 25px icomoon" };

        // Other icons
        icons["default"] = { type: "font", class: "icon-circles", text: "\uee77", font: "normal 25px icomoon" };
        icons["house"] = { type: "font", class: "icon-home5", text: "\ue905", font: "normal 25px icomoon", tags: ["house"] };
        icons["video-camera"] = { type: "font", class: "icon-video-camera2", text: "\ue964", font: "normal 25px icomoon", tags:["camera"] };
        icons["camera"] = { type: "font", class: "icon-camera", text: "\ue945", font: "normal 25px icomoon", tags: ["camera"] };
        icons["pin"] = { type: "font", class: "icon-location5", text: "\uea3d", font: "normal 25px icomoon" };
        icons["skull"] = { type: "font", class: "icon-skull", text: "\uebee", font: "normal 25px icomoon", tags: ["danger"] };
        icons["warning"] = { type: "font", class: "icon-warning2", text: "\ued4e", font: "normal 25px icomoon", tags: ["danger"] };
        icons["car"] = { type: "font", class: "icon-car", text: "\uec08", font: "normal 25px icomoon", tags: ["car"] };
        icons["person"] = { type: "image", offset: [0, 0], size: [25, 25], scale: 1, src: "/src/images/person.png" };
        icons["hoove"] = { type: "image", scale: 0.6, src: defaultSrc, tags: ["tracks", "hoove"], offset: [0, 404], size: [37, 43] };
        icons["paw"] = { type: "font", class: "icon-paw", text: "\uebd6", font: "normal 25px icomoon", tags: ["tracks", "paw"] };

        // Seen icons
        icons["bird"] = { type:"image", scale:0.4, src:defaultSrc, tags: ["seen", "bird"], offset: [0, 0], size: [70,68] }; 
        icons["deer"] = { type:"image", scale:0.4, src:defaultSrc, tags: ["seen", "deer"], offset: [0, 78], size: [86,87] }; 
        icons["fox"] = { type:"image", scale:0.4, src:defaultSrc, tags: ["seen", "fox"], offset: [0, 175], size: [83,54] }; 
        icons["grouse"] = { type:"image", scale:0.4, src:defaultSrc, tags: ["seen", "grouse"], offset: [0, 239], size: [60,72] }; 
        icons["hare"] = { type:"image", scale:0.4, src:defaultSrc, tags: ["seen", "hare"], offset: [0, 321], size: [59,73] }; 
        icons["moose"] = { type:"image", scale:0.4, src:defaultSrc, tags: ["seen", "moose"], offset: [0, 457], size: [90,85] }; 
        icons["raindeer"] = { type:"image", scale:0.5, src:defaultSrc, tags: ["seen", "raindeer"], offset: [0, 552], size: [73,81] };
        icons["wolf"] = { type:"image", scale:0.4, src:defaultSrc, tags: ["seen", "wolf"], offset: [0, 1299], size: [105,56] }; 
         
        // Shot icons 
        icons["shot_bird"] = { type:"image", scale:0.4, src:defaultSrc, tags: ["shot", "bird"], offset: [0, 643], size: [70,68] }; 
        icons["shot_deer"] = { type:"image", scale:0.4, src:defaultSrc, tags: ["shot", "deer"], offset: [0, 721], size: [86,87] }; 
        icons["shot_fox"] = { type:"image", scale:0.4, src:defaultSrc, tags: ["shot", "fox"], offset: [0, 818], size: [83,54] }; 
        icons["shot_grouse"] = { type:"image", scale:0.4, src:defaultSrc, tags: ["shot", "grouse"], offset: [0, 882], size: [60,72] }; 
        icons["shot_hare"] = { type:"image", scale:0.4, src:defaultSrc, tags: ["shot", "hare"], offset: [0, 964], size: [59,73] }; 
        icons["shot_moose"] = { type:"image", scale:0.4, src:defaultSrc, tags: ["shot", "moose"], offset: [0, 1047], size: [90,85] }; 
        icons["shot_raindeer"] = { type:"image", scale:0.5, src:defaultSrc, tags: ["shot", "raindeer"], offset: [0, 1142], size: [73,81] }; 
        icons["shot_wolf"] = { type:"image", scale:0.4, src:defaultSrc, tags: ["shot", "wolf"], offset: [0, 1233], size: [105,56] }; 
        
        return {
            getAll: function () {
                return icons;
            }
        };
    });