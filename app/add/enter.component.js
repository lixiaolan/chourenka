angular.
    module('add').
    component('enter', {
        templateUrl: 'add/enter.template.html',
        bindings: {
            enterinterface: '='},
        controller: function EnterController($http, $scope, $sce) {
            var that = this;

            this.$postLink = function() {
                that.enterinterface.get = function() {
                    var ret = [];

                    ret.push($scope.card);

                    return ret;
                }

                that.enterinterface.clear = function() {
                    that.clear();
                    return;
                }
            }

            this.clear = function() {
                $scope.card = {'call': "", 'response': ""};
            }

            this.clear();
        }
    });
