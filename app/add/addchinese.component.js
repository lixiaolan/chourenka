angular.
    module('add').
    component('addchinese', {
        templateUrl: 'add/addchinese.template.html',
        controller: function AddChineseController($http, $scope, $sce) {
            $scope.enterinterface = {};
            $scope.listinterface = {};

            $scope.add = function() {
                var lst = $scope.enterinterface.get();
                $scope.enterinterface.clear();

                for (var i = 0; i < lst.length; i++) {
                    $scope.listinterface.add(lst[i]);
                }
                return;
            }
        }
    });
