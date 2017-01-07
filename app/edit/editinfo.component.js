angular.
    module('edit').
    component('editinfo', {
        templateUrl: 'edit/editinfo.template.html',
        controller: function EditCardController($http, $scope, $sce, $routeParams) {

            $http.post('get_info_and_cards',{'_id': $routeParams.infoid}).then(function(response) {
                console.log(response.data);
                if (response.data) {
                    $scope.data = response.data;
                    $scope.data.cards.forEach(function(card) {
                        card.info = $scope.data.info;});}
                else {
                    $scope.card = null;}});

            $scope.save = function() {
                if (!$scope.data) return;
                $http.post('save_info_and_cards', $scope.data).then(function(response) {
                    alert("saved!");});}}});
