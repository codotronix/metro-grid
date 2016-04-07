(function(){
    angular.module('barickOSApp')
    
    /*****************************************************************************
     * The desktopCtrl
     *****************************************************************************/    
    .controller('mainCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $rootScope.flags = {};
        $rootScope.flags.tileOpInProg = false;
        $rootScope.flags.tileResizingAllowed = false;
        $rootScope.flags.tileMovementAllowed = false;
        
        
    }])
})()