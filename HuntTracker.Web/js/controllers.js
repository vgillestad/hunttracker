angular.module("PushAppControllers", ['PushAppSources'])
    .controller('NavCtrl', ['$scope', '$location', function ($scope, $location) {
        $scope.links = [
            { name: "Table", href: "#/table" },
            { name: "Map", href: "#/map" },
            { name: "Chart", href: "#/chart" }];
        $scope.$on('$locationChangeSuccess', function () {
            $scope.current = '#' + $location.url();
        });
    }])

    .controller("TableCtrl", ['$scope', 'TableSources', function ($scope, TableSources) {
        $scope.pushWidgets = TableSources.getAll();
        $scope.baseUrl = location.origin;
        $scope.widgetWidths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        $scope.widgetHeights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        $scope.examples = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]];

        var refresh = function () { $scope.pushWidgets = TableSources.getAll(); };

        $scope.create = function () {
            $scope.pushWidget = { Width: 4, Height: 4};
            $scope.showdialog = true;
            $scope.dialogtitle = 'Add new widget';
            $scope.submitText = "Add";
            $scope.onConfirm = function () {
                TableSources.add($scope.pushWidget, refresh);
                $scope.showdialog = false;
            };
        };

        $scope.edit = function (widgetId) {
            $scope.pushWidget = $.extend(true, {}, $scope.pushWidgets.filter(function (p) { return p.WidgetId === widgetId; })[0]);
            $scope.showdialog = true;
            $scope.dialogtitle = "Edit widget";
            $scope.submitText = "Ok";
            $scope.onConfirm = function () {
                TableSources.update($scope.pushWidget, refresh);
                $scope.showdialog = false;
            };
        };

        $scope.addColumn = function () {
            $scope.pushWidget.Columns = $scope.pushWidget.Columns || [];
            $scope.pushWidget.Columns.push({});
        };

        $scope.removeColumn = function (columnId) {
            $scope.pushWidget.Columns = $scope.pushWidget.Columns.filter(function (c) { return c.Id !== columnId; });
        };
    }])

    .controller('MapCtrl', ['$scope', 'MapSources', function ($scope, MapSources) {
        $scope.pushWidgets = MapSources.getAll();
        $scope.baseUrl = location.origin;
        $scope.widgetWidths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        $scope.widgetHeights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        $scope.tileLayers = ["Bing", "Statkart"];
        $scope.pinStyles = ["Bing", "Google", "Needle"];
        $scope.examples = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]];

        var refresh = function () { $scope.pushWidgets = MapSources.getAll(); };

        $scope.create = function () {
            $scope.pushWidget = { TileLayer: "Bing", Width: 4, Height: 4 };
            $scope.showdialog = true;
            $scope.dialogtitle = 'Add new widget';
            $scope.submitText = "Add";
            $scope.onConfirm = function () {
                MapSources.add($scope.pushWidget, refresh);
                $scope.showdialog = false;
            };
        };

        $scope.edit = function (widgetId) {
            $scope.pushWidget = $.extend(true, {}, $scope.pushWidgets.filter(function (p) { return p.WidgetId === widgetId; })[0]);
            $scope.showdialog = true;
            $scope.dialogtitle = "Edit widget";
            $scope.submitText = "Ok";
            $scope.onConfirm = function () {
                MapSources.update($scope.pushWidget, refresh);
                $scope.showdialog = false;
            };
        };

        $scope.addField = function () {
            $scope.pushWidget.Fields = $scope.pushWidget.Fields || [];
            $scope.pushWidget.Fields.push({});
        };

        $scope.removeField = function (fieldId) {
            $scope.pushWidget.Fields = $scope.pushWidget.Fields.filter(function (f) { return f.Id !== fieldId; });
        };
        
        $scope.addType = function () {
            $scope.pushWidget.Types = $scope.pushWidget.Types || [];
            $scope.pushWidget.Types.push({
                PinStyle: $scope.pinStyles[0]
            });
        };

        $scope.removeType = function (typeId) {
            $scope.pushWidget.Types = $scope.pushWidget.Types.filter(function (f) { return f.Id !== typeId; });
        };
    }])

    .controller('ChartCtrl', ['$scope', 'ChartSources', function ($scope, ChartSources) {
        $scope.pushWidgets = ChartSources.getAll();
        $scope.baseUrl = location.origin;
        $scope.widgetWidths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        $scope.widgetHeights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        $scope.chartTypes = ['Line', 'Column', 'Bar'];

        var refresh = function () { $scope.pushWidgets = ChartSources.getAll(); };

        $scope.create = function () {
            $scope.pushWidget = { Width: 4, Height: 4, ChartType: $scope.chartTypes[0] };
            $scope.showdialog = true;
            $scope.dialogtitle = 'Add new widget';
            $scope.submitText = "Add";
            $scope.onConfirm = function () {
                ChartSources.add($scope.pushWidget, refresh);
                $scope.showdialog = false;
            };
        };

        $scope.edit = function (widgetId) {
            $scope.pushWidget = $.extend(true, {}, $scope.pushWidgets.filter(function (p) { return p.WidgetId === widgetId; })[0]);
            $scope.showdialog = true;
            $scope.dialogtitle = "Edit widget";
            $scope.submitText = "Ok";
            $scope.onConfirm = function () {
                ChartSources.update($scope.pushWidget, refresh);
                $scope.showdialog = false;
            };
        };

        $scope.addCategory = function () {
            $scope.pushWidget.Categories = $scope.pushWidget.Categories || [];
            $scope.pushWidget.Categories.push({});
        };

        $scope.removeCategory = function (fieldId) {
            $scope.pushWidget.Categories = $scope.pushWidget.Categories.filter(function (f) { return f.Id !== fieldId; });
        };
    }]);