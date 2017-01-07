angular.
    module('card').
    component('dispcard', {
        templateUrl: 'card/dispcard.template.html',
        bindings: {
            card: '<'
        },
        controller: function CardController($http, $scope, $sce) {
            var that = this;
            
            $scope.call = function() {
                if (that.card) {
                    return $sce.trustAsHtml(
                        callResponseFunctions[that.card.type].call(that.card.info.data));
                }
                return "";
            }

            $scope.response = function() {
                if (that.card) {
                    return $sce.trustAsHtml(
                        callResponseFunctions[that.card.type].response(that.card.info.data));
                }
                return "";
            }
        }
    });
