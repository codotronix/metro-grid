(function(){
    angular.module('barickOSApp')
    
    /*****************************************************************************
     * The Route
     *****************************************************************************/    
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
        $locationProvider.html5Mode(false);
        $locationProvider.hashPrefix('!');
        $routeProvider
        .when('/desktop', {
            templateUrl:'partials/tiles.html',
            controller: 'tilesCtrl'
        })
        .when('/', {
            redirectTo: '/desktop'
        })
        .otherwise({
            redirectTo: '/'
        });        
    }])
    
})()