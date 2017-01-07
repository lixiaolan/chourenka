angular.
    module('edit').
    component('editcard', {
        templateUrl: 'edit/editcard.template.html',
        controller: function EditCardController($http, $scope, $sce, $routeParams) {

            console.log("_id: " + $routeParams.cardid);
            
            $http.post('get_card',{'_id': $routeParams.cardid}).then(function(response) {
                if (response.data) {
                    $scope.card = response.data;}
                else {
                    $scope.card = null;}});

            $scope.save = function() {
                if (!$scope.card) return;

                $http.post('save_card', $scope.card).then(function(response) {});}}});
