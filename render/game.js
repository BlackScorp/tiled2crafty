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
            var mw = parseInt(this._map.width);
            var mh = parseInt(this._map.height);
            
            //Get the area to draw
            var area = this._iso.area();
      
             
            //draw map
             for(var y = area.y.min;y<area.y.max;y++){
            //Setup the tile counter
             var i = y * mh; 
              for(var x = area.x.min;x<area.x.max;x++){
           // for(var y = 0;y<mh;y++){
                //Setup the tile counter
             //   var i = y * mh; 
              //  for(var x = 0;x<mw;x++){
                    var object = this._objects[i], //get current object
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
                            tile = Crafty.e("2D","Text","Tile","DOM",background,tilename);
                            //add colision 
                            // < 0 means disabled 
                            if(collision < 0) {
                                tile.addComponent("Collision,Solid");
                                tile.collision( this._iso.polygon(tile));
                            } 
                            this._iso.place(tile,x,y,layer);
                        }else{
                           
                            tile = Crafty(tile[0]); //select tile if exists
                           
                        }
                        
                        //destroy tiles outside viewport
                        if(!this._iso.contains(tile)){
                            console.log(tile.rect());
                            tile.destroy();
                            
                        }
                        
                        //clear tile
                        tile = null;
                    }
                    
                    //place object tiles
                    if(object < 0){
                        //set layer
                        layer = 2;
                        z = (y+1)*layer;
                        tilename = 'Y'+y+'X'+x+'Z'+z;
                        tile = Crafty(tilename);
                        if(tile.length < 1){ //create object if not exists
                            tile = Crafty.e("2D","DOM",object,tilename);
                            //add colision 
                            // < 0 means disabled 
                            if(collision < 0) { 
                                tile.addComponent("Collision,Solid");
                                tile.collision( this._iso.polygon(tile));
                            } 
                            this._iso.place(tile,x,y,layer);
                        }else{
                            tile = Crafty(tile[0]);
                        }
                        //destroy objects outside viewport
                         if(!tile.intersect(vp)){
                            tile.destroy();
                        }
                          
                        //clear tile
                        tile = null;
                    }
                    //increment counter
                    i++;
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
