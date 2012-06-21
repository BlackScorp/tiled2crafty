Crafty.scene("Loading",function(){
    
    });

Crafty.scene("FrontierOutpost",function(){
    //Setup background color
    //Crafty.background("#000");
    //Get Background Tiles
    var backgrounds = frontier_outpost.layers.background.split(","); 
    //Get Object Tiles
    var objects = frontier_outpost.layers.object.split(",");
    //Get Collision Tiles
    var collisions = frontier_outpost.layers.collision.split(",");
    //Get Map Metadata;
    var map = frontier_outpost.metadata;

    //Convert Data to Integers
    var tw = parseInt(map.tilewidth);
    var th = parseInt(map.tileheight);
    var mw = parseInt(map.width);
    var mh = parseInt(map.height);
    var startX = 20;
    var startY = 40;
    var iso = Crafty.diamondIso.init(tw,th,mw,mh);
  
  //  var player = Crafty.e("Player");
   // iso.place(player,startX,startY,2);
  
    iso.layer.create("background",frontier_outpost.layers.background.split(","));
    iso.layer.create("object",frontier_outpost.layers.object.split(","));
   // iso.centerAt(startX,startY);
    iso.render();
   //   
   
    
    /*player.bind("Moved",function(){
        var pos = iso.px2pos(this.x,this.y+this.h);
      
        this.z = (~~pos.y+1) * 2;
    });*/
    var renderMap = function(){
        var area = iso.area();
        for(var a=0,al = area.length;a<al;a++){
            var loc = area[a],
            x = loc[0],
            y= loc[1],
            i = y * mh + x,
            object = objects[i], //get current object
            collision =  collisions[i], //get current collision
            background =  backgrounds[i], //get current background
            tile = null,//initialize tile
            layer = 1,//initialize layer
            z=0,//initialize Z
            tilename=''; //initialize individual name for tiles
            //place background tiles
            if(background > 0){
                //set layer
                layer = 1;
                z = (y+1)*layer;
                tilename = 'Y'+y+'X'+x+'Z'+z;
                //Find Tile
                tile = Crafty(tilename);
                        
                if(tile.length < 1){ //Create tile if tile not exists
                    tile = Crafty.e("2D","Tile","Canvas",background,tilename); //Mark the components as Tiles with Tile component
                    //add colision 
                    // < 0 means disabled 
                    if(collision < 0) {
                        tile.addComponent("Collision,Solid");
                        tile.collision( this._iso.polygon(tile));
                    } 
                    iso.place(tile,x,y,layer);
                }   
                //clear tile
                tile = null;
            }
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
                    //add colision 
                    // < 0 means disabled 
                    if(collision < 0) {
                        tile.addComponent("Collision,Solid");
                        tile.collision( this._iso.polygon(tile));
                    } 
                    iso.place(tile,x,y,layer);
                }
                //clear tile
                tile = null;
            }
                    
              
        }
        //Clearing up the map
        var tiles = Crafty("Tile"); //get the marked tiles
        var vp = Crafty.viewport.rect(); //get Rect of viewport
        for(var t = 0,tl = tiles.length;t<tl;t++){
            tile = Crafty(tiles[t]);
            if(!tile.intersect(vp._x,vp._y,vp._w,vp._h)){ //if tile not intersect the viewport
                tile.destroy(); //destroy
            }
               
        }
    };   
// renderMap();
 
});