$(function(){
    //Init Crafty
    Crafty.init(640,480);
    //Init Canvas
    Crafty.canvas.init();
    

    //Setup background color
    Crafty.background("#000");
     

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
            this._iso.centerAt(10,10);
            this.bind("UpdateMap",function(){
                this.drawMap();
            })
        
        },
        drawMap:function(){
            this._iso._updateViewport();
            
            //Convert Data to Integers
            var mw = parseInt(this._map.width);
            var mh = parseInt(this._map.height);
    
            //Rendering
            for(var y = 0;y<mw;y++){
                //Setup the tile counter
                var i = y * mh; 
                for(var x = 0;x<mh;x++){
                    var object = this._objects[i], //get current object
                    collision =  this._collisions[i], //get current collision
                    background =  this._tiles[i], //get current background
                    tile = null,//initialize tile
                    layer = 1; //initialize layer
            
                    //place background tiles
                    if(background > 0){
                        tile = Crafty("Y"+y+"X"+x+"L"+(y+1)*layer);
                
                        if(tile.length == 0){
                            tile = Crafty.e("2D","Text","DOM",background,"Y"+y+"X"+x+"L"+(y+1)*layer);
                            //add colision 
                            if(collision < 0) {
                                tile.addComponent("Collision,Solid");
                                tile.collision( this._iso.polygon(tile));
                            } 
                             this._iso.place(tile,x,y,layer);
                        }else{
                            tile = Crafty(tile[0]);
                        }
                        if(!tile.intersect(this._iso.viewport())){
                            tile.destroy();
                        }
                
               
                    }
                    //set layer
                    layer = 2;
                    //place object tiles
                    if(object> 0){
                        tile = Crafty("Y"+y+"X"+x+"L"+(y+1)*layer);
                        if(tile.length == 0){
                            tile = Crafty.e("2D","DOM",object,"Y"+y+"X"+x+"L"+(y+1)*layer);
                            //add colision 
                            if(collision > 0) {
                                tile.addComponent("Collision,Solid");
                                tile.collision( this._iso.polygon(tile));
                            } 
                             this._iso.place(tile,x,y,layer);
                        }else{
                            tile = Crafty(tile[0]);
                        }
                        if(!tile.intersect(this._iso.viewport())){
                            tile.destroy();
                        }
                    }
                    i++;
                }
      
            }
        }
    }
    );
    
    var map = Crafty.e("FrontierOutpost");
    map.trigger("UpdateMap");
    Crafty.bind("KeyDown",function(e){
        this._isDown = true;
        this._keyCode = e.keyCode;
     
    })
    Crafty.bind("KeyUp",function(e){
        this._isDown = false;
        map.trigger("UpdateMap");
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
