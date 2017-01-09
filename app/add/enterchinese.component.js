angular.
    module('add').
    component('enterchinese', {
        templateUrl: 'add/enterchinese.template.html',
        bindings: {
            enterinterface: '='},
        controller: function EnterChineseController($http, $scope, $sce) {
            var that = this;

            this.$postLink = function() {

                that.enterinterface.get = function() {
                    var ret = [];

                    ret.push($scope.data);

                    return ret;
                }

                that.enterinterface.clear = function() {
                    that.clear();
                    return;
                }
            }

            this.clear = function() {
                $scope.data = blankChineseInfoAndCards();
            }

            this.clear();
        }
    });
