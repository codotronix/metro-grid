(function(){
    angular.module('barickOSApp')
    
    /*****************************************************************************
     * The desktopCtrl
     *****************************************************************************/    
    .controller('desktopCtrl', ['$scope', '$http', function($scope, $http){
        $http.get('data/tiles.json').then(function(res){
            //$scope.tiles = res.data;
            tilify(res.data);
        }, function(err){
            console.log(err);
        });
    }])
    



/*******************************************************************************
*************************** The Helper Functions *******************************
*******************************************************************************/
function tilify (tiles) {
    var big_tile_size = 0;
    var medium_tile_size = 0;
    var small_tile_size = 0;
    var smallTiles = [];
    var mediumTiles = [];
    var bigTiles = [];
    var page_Width_Class = 'xs';
    var grids = {};
    var gridsPerRow = 12;       //12 sm and md, 16 for lg and 8 for xs
    
    //console.log($('.tiles-container').width());
    
    /*
    * Initialize all global variables
    */
    function initVars(){
        big_tile_size = 0;
        medium_tile_size = 0;
        small_tile_size = 0;
        smallTiles = [];
        mediumTiles = [];
        bigTiles = [];
    }
    
    
    /*
    * calculate height and width of the tiles depending on the tiles_container width
    */
    function calculateWidths () {
        var tiles_Container_width = $('.tiles-container').width();
        page_Width_Class = 'xs';
        var all_Possible_Width_Classes = 'xs sm md lg';
        
//        big_tile_size = tiles_Container_width / 3;
//        medium_tile_size = big_tile_size / 2;
//        small_tile_size = medium_tile_size / 2;
        gridsPerRow = 12;
        small_tile_size = Math.floor(tiles_Container_width / gridsPerRow);        
        
        if (tiles_Container_width >= 1200) {
            
            page_Width_Class = 'lg';
//            big_tile_size = tiles_Container_width / 4;
//            medium_tile_size = big_tile_size / 2;
//            small_tile_size = medium_tile_size / 2;
            gridsPerRow = 16;
            small_tile_size = Math.floor(tiles_Container_width / gridsPerRow);
            
        } else if (tiles_Container_width >= 992) {
            page_Width_Class = 'md';
            
        } else if (tiles_Container_width >= 768) {
            page_Width_Class = 'sm';
            
        } else {
            page_Width_Class = 'xs';
            
//            big_tile_size = tiles_Container_width / 2;
//            medium_tile_size = big_tile_size / 2;
//            small_tile_size = medium_tile_size / 2;   
            gridsPerRow = 8;
            small_tile_size = Math.floor(tiles_Container_width / gridsPerRow);
        }
        
        medium_tile_size = small_tile_size * 2;
        big_tile_size = medium_tile_size * 2;
        
        $('.tiles-container').removeClass('xs sm md lg').addClass(page_Width_Class);
    }
    
    
    /*
    * This function will simply iterate over tiles array 
    * and fill them into 3 arrays : smallTiles, mediumTiles, bigTiles
    */    
    function categorizeTiles () {
        var tileSize = '';
        for(var i in tiles) {
            tileSize = tiles[i].size;
            if (tileSize == "big") {
//                tiles[i].width = big_tile_size + 'px';
//                tiles[i].height = big_tile_size + 'px';
                //bigTiles.push(makeTileHtml(tiles[i]));
                bigTiles.push(tiles[i]);
            } else if (tileSize == "medium") {
//                tiles[i].width = medium_tile_size + 'px';
//                tiles[i].height = medium_tile_size + 'px';
                //mediumTiles.push(makeTileHtml(tiles[i]));
                mediumTiles.push(tiles[i]);
            } else if (tileSize == "small") {
//                tiles[i].width = small_tile_size + 'px';
//                tiles[i].height = small_tile_size + 'px';
                //smallTiles.push(makeTileHtml(tiles[i]));
                smallTiles.push(tiles[i]);
            }
        }
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
            } else if (tiles[i].size == "big") {
                fillCapacity += 16;
            }
        }
        
        //let's make total no grids be multiple gridsPerRow                
        var totalGrids = gridsPerRow * Math.ceil(fillCapacity/gridsPerRow) * 2;
        
        //console.log("totalGrids="+totalGrids);
        //console.log("gridsPerRow="+gridsPerRow);
        
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
        
        //console.log(grids);
        
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
    * this function will loop thru tiles,
    * send each tile to placeTileOnGrid(tile) 
    * and will receive the starting grid id 
    * and will store that grid id on that tile object
    */
    function mapTilesToGrid () {
        categorizeTiles();
//        for(var i in bigTiles) {
//            bigTiles[i].gridId = placeTileOnGrid (bigTiles[i]);
//        }
//        for(var i in mediumTiles) {
//            mediumTiles[i].gridId = placeTileOnGrid (mediumTiles[i]);
//        }
//        for(var i in smallTiles) {
//            smallTiles[i].gridId = placeTileOnGrid (smallTiles[i]);
//        }
        
        
        for (var i in tiles) {
            console.log("sending for tile id="+tiles[i].id);
            gridId = placeTileOnGrid (tiles[i]);
            tiles[i].gridId = gridId;
        }
        
        console.log(tiles);
        console.log(grids);
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
                   console.log(key + " is will hold " + tile.size + " tile id="+tile.id);
                   return(key);
               } else {
                   if (canItHoldTile(grids[key].id, tile.size)) {
                       console.log(key + " is will hold " + tile.size + " tile id="+tile.id);
                       //console.log("before markGridsOccupied");
                       //console.log(grids);
                       markGridsOccupied(grids[key].id, tile.size, tile.id);
                       //console.log("after markGridsOccupied");
                       //console.log(grids);
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
        var q = (tileSize == "medium") ? 2 : 4; // medium is 2x2, big is 4x4
        
        var startI = grids[gridId].indX;
        var startJ = grids[gridId].indY;
        var uptoI = startI + (q-1);
        var uptoJ = startJ + (q-1);
        var key = '';
        var innerLoopFailed = false;
        for (var i = startI; i <= uptoI; i++) {
            for (var j = startJ; j <= uptoJ; j++) {
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
        var q = (tileSize == "medium") ? 2 : 4; // medium is 2x2, big is 4x4
        var startI = grids[gridId].indX;
        var startJ = grids[gridId].indY;
        var uptoI = startI + (q-1);
        var uptoJ = startJ + (q-1);
        var key = '';
        //console.log("inside markGridsOccupied");
        //console.log();
        //console.log("param gridId="+gridId+" tileSize="+tileSize+" tileId="+tileId);
        for (var i = startI; i <= uptoI; i++) {
            for (var j = startJ; j <= uptoJ; j++) {
                key = i + "x" + j;
                //console.log("marking grid "+ key + " occupied with tileId="+tileId);
                grids[key].occupiedBy = tileId;
            }
        }
    }
    
    
    /*
    * This function will go thru tiles,
    * check their gridId
    * check that grids top and left from grid object
    * prepare the html and dump it to DOM
    */
    function drawTiles () {
        var tilesHtml = '';
        for(var i in tiles) {            
            var width = (tiles[i].size == "small") ? small_tile_size : ((tiles[i].size == "medium") ? medium_tile_size : big_tile_size);
            //console.log()
            tilesHtml +=  '<div class="tile ' + tiles[i].size + ' real" id="' + tiles[i].id + '" style="top:' +grids[tiles[i].gridId].top+ 'px; left:' +grids[tiles[i].gridId].left+ 'px; width:' +width+ 'px; height:' +width+ 'px;">'
                        +     '<div class="tileInnerContainer">'
                        +         tiles[i].name
                        +     '</div>'
                        + '</div>';
        }
        
        $('.tiles-container').append(tilesHtml);
    }
    
    
    
    
    function doTilify () {
        initVars();
        calculateWidths();
        makeGrids();        
        mapTilesToGrid();
        drawGrid();
        drawTiles();
        //categorizeTiles();
        //calculatePositionAbsolute();
        //groupSmallsToMedium();
        //groupMediumToBig();
        //addToDOM();
        //applyTileSize();
        //initDragging();
        tapNHoldTile();
    }
    
    doTilify();
    
    $(window).resize(function(){
        setTimeout(doTilify, 200);
    })
    //return(tiles);
    
    
    /*
    * This function initiates jq-ui-dragging on tiles-container
    */
    function initDragging () {
        $( ".tiles-container" ).sortable();
    }
    
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
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    
})()