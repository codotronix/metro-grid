(function(){
    angular.module('barickOSApp')
    .controller('tilesCtrl', ['$scope', '$http', '$rootScope', 'tileManager', function($scope, $http, $rootScope, tileManager) {
        
        var grids;

        $http.get('data/TM.json').then(function(res){
            var TM = res.data;
            $scope.TM = tileManager.tilify(TM);
            grids = tileManager.getGrids();
        }, function(err){
            console.log(err);
        });
        
        $scope.getClearSpaceDivPosition = tileManager.getClearSpaceDivPosition;
        
        var tilesSizes = ["small", "medium", "rectangle", "big"];
        $scope.nextSize =  function (tileID) {
            //console.log($scope.tiles[tileID].size);
            var TM = $scope.TM;
            var size = TM.tiles[tileID].size;
            var nxtIndex = (tilesSizes.indexOf(size) + 1) % tilesSizes.length;
            var nxtSize = tilesSizes[nxtIndex];
            TM.tiles[tileID].size = nxtSize;           
             
            $scope.TM = tileManager.reTilify(TM);
        };
        
        //The Drag Variables        
        var iniMX = 0, iniMY = 0; //initial mouseX and mouseY when drag Starts
        $scope.dto = null;            //drag tile object => tile that is being dragged
        $scope.sto = null;            //shift tile object => tile to be shifted
        var stoIndex = 0;
        var dtoIndex = 0;
        var newTileOrder = [];

        $scope.dragStart = function(ev, tileID){    //console.log(ev);
            //console.log("$rootScope.flags.tileOpInProg="+$rootScope.flags.tileOpInProg+" and $rootScope.flags.tileMovementAllowed="+$rootScope.flags.tileMovementAllowed);
            
            //if another tile operation (move, resize) is already in progress, then return
            if($rootScope.flags.tileOpInProg || !$rootScope.flags.tileMovementAllowed) {return;}
            $rootScope.flags.tileOpInProg = true;
            ev.stopPropagation();            
            
            //MouseEvent or TouchEvent... Let's bring to same platform
            ev.pageX = ev.pageX || ev.originalEvent.changedTouches[0].pageX;              
            ev.pageY = ev.pageY || ev.originalEvent.changedTouches[0].pageY;
            iniMX = ev.pageX;
            iniMY = ev.pageY;
            
            $scope.dto= $scope.TM.tiles[tileID];
            //console.log("dto identified"); console.log($scope.dto);
            $scope.dto.zIndex = 1100;
        };
        
        $scope.dragEnd = function(ev) {     //console.log(ev);
            if(!$rootScope.flags.tileOpInProg || !$rootScope.flags.tileMovementAllowed) {return;}

            ev.stopPropagation();

            //$('body').trigger('click');
            if($scope.dto == null) {return;}

            /*
            * we will loop thru tileOrder  
            * and insert dto just before/after sto in tileOrder
            */
            if ($scope.sto != null) {
                stoIndex = $scope.TM.tileOrder.indexOf($scope.dto.id);
                newTileOrder = [];

                //if they are just neightbours, then just swap
                if(Math.abs($scope.TM.tileOrder.indexOf($scope.dto.id) - $scope.TM.tileOrder.indexOf($scope.sto.id)) == 1) {
                    newTileOrder = $scope.TM.tileOrder;
                    var stoIndex = $scope.TM.tileOrder.indexOf($scope.sto.id);
                    var dtoIndex = $scope.TM.tileOrder.indexOf($scope.dto.id);

                    newTileOrder[stoIndex] = $scope.dto.id;
                    newTileOrder[dtoIndex] = $scope.sto.id;
                }
                else {
                    for(var i in $scope.TM.tileOrder) {
                        if ($scope.TM.tileOrder[i] == $scope.dto.id) {
                            continue;
                        }
                        else if ($scope.TM.tileOrder[i] == $scope.sto.id) {                        
                            newTileOrder.push($scope.dto.id);
                            newTileOrder.push($scope.sto.id);
                        } else {
                            newTileOrder.push($scope.TM.tileOrder[i]);
                        }
                    }
                }

                var TM = $scope.TM;
                TM.tileOrder = newTileOrder;
                $scope.TM = tileManager.reTilify(TM);
            } 
            else {
                dto.top = grids[dto.gridId].top;
                dto.left = grids[dto.gridId].left;           
            }

            $scope.dto = null;
            $scope.sto = null;
            $rootScope.flags.tileOpInProg = false;
        }
        
        
        $scope.dragMove = function (ev) {   //console.log(ev);
            if(!$rootScope.flags.tileOpInProg || !$rootScope.flags.tileMovementAllowed) {return;}

            ev.stopPropagation();
            ev.preventDefault();
            //MouseEvent or TouchEvent... Let's bring to same platform
            ev.pageX = ev.pageX || ev.originalEvent.changedTouches[0].pageX;              
            ev.pageY = ev.pageY || ev.originalEvent.changedTouches[0].pageY;
            
            //get mouse pointer displacement
            var diffX = ev.pageX - iniMX;
            var diffY = ev.pageY - iniMY;
            iniMX = ev.pageX;
            iniMY = ev.pageY;
                
            //and calculate new top and left accordingly...    
            var newLeft = $scope.dto.left + diffX;
            var newTop = $scope.dto.top + diffY;

            for (var i in $scope.TM.tiles) {
                var tile = $scope.TM.tiles[i];
                if ($scope.dto.id != tile.id && Math.abs(tile.left - $scope.dto.left) < (tile.width/2) && Math.abs(tile.top - $scope.dto.top) < (tile.height/2)) {                
                    $scope.sto = tile;
                    break;
                }
            }         

            $scope.dto.top = newTop;
            $scope.dto.left = newLeft;
        }
        
        
    }]);
})()