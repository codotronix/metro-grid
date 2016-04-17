(function(){
    angular.module('barickOSApp')
    .directive('tileAnimator', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
        return {
            restrict: 'E',
            controller: function ($scope) {
                //$scope.newThing = "___" + $scope.tile.id;
                $scope.currImgIndex = 0;
                $scope.AnimateClass = 'bounce';
                
                var animationClasses = ["slideInDown", "slideInLeft", "slideInRight", "slideInUp"];
                var count = -1;
                function nxtImg() {
                    if(!$rootScope.flags.tileMovementAllowed && !$rootScope.flags.tileResizingAllowed) {
                        $scope.currImgIndex = ($scope.currImgIndex + 1) % $scope.tile.liveImgUrls.length;
                        
                        count = (count + 1) % animationClasses.length;
                        $scope.AnimateClass = animationClasses[count];
                    }                    
                    $timeout(nxtImg, 2000);
                }
                
                nxtImg();
                
            },
            templateUrl: 'partials/tileAnimator.html'
        }
    }])
})()