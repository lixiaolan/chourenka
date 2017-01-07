angular.
    module('card').
    component('hscard', {
        templateUrl: 'card/hscard.template.html',
        bindings: {
            card : '<'},
        controller: function CardController($http, $scope, $sce) {
            var that = this;

            this.$onInit = function() {
                console.log(that.card);}
            
            $scope.$watch('$ctrl.card', function(b,a) {
                $scope.showing = false;});
                        
            $scope.call = function() {
                return $sce.trustAsHtml(
                    callResponseFunctions[that.card.type].call(that.card.info.data));}

            $scope.response = function() {
                return $sce.trustAsHtml(
                    callResponseFunctions[that.card.type].response(that.card.info.data));}

            this.hideClass = function() {
                if ($scope.showing) {
                    return "";}
                else {
                    return "hide";}}

            this.notHideClass = function() {
                if ($scope.showing) {
                    return "hide";}
                else {
                    return "";}}

            $scope.showing = false;

            this.showingString = function() {
                if ($scope.showing) {
                    return "Hide";}
                else {
                    return "Show";}}

            this.hideShow = function() {
                if ($scope.showing) {
                    $scope.showing = false;}
                else {
                    $scope.showing = true;}}

            Mousetrap.bind('s', function() {
                $scope.$apply(function () {
                    that.hideShow();});});}});
