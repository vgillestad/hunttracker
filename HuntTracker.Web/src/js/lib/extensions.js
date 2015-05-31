(function () {
    window.isAndroid = window.isAndroid || function () {
        var ua = navigator.userAgent.toLowerCase();
        return ua.indexOf("android") > -1;
    }
}());