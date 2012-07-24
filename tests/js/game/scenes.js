Crafty.scene("Loading",function(){
    
    });

Crafty.scene("FrontierOutpost",function(){
    
    console.time("Initial Scene");
    console.log("Tiled Level Editor JSON file",frontier_outpost2);
    //Get Object Tiles
    var objects = null;
    //Get Collision Tiles
    var collisions = null;
    //Get Map Metadata;
    var map = frontier_outpost2;
    for(var i = 0,il = frontier_outpost2.layers.length;i<il;i++){
        var layer = frontier_outpost2.layers[i];
        if(layer.name == "object"){
            objects = layer.data;
        }
        if(layer.name == "collision"){
            collisions = layer.data;
        }
    }
    //Convert Data to Integers
    var tw = parseInt(map.tilewidth);
    var th = parseInt(map.tileheight);
    var mw = parseInt(map.width);
    var mh = parseInt(map.height);
    var startX = 40;
    var startY = 12;
    var iso = Crafty.diamondIso.init(tw,th,mw,mh);
  
    var player = Crafty.e("Player");
    iso.place(player,startX,startY,2);

    iso.centerAt(startX,startY);
    
    //Setup background color
    Crafty.background('url("img/frontier_outpost.png") '+(Crafty.viewport.x+32)+'px '+(Crafty.viewport.y-32)+'px  #000');

      
    var counter =$('#counter').text("Amount of Tiles: 0");
    
    player.bind("Moved",function(from){
      
        var pos = iso.px2pos(this.x+this.w/2,this.y+this.h);
        pos.x = ~~pos.x;
        pos.y = ~~pos.y;
        
        //calculate index of tile
        var i = pos.y * mh + pos.x;
       
        //check if the tile is solid
        if(collisions[i] > 0) {
            console.warn("Collision",pos);
            this.x = from.x;
            this.y = from.y;
        }
        Crafty.background('url("img/frontier_outpost.png") '+(Crafty.viewport.x+32)+'px '+(Crafty.viewport.y-32)+'px  #000');
        this.z = (this.y+this.h) * 2;
        
        //If player coordiantes didnt changed return
        if(this.position.x == pos.x || this.position.y == pos.y) return;
        console.log("Player Coordinates",pos);
        //update player coordiantes
        this.position.x = pos.x;
        this.position.y = pos.y;
       
        //update map
        console.time("Update objects");
        renderObjects();
        console.timeEnd("Update objects");
        
    });
   
    var renderObjects = function(){
        var area = iso.area(),createdTiles = 0;
        console.time("Get and draw new objects");
        for(var a=0,al = area.length;a<al;a++){
            var loc = area[a],
            x = loc[0],
            y= loc[1],
            i = y * mh + x,
            object = objects[i], //get current object
            collision =  collisions[i], //get current collision
            tile = null,//initialize tile
            layer = 1,//initialize layer
            z=0,//initialize Z
            tilename=''; //initialize individual name for tiles
          
         
            //place object tiles
            if(object > 0){
                
                //set layer
                layer = 2;
                z = (y+1)*layer;
                tilename = 'Y'+y+'X'+x+'Z'+z;
                //Find Tile
                tile = Crafty(tilename);
                if(tile.length < 1){ //Create tile if tile not exists
                   
                    tile = Crafty.e("2D","Tile","Canvas",object,tilename);//Mark the components as Tiles with Tile component
                    
                    iso.place(tile,x,y,layer);
                    createdTiles++;
            
                }
                //clear tile
                tile = null;
            }
                    
              
        }
          
        console.log("Added Tiles",createdTiles);
        
        console.timeEnd("Get and draw new objects");
        //Clearing up the objects
        if(Crafty("Tile").length > 100){
            console.time("Delete objects");
            var vp = Crafty.viewport.rect(); //get Rect of viewport
            var removedTiles = 0;
           
            Crafty("Tile").each(function () {
                if (!this.intersect(vp._x,vp._y,vp._w,vp._h)){
                  
                    this.destroy();
                    removedTiles++;
                }
            });
            console.log("Removed Tiles",removedTiles);
            console.timeEnd("Delete objects");
        }
        counter.text( "Amount of Tiles: "+Crafty("Tile").length);
         
    };  

    console.time("Initial draw objects");
    renderObjects();
    console.timeEnd("Initial draw objects");
    console.timeEnd("Initial Scene");

});
