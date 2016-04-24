(function(){
    angular.module('barickOSApp')
    .directive('tileAnimator', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
        return {
            restrict: 'E',
            controller: ['$scope', function ($scope) {
                //$scope.newThing = "___" + $scope.tile.id;
                $scope.currImgIndex = 0;
                $scope.currTxtIndex = 0;
                $scope.AnimateImgClass = 'bounce';
                $scope.AnimateTxtClass = 'fadeIn';
                
                var animationClasses = ["slideInDown", "slideInLeft", "slideInRight", "slideInUp", "rotateIn", "rollIn", "zoomIn"];
                var txtAnimations = ["fadeIn"];
                
                //live img
                if($scope.tile.liveImgUrls != undefined) {
                    var waitTimeImg = 2500 + Math.round(Math.random() * (5000 / $scope.tile.liveImgUrls.length));
                    function nxtImg() {
                        if (!$rootScope.flags.tileMovementAllowed && !$rootScope.flags.tileResizingAllowed) {
                            $scope.currImgIndex = ($scope.currImgIndex + 1) % $scope.tile.liveImgUrls.length;
                            $scope.AnimateImgClass = animationClasses[Math.floor(Math.random() * animationClasses.length)];
                        }

                        //if there are more than 1 image, call next image, otherwise stop here
                        if ($scope.tile.liveImgUrls.length > 1) {
                            $timeout(nxtImg, waitTimeImg);
                        }                    
                    }
                    nxtImg();
                }
                
                //live txt
                if($scope.tile.liveTxts != undefined) {
                    var waitTimeTxt = 2500 + Math.round(Math.random() * (5000 / $scope.tile.liveTxts.length));
                    function nxtTxt() {
                        if (!$rootScope.flags.tileMovementAllowed && !$rootScope.flags.tileResizingAllowed) {
                            $scope.currTxtIndex = ($scope.currTxtIndex + 1) % $scope.tile.liveTxts.length;
                            $scope.AnimateTxtClass = txtAnimations[Math.floor(Math.random() * txtAnimations.length)];
                        }

                        //if there are more than 1 image, call next image, otherwise stop here
                        if ($scope.tile.liveTxts.length > 1) {
                            $timeout(nxtTxt, waitTimeTxt);
                        }                    
                    }
                    nxtTxt();
                }
                
            }],
            templateUrl: 'partials/tileAnimator.html'
        }
    }])
})()