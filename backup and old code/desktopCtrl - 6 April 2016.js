(function(){
    angular.module('barickOSApp')
    
    /*****************************************************************************
     * The desktopCtrl
     *****************************************************************************/    
    .controller('desktopCtrl', ['$scope', '$http', function($scope, $http){
        $http.get('data/tiles.json').then(function(res){
            //$scope.tiles = res.data;
            $scope.TM = tilify(res.data);
            console.log($scope.TM);
            
            $scope.ngTouchStart = function (ev) {console.log("inside ngTouchStart");};
            $scope.ngTouchEnd = function (ev) {console.log("inside ngTouchEnd");};
            $scope.ngMouseUp = function (ev) {console.log("inside ngMouseUp");};
            $scope.ngMouseDown = function (ev) {console.log("inside ngMouseDown");};
            
            
            //The Drag Variables
            var isDragging = false;
            var dragTileId  = null;
            var iniMX = 0, iniMY = 0; //iragStartsnitial mouseX and mouseY when d
            
            $scope.dragStart = function(ev){
                //if already dragging some tile, then return
                if(isDragging) {return;}
                dragTileId = $(ev.target).closest('.tile').attr('id');
                $('#' + dragTileId).css('z-index', 11);
                isDragging = true;
                $('body').css('overflow','hidden');
                iniMX = ev.pageX;
                iniMY = ev.pageY;
                console.log("Drag Start... dragTileId="+dragTileId+ " iniMX="+iniMX+ " iniMY="+iniMY);
            };
            
            
            $scope.dragEnd = function(ev) {
                isDragging = false;
                $('body').trigger('click');
                $('body').css('overflow','auto');
                console.log("Drag End... dragTileId="+dragTileId);
                if(dragTileId == null) {return;}
                $('#' + dragTileId).css('z-index', 10);
                var left = parseInt($('#' + dragTileId).css('left'));
                var top = parseInt($('#' + dragTileId).css('top'));

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
                var tile = null;
                if (tileToShiftId != undefined && dragTileId != null) {
                    for(var i in $scope.TM.tiles) {
                        tile = $scope.TM.tiles[i];
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
                    $scope.TM.tiles = newTiles;
                    dragTileId = null;
                    reTilify();
                } 
                else {
                    $('#' + dragTileId).css({
                        "left": left,
                        "top": top
                    });
                    dragTileId = null;
                }
            }
            
            
            
            $scope.dragMove = function (ev) {
                if (isDragging) {
                    var diffX = ev.pageX - iniMX;
                    var diffY = ev.pageY - iniMY;
                    iniMX = ev.pageX;
                    iniMY = ev.pageY;

                    var tileLeft = parseInt($('#' + dragTileId).css('left'));
                    var tileTop = parseInt($('#' + dragTileId).css('top'));
                    var newLeft = tileLeft + diffX;
                    var newTop = tileTop + diffY;
                    var tile = null;
                    for (var i in $scope.TM.tiles) {
                        tile = $scope.TM.tiles[i];
                        if(dragTileId != tile.id && Math.abs(tile.left - tileLeft) < (tile.width/2) && Math.abs(tile.top - tileTop) < (tile.height/2)) {
                            //console.log(tiles[i].id + " can be moved...");
                            $('.tile').removeClass('shift-effect');
                            $('#' + tile.id).addClass('shift-effect');
                            break;
                        }
                    }

                    $('#' + dragTileId).css({
                        "left": newLeft,
                        "top": newTop
                    });
                }
            }
            
        }, function(err){
            console.log(err);
        });
    }]);
    



/*******************************************************************************
*************************** The Helper Functions *******************************
*******************************************************************************/
function tilify (tiles, isRetilify) {
    var TM = {},                //TM = Tiles Manager
        big_tile_size = 0,
        medium_tile_size = 0,
        small_tile_size = 0,
        page_Width_Class = 'xs',
        grids = {},
        gridsPerRow = 12,       //12 sm and md, 16 for lg and 8 for xs
        colorCodes = ["#632F00", "#B01E00", "#C1004F", "#4617B4", "#008287", "#199900", "#00C13F", "#FF2E12", "#FF1D77", "#AA40FF", "#1FAEFF", "#000", "#00A3A3", "#FE7C22"];
    
    /*
    * Initialize all global variables
    */
//    function initVars(){
//        big_tile_size = 0;
//        medium_tile_size = 0;
//        small_tile_size = 0;
//        smallTiles = [];
//        mediumTiles = [];
//        bigTiles = [];
//    }
    
    
    /*
    * calculate height and width of the tiles depending on the tiles_container width
    */
    function calculateWidths () {
        
        var tiles_Container_width = $('.tiles-container').width() - 17;     //17px for scrollbar 
        page_Width_Class = 'xs';
        var all_Possible_Width_Classes = 'xs sm md lg';
        
        gridsPerRow = 12;
        small_tile_size = Math.floor(tiles_Container_width / gridsPerRow);        
        
        if (tiles_Container_width >= 1200) {            
            page_Width_Class = 'lg';
            gridsPerRow = 16;
            small_tile_size = Math.floor(tiles_Container_width / gridsPerRow);
        } 
        else if (tiles_Container_width >= 992) {
            page_Width_Class = 'md';
        } 
        else if (tiles_Container_width >= 768) {
            page_Width_Class = 'sm';            
        } 
        else {
            page_Width_Class = 'xs';   
            gridsPerRow = 8;
            small_tile_size = Math.floor(tiles_Container_width / gridsPerRow);
        }
        
        medium_tile_size = small_tile_size * 2;
        big_tile_size = medium_tile_size * 2;
        
        $('.tiles-container').removeClass('xs sm md lg').addClass(page_Width_Class);
    }
    
    
    /*
    * makeGrids will make the grids i.e. divide the page into smallest squares
    */
    function makeGrids () {
        //let's calculate total filling capacity in terms of smallest squares or grids
        fillCapacity = 0;
        for (var i in tiles) {
            if (tiles[i].size == "small") {
                fillCapacity += 1;
            } else if (tiles[i].size == "medium") {
                fillCapacity += 4;
            } else if (tiles[i].size == "rectangle") {
                fillCapacity += 8;
            }else if (tiles[i].size == "big") {
                fillCapacity += 16;
            }
        }
        
        //let's make total no grids be multiple gridsPerRow
        //Doubling the grids
        var totalGrids = gridsPerRow * Math.ceil(fillCapacity/gridsPerRow) * 2;
        
        //Let's make the grids
        grids = {};
        var gridX = 0;
        var gridY = 1;
        for (var i = 1; i <= totalGrids; i++) {
            gridX++;
            
            if(gridX > gridsPerRow) {
                gridX = 1;
                gridY++;
            }
            
            var grid = {};
            grid.indX = gridX;
            grid.indY = gridY;
            grid.id = gridX + "x" + gridY;
            grid.occupiedBy = "none";
            grid.top = (gridY - 1) * small_tile_size;
            grid.left = (gridX - 1) * small_tile_size;
            grid.type = '';     //if any tile starts on it, then type=startGrid
            
            grids[grid.id] = grid;
        }
    }
    
    
    /*
    * This function will reset the Grids
    */
    function resetGrids () {
        for(var key in grids) {
            grids[key].occupiedBy = "none";
            grids[key].type = '';
        }
    }
    
    
    /*
    * This function will make the grids HTML and dump on DOM
    */
    function drawGrid () {
        var gridHTML = '';
        for (var key in grids) {
            gridHTML += '<div id="' + key + '" class="grid ' +grids[key].type+ '" style="top:' +grids[key].top+ 'px; left:' +grids[key].left+ 'px; width:' +small_tile_size+ 'px; height:' +small_tile_size+ 'px;">' +key+ '</div>';
        }
        $('.tiles-container').html(gridHTML);
    }
    
    
    /*
    * this function will loop thru tiles, send each tile to placeTileOnGrid(tile) 
    * and will receive the starting grid id and will store that grid id on that tile object
    * We also calculate a clearSpaceDivPosition bottom all the tiles, since tiles are position absolute
    * there is nothing to push the browser scroll so that all the ttiles are visible
    */
    function mapTilesToGrid () {
        var clearSpaceDivPosition = 0;
        for (var i in tiles) {
            //console.log("sending for tile id="+tiles[i].id);
            gridId = placeTileOnGrid (tiles[i]);
            tiles[i].gridId = gridId;
            
            tiles[i].width = (tiles[i].size == "small") ? small_tile_size : ((tiles[i].size == "medium") ? medium_tile_size : big_tile_size);
            tiles[i].height = (tiles[i].size == "small") ? small_tile_size : ((tiles[i].size == "big") ? big_tile_size : medium_tile_size);            
            tiles[i].bgColor = tiles[i].bgColor || colorCodes[Math.floor(Math.random()*colorCodes.length)];
            tiles[i].top = grids[gridId].top;
            tiles[i].left = grids[gridId].left;
            
            clearSpaceDivPosition = ((tiles[i].top+tiles[i].height) > clearSpaceDivPosition) ? (tiles[i].top+tiles[i].height) : clearSpaceDivPosition; 
        }
        
        TM.clearSpaceDivPosition = clearSpaceDivPosition;
    }
    
    /*
    * This function will loop thru the grid in grids
    * looking for a vacant grid where it can place the tile
    * if the place is of q^2 size, it will also have to look more (q-1) cells on right
    * and (q-1) cells on right
    * once found, the tileId should be stored on all the applicable grids
    */
    function placeTileOnGrid(tile) {        
        for(var key in grids) {
            if (grids[key].occupiedBy == "none") {
               if (tile.size == "small") {
                   grids[key].occupiedBy = tile.id;
                   grids[key].type = 'startGrid';
                   //console.log(key + " is will hold " + tile.size + " tile id="+tile.id);
                   return(key);
               } else {
                   if (canItHoldTile(grids[key].id, tile.size)) {
                       markGridsOccupied(grids[key].id, tile.size, tile.id);
                       grids[key].type = 'startGrid';
                       return(key);
                   }
               }
            }
        }
        console.log('No Grid Avaialble for Tile id='+tile.id);
    }
    
    /*
    * This function will take a gridId and examine
    * that grid can be an elligible starting grid for
    * a given tile size
    */    
    function canItHoldTile(gridId, tileSize) {
        var x = (tileSize == "medium") ? 2 : 4; // medium is 2x2, big is 4x4, rectangle is 4x2
        var y = (tileSize == "big") ? 4 : 2;    // y is 4 for big, 2 for medium and rectangle
        
        var startX = grids[gridId].indX;
        var startY = grids[gridId].indY;
        var uptoX = startX + (x-1);
        var uptoY = startY + (y-1);
        var key = '';
        var innerLoopFailed = false;
        for (var i = startX; i <= uptoX; i++) {
            for (var j = startY; j <= uptoY; j++) {
                key = i + "x" + j;
                if(grids[key] == undefined || typeof(grids[key]) == undefined || grids[key].occupiedBy != "none") {
                    innerLoopFailed = true;
                    break;
                }                
            }
            if(innerLoopFailed) {
                break;
            }            
        }
        return !innerLoopFailed;
    }
    
    
    /*
    * this function will mark all the grids occupied
    * by a medium or big tile
    */
    function markGridsOccupied (gridId, tileSize, tileId) {
        var x = (tileSize == "medium") ? 2 : 4; // medium is 2x2, big is 4x4, rectangle is 4x2
        var y = (tileSize == "big") ? 4 : 2;    // y is 4 for big, 2 for medium and rectangle
        
        var startX = grids[gridId].indX;
        var startY = grids[gridId].indY;
        var uptoX = startX + (x-1);
        var uptoY = startY + (y-1);
        var key = '';
        for (var i = startX; i <= uptoX; i++) {
            for (var j = startY; j <= uptoY; j++) {
                key = i + "x" + j;
                grids[key].occupiedBy = tileId;
            }
        }
    }
    
    
    /*
    * This function puts all CSS Styles in a string, 
    * and adds it to the style property of tile so that it can be used in ng-style
    */
//    function makeStyleObj () {
//        for (var i in tiles) {
//            //tiles[i].style = "top: " + tiles[i].top + "px; left:" + tiles[i].left + "px; width:" + tiles[i].width + "px; height:" +{{tiles[i].height}} + "px;";
//            
//            tiles[i].style = {
//                "top": tiles[i].top + "px",
//                "left": tiles[i].left + "px",
//                "width": tiles[i].width + "px",
//                "height": tiles[i].height + "px"
//            }
//        }
//    }
    
    
    
    /*
    * This function will go thru tiles,
    * check their gridId
    * check that grids top and left from grid object
    * prepare the html and dump it to DOM
    */
//    
//    function drawTiles () {
//        var tilesHtml = '';
//        var highestTop = 0;
//        for(var i in tiles) {
//            tilesHtml +=  '<div class="tile ' + tiles[i].size + ' real" id="' + tiles[i].id + '" style="top:' +tiles[i].top+ 'px; left:' +tiles[i].left+ 'px; width:' +tiles[i].width+ 'px; height:' +tiles[i].height+ 'px;" data-gridid="' +tiles[i].gridId+ '">'
//                        +     '<div class="tileInnerContainer" style="background:' + tiles[i].bgColor + '">';
//            
//            if(tiles[i].iconType == "font") {
//                tilesHtml +=      '<span class="fontIcon ' + tiles[i].icon + '"></span>';                                    
//            }
//            
//             tilesHtml +=         '<label class="name">'
//                     +              tiles[i].name
//                     +            '</label>'
//                     +        '</div>'
//                     +     '</div>';
//            
//            if(tiles[i].top > highestTop) {highestTop = tiles[i].top;}
//        }
//        
//        
//        //now add a div to clear some space out, as all tiles are position abslute
//        highestTop += big_tile_size;
//        tilesHtml += '<div style="clear:both; position:absolute; top: ' +highestTop+ 'px; left: 10px; right: 10px; height:30px;"></div>';
//        
//        $('.tiles-container').html(tilesHtml);
//        
//        $('.tiles-container').css({
//            "height": highestTop + 'px'
//        });
//    }
    
    function doTilify () {
        //initVars();
        calculateWidths();
        makeGrids();        
        mapTilesToGrid();
        //makeTilesDraggable();
        //makeStyleObj();
        //drawGrid();
        //drawTiles();
        //tapNHoldTile();
        
        TM.tiles = tiles;
    }
    
    function reTilify () {
        resetGrids();
        mapTilesToGrid();
        //drawTiles();
    }
    
    doTilify();
    return(TM);
    
//    $(window).resize(function(){
//        setTimeout(doTilify, 200);
//    })
    //return(tiles);
    
        
    var timeout_id = 0;
    var hold_time = 700;
    /*
    * Code for Tap and Hold on a Tile
    */
    function tapNHoldTile () {
        
        $('.tile').mousedown(function(elem) {
            timeout_id = setTimeout(function(){
                showTileMenu(elem.target);
            }, hold_time);
        }).bind('mouseup mouseleave', function() {
            clearTimeout(timeout_id);
        });

        function showTileMenu(elem) {
          console.log($(elem).closest('.tile'));
            
            var tile = $(elem).closest('.tile');
            var tileID = tile.attr('id');
            var sizeToDo = '';
            
            if(tile.hasClass('small')) {sizeToDo = 'big';}
            else if(tile.hasClass('big')) {sizeToDo = 'medium';}
            else if(tile.hasClass('medium')) {sizeToDo = 'small';}
            
            modifyTile(tileID, "size", sizeToDo);
        }
    }
    
    function modifyTile(tileID, property, value){
        for(var i in tiles) {
            if (tiles[i].id == tileID) {
                tiles[i][property] = value;
                break;
            }
        }        
        doTilify();
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////
    
 
/********************************************************************************************************
************ Here I will Try to Implement Dragging and Repositioning Tile *******************************
********************************************************************************************************/
    function makeTilesDraggable () {
        var isDragging = false;
        var dragTileId = null;
        var iniMX = 0, iniMY = 0;

//        $('body').on('mousedown', '.tile', function(ev){
//
//            //if already dragging some tile, then return
//            if(isDragging) {return;}
//
//            dragTileId = $(ev.target).closest('.tile').attr('id');
//            $('#' + dragTileId).css('z-index', 11);
//            isDragging = true;
//            $('body').css('overflow','hidden');
//            iniMX = ev.pageX;
//            iniMY = ev.pageY;
//        });

        $('body').on('mouseup mouseleave', '.tile', function(ev) {
            isDragging = false;
            $('body').trigger('click');
            $('body').css('overflow','auto');
            if(dragTileId == null) {return;}
            $('#' + dragTileId).css('z-index', 10);
            var gridId = $('#' + dragTileId).attr('data-gridid');
            var left = grids[gridId].left;
            var top = grids[gridId].top;

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
                for(var i in tiles) {
                    if (tiles[i].id == tileToShiftId) {
                        counter++;
                        newTiles.push(null); //later we will insert dragTileObj here
                        dragTileInsertIndex = counter;
                        counter++;
                        newTiles.push(tiles[i]);
                    }
                    else if(tiles[i].id == dragTileId) {
                        dragTileObj = tiles[i];
                    }
                    else {
                        counter++;
                        newTiles.push(tiles[i]);
                    }
                }

                newTiles[dragTileInsertIndex] = dragTileObj;
                tiles = newTiles;
                dragTileId = null;
                reTilify();
            } 
            else {
                $('#' + dragTileId).css({
                    "left": left,
                    "top": top
                });
                dragTileId = null;
            }

        });

        var cornerSensingDistance = 30;
        $('body').on('mousemove', function (ev) {
            if (isDragging) {
                var diffX = ev.pageX - iniMX;
                var diffY = ev.pageY - iniMY;
                iniMX = ev.pageX;
                iniMY = ev.pageY;

                var tileLeft = parseInt($('#' + dragTileId).css('left'));
                var tileTop = parseInt($('#' + dragTileId).css('top'));
                var newLeft = tileLeft + diffX;
                var newTop = tileTop + diffY;

                for (var i in tiles) {
                    if(dragTileId != tiles[i].id && Math.abs(tiles[i].left - tileLeft) < (tiles[i].width/2) && Math.abs(tiles[i].top - tileTop) < (tiles[i].height/2)) {
                        //console.log(tiles[i].id + " can be moved...");
                        $('.tile').removeClass('shift-effect');
                        $('#' + tiles[i].id).addClass('shift-effect');
                        break;
                    }
                }

                $('#' + dragTileId).css({
                    "left": newLeft,
                    "top": newTop
                });
            }
        });
    }
    
//////////////////////////// End of Custom DnD /////////////////////////////////////////////////

}
    
})()