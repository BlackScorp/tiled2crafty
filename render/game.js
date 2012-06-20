$(function(){
    //Init Crafty
    Crafty.init(640,480);
    //Init Canvas
    Crafty.canvas.init();
    

    //Setup background color
    Crafty.background("#000");
     
    //FrontierOutpost Component
    Crafty.c("FrontierOutpost",{
        _tiles:null,
        _objects:null,
        _collisions:null,
        _map:null,
        _iso:null,
        init:function(){
            //Get Background Tiles
            this._tiles = frontier_outpost.layers.background.split(","); 
            //Get Object Tiles
            this._objects = frontier_outpost.layers.object.split(",");
            //Get Collision Tiles
            this._collisions = frontier_outpost.layers.collision.split(",");
            //Get Map Metadata;
            this._map = frontier_outpost.metadata;

            //Convert Data to Integers
            var tw = parseInt(this._map.tilewidth);
            var th = parseInt(this._map.tileheight);
            var mw = parseInt(this._map.width);
            var mh = parseInt(this._map.height);
    
            //Init Isometric
            this._iso = Crafty.diamondIso.init(tw,th,mw,mh);
  

            //Center Viewport at Position
            this._iso.centerAt(32,32);
            this.bind("UpdateMap",function(){
                this.drawMap();
            })
        
        },
        drawMap:function(){
                 
            //Convert Data to Integers
            var mh = parseInt(this._map.height);
            var area = this._iso.area();
            for(var a=0,al = area.length;a<al;a++){
                var loc = area[a],
                x = loc[0],
                y= loc[1],
                i = y * mh + x,
                object = this._objects[i], //get current object
                collision =  this._collisions[i], //get current collision
                background =  this._tiles[i], //get current background
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
                        this._iso.place(tile,x,y,layer);
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
                        this._iso.place(tile,x,y,layer);
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
            
           
           
        }
    }
    );
    //Create entity
    var map = Crafty.e("FrontierOutpost");
    //trigger event
    map.trigger("UpdateMap");
    
    
    Crafty.bind("KeyDown",function(e){
        this._isDown = true;
        this._keyCode = e.keyCode;
     
    })
    Crafty.bind("KeyUp",function(e){
        this._isDown = false;
        map.trigger("UpdateMap");
        console.log("Amount of Tiles");
        console.log(Crafty("2D").length);
    })
    Crafty.bind("EnterFrame",function(){
        if(!this._isDown) return;
        var scrollSpeed = 5;
        if(Crafty.keys['W'] == this._keyCode ){
            Crafty.viewport.y+=scrollSpeed;
        }
        if(Crafty.keys['A'] == this._keyCode ){
            Crafty.viewport.x+=scrollSpeed;
        }
        if(Crafty.keys['S'] == this._keyCode ){
            Crafty.viewport.y-=scrollSpeed;
        }
        if(Crafty.keys['D'] == this._keyCode ){
            Crafty.viewport.x-=scrollSpeed;
        }
       
    });
    console.log("Amount of Tiles");
    console.log(Crafty("2D").length);

});
