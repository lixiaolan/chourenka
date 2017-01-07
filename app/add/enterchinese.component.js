angular.
    module('add').
    component('enterchinese', {
        templateUrl: 'add/enterchinese.template.html',
        bindings: {
            enterinterface: '='},
        controller: function EnterChineseController($http, $scope, $sce) {
            var that = this;

            this.$postLink = function() {
                console.log(that.enterinterface);
                that.enterinterface.get = function() {
                    var ret = [];

                    ret.push($scope.chineseCard);
                    ret.push($scope.englishCard);
                    ret.push($scope.pronunciationCard);

                    return ret;
                }

                that.enterinterface.clear = function() {
                    that.clear();
                    return;
                }
            }

            this.clear = function() {
                $scope.chineseCard = {'call': "", 'response': ""};
                $scope.englishCard = {'call': "", 'response': ""};
                $scope.pronunciationCard = {'call': "", 'response': ""};
                
                $scope.chinese = "";
                $scope.english = "";
                $scope.pronunciation = "";
            }

            $scope.$watch('chinese', function(b,a) {that.updateCards();});
            $scope.$watch('english', function(b,a) {that.updateCards();});
            $scope.$watch('pronunciation', function(b,a) {that.updateCards();});

            this.updateCards = function() {
                $scope.chineseCard.call = that.chineseCall();
                $scope.chineseCard.response = that.chineseResponse();
                $scope.englishCard.call = that.englishCall();
                $scope.englishCard.response = that.englishResponse();
                $scope.pronunciationCard.call = that.pronunciationCall();
                $scope.pronunciationCard.response = that.pronunciationResponse();
            }

            // this.loadNewCards = function() {
            //     var emptyCardStr = JSON.stringify({'call': "", 'response': ""});
                
            //     $http.post('add_card', emptyCardStr).then(function(response) {
            //         $scope.chineseCard = response.data;
            //     });
            //     $http.post('add_card', emptyCardStr).then(function(response) {
            //         $scope.englishCard = response.data;
            //     });
            //     $http.post('add_card', emptyCardStr).then(function(response) {
            //         $scope.pronunciationCard = response.data;
            //     });
            // }

            this.clear();
            
            this.chineseCall = function() {
                return "<p>" + $scope.chinese + "</p>";
            }
            this.chineseResponse = function() {
                return "<p>" + $scope.pronunciation + "</p>" +
                    "<p>" + $scope.english + "</p>";
            }

            this.englishCall = function() {
                return "<p>" + $scope.english + "</p>";
            }
            this.englishResponse = function() {
                return "<p>" + $scope.chinese + "</p>" +
                    "<p>" + $scope.pronunciation + "</p>";
            }

            this.pronunciationCall = function() {
                return "<p>" + $scope.pronunciation + "</p>";
            }
            this.pronunciationResponse = function() {
                return "<p>" + $scope.chinese + "</p>" +
                    "<p>" + $scope.english + "</p>";
            }

            // this.save = function () {
            //     $http.post('save_card', JSON.stringify($scope.chineseCard)).then(function(response) {});
            //     $http.post('save_card', JSON.stringify($scope.englishCard)).then(function(response) {});
            //     $http.post('save_card', JSON.stringify($scope.pronunciationCard)).then(function(response) {});
            // }

            // this.cancel = function () {
            //     $http.post('remove_card', JSON.stringify($scope.chineseCard)).then(function(response) {});
            //     $http.post('remove_card', JSON.stringify($scope.englishCard)).then(function(response) {});
            //     $http.post('remove_card', JSON.stringify($scope.pronunciationCard)).then(function(response) {});
            // }
        }
    });
