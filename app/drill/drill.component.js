angular.
    module('drill').
    component('drill', {
        templateUrl: 'drill/drill.template.html',
        controller: function drillController($http, $scope) {
            var that = this;

            $scope.card = {};
            $scope.count = 0;
            
            this.nextCard = function() {
                $http.post('next_card_and_info',{}).then(function(response) {
                    if (response.data) {
                        $scope.card = response.data;
                        $scope.count++;
                        console.log($scope.card.info);
                    }
                    else {
                        $scope.card = null;
                    }
                });
            }

            this.postHistoryAndNext = function(result) {
                if (!$scope.card) {
                    that.nextCard();
                    return;
                }

                $http.post('post_history', {'_id': $scope.card._id, 'result': result}).then(function(response) {
                    that.nextCard();
                });
            }

            Mousetrap.bind('y', function() { that.postHistoryAndNext(1); });
            Mousetrap.bind('p', function() { that.postHistoryAndNext(0); });
            Mousetrap.bind('n', function() { that.postHistoryAndNext(-1); });
        }
    });
