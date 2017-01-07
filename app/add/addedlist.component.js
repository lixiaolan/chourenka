angular.
    module('add').
    component('addedlist', {
        templateUrl: 'add/addedlist.template.html',
        bindings: {
            listinterface: '='},
        controller: function AddChineseController($http, $scope, $sce) {
            var that = this;
            
            this.$onInit = function() {
                that.listinterface.add = $scope.add;
            }
            
            $scope.list = [];

            $scope.remove = function(card) {
                console.log(JSON.stringify(card));
                for (var i = 0; i < $scope.list.length; i++) {
                    if (card._id == $scope.list[i]._id) {
                        $scope.list.splice(i,1);
                        $http.post('remove_card', JSON.stringify(card)).then(function(response) {});
                        break;}}}
            
            $scope.add = function(card) {
                $http.post('add_card', JSON.stringify(card)).then(function(response) {
                    $scope.list.push(response.data);});}}});
