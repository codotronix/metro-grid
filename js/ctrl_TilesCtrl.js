(function(){
    angular.module('barickOSApp')
    .controller('tilesCtrl', ['$scope', '$http', '$rootScope', 'tileManager', function($scope, $http, $rootScope, tileManager) {
        
        $http.get('data/TM.json').then(function(res){
            var TM = res.data;
            $scope.TM = tileManager.tilify(TM);
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
        var isDragging = false;
        var dragTileId  = null;
        var iniMX = 0, iniMY = 0; //initial mouseX and mouseY when drag Starts
        $scope.dto = null;            //drag tile object => tile that is being dragged
        $scope.sto = null;                  //shift tile object => tile to be shifted

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
            isDragging = false;
            $('body').trigger('click');                
            //$('body').css('overflow','auto');
            //console.log("Drag End... dragTileId="+dragTileId);
            if(dragTileId == null || $scope.dto== null) {return;}
            //$('#' + dragTileId).css('z-index', 10);
            dto.styleObj["z-index"] = 10;
//                var left = parseInt($('#' + dragTileId).css('left'));
//                var top = parseInt($('#' + dragTileId).css('top'));
            var gridId = $('#' + dragTileId).attr('data-gridid');
            var left = $scope.TM.grids[gridId].left;
            var top = $scope.TM.grids[gridId].top;

            //get the element to be shifted
            var tileToShiftId = $('.shift-effect').attr('id');
            $('.tile').removeClass('shift-effect');

            /*
            * we will loop thru tiles array and insert dragTile just 
            * before tileToShift
            */
            var newTiles = [];
            var dragTileObj = {};
            var dragTileInsertIndex = 0;
            var counter = -1;                
            if (tileToShiftId != undefined && dragTileId != null) {
                for(var i in $scope.TM.tiles) {
                    var tile = $scope.TM.tiles[i];
                    if (tile.id == tileToShiftId) {
                        counter++;
                        newTiles.push(null); //later we will insert dragTileObj here
                        dragTileInsertIndex = counter;
                        counter++;
                        newTiles.push(tile);
                    }
                    else if(tile.id == dragTileId) {
                        dragTileObj = tile;
                    }
                    else {
                        counter++;
                        newTiles.push(tile);
                    }
                }

                newTiles[dragTileInsertIndex] = dragTileObj;
                dragTileId = null;
                //console.log(newTiles);
                var TM = $scope.TM;
                console.log(TM.tiles);
                TM.tiles = newTiles;
                console.log(TM.tiles);
                TM.isRetilify = true;
                $scope.TM = tilify(TM);                    
                //console.log($scope.TM);
            } 
            else {
                dto.top = top;
                dto.left = left;
//                    $('#' + dragTileId).css({
//                        "left": left,
//                        "top": top
//                    });
                dragTileId = null;
            }

            $scope.dto= null;
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
                    //break;        // dont break. need to move 'shift-effect' from all tiles
                    $scope.sto = tile;
                    break;
                    //console.log('sto identified...'); console.log(sto);
                }
            }         

            $scope.dto.top = newTop;
            $scope.dto.left = newLeft;
        }
        
        
    }]);
})()