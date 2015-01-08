angular.module("HuntersDirectives", ['gettext'])

    .directive('bootstrapModal', function () {
        return {
            restrict: 'E',
            scope: { show: "=", dialogtitle: "=", submitText: "=", onconfirm: "&", closeText: "=" },
            template: '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
                + '<div class="modal-dialog">'
                + '  <div class="modal-content">'
                + '  <div class="modal-header">'
                + '  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                + '<h4 class="modal-title" id="myModalLabel">{{dialogtitle}}</h4>'
                + ' </div>'
                + '<div class="modal-body">'
                + '</div>'
                + '<div class="modal-footer">'
                + ' <button type="button" class="btn btn-primary" id="okbtn">{{submitText}}</button>'
                + ' <button type="button" class="btn btn-default" data-dismiss="modal" id="closeButton">{{closeText || "Close"}}</button>'
                + '</div>'
                + ' </div>'
                + '</div>'
                + '</div>',

            transclude: true,
            replace: true,
            compile: function (element, attrs, transcludeFn) {
                return {
                    pre: function (scope, element) {
                        element.find('.modal-body').first().append(transcludeFn(scope.$parent));
                    },

                    post: function postLink(scope, iElement, iAttrs, controller) {

                        var closeFn = function () {
                            scope.$apply(function () {
                                scope.show = false;
                            });
                        };

                        element.find('#closeButton').on("click", closeFn);
                        element.find('.close').on("click", closeFn);

                        element.find('#okbtn').on("click", function () {
                            scope.$apply(function () {
                                scope.onconfirm();
                            });
                        });

                        scope.$watch('show', function (val) {
                            var body = angular.element("body");
                            if (val) {
                                iElement.addClass("in");
                                iElement.css("display", "block");
                                body.addClass("modal-open");
                                body.append('<div class="modal-backdrop fade in"></div>');
                            } else {
                                iElement.removeClass("in");
                                iElement.css("display", "");
                                body.removeClass("modal-open");
                                angular.element(".modal-backdrop").remove();
                            }
                        });
                    }
                };
            },
        };
    });