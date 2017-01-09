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
            };
            
            $scope.list = [];

            $scope.remove = function(data) {
                for (var i = 0; i < $scope.list.length; i++) {
                    if (data.info._id == $scope.list[i].info._id) {
                        $scope.list.splice(i,1);
                        $http.post('remove_info_and_cards', data).then(function(response) {});
                        break;}}};
            
            $scope.add = function(data) {
                console.log(data);
                $http.post('add_info_and_cards', data).then(function(response) {
                    console.log(response.data);
                    $scope.list.push(response.data);});}}});
