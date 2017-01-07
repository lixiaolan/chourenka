angular.
    module('card').
    component('editcard', {
        templateUrl: 'card/editcard.template.html',
        bindings: {
            card: '<'
        },
        controller: function CardController($http, $scope, $sce) {
            var that = this;
            
            $scope.call = function() {
                if (that.card) {
                    return $sce.trustAsHtml(that.card.call);
                }
                return "";
            }

            $scope.response = function() {
                if (that.card) {
                    return $sce.trustAsHtml(that.card.response);
                }
                return "";
            }
        }
    });
