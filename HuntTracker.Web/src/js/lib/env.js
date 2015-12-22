var ht = {};
ht.env = (function () {
    var apiUrl = "/api";
    var selfHostedApi = true;
    var hostedInCordova = window.cordova;
    var hostedInRipple = window.parent && window.parent.ripple;

    if (hostedInCordova || hostedInRipple) {
        selfHostedApi = false;
        apiUrl = "http://192.168.1.177:8081/api"
    }

    return {
        selfHostedApi: selfHostedApi,
        apiUrl: apiUrl,
        hostedInCordova: hostedInCordova
    }
}());