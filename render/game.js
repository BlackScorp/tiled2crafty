$(function(){
    //Init Crafty
    Crafty.init(640,480);
    //Init Canvas
    Crafty.canvas.init();
    
    //Setup background color
    // Crafty.background("#000");
     
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
    
    //Init Isometric
    var iso = Crafty.diamondIso.init(tw,th,mw,mh);
  

    //Center Viewport at Position
    iso.centerAt(10,10);
    /*tile = Crafty.e("2D","DOM",144,"Collision","WiredHitBox");
 tile.collision(iso.polygon(tile));
 iso.place(tile,0,0,1);
  tile = Crafty.e("2D","DOM",241,"Collision","WiredHitBox");
 tile.collision(iso.polygon(tile));
  iso.place(tile,0,0,2); */
    //get locations within the view
    var area = iso.area();
    Crafty.bind("RenderMap",function(){
        iso._updateViewport();
        //Rendering
        
        for(var y = 0;y<mw;y++){
            //Setup the tile counter
            var i = y * mh; 
            for(var x = 0;x<mh;x++){
                var object = objects[i], //get current object
                collision = collisions[i], //get current collision
                background = backgrounds[i], //get current background
                tile = null,//initialize tile
                layer = 1; //initialize layer
            
                //place background tiles
                if(background > 0){
                    tile = Crafty("Y"+y+"X"+x+"L"+(y+1)*layer);
                
                    if(tile.length == 0){
                        tile = Crafty.e("2D","Text","DOM",background,"Y"+y+"X"+x+"L"+(y+1)*layer);
                        //add colision 
                        if(collision > 0) {
                            tile.addComponent("Collision,Solid");
                            tile.collision(iso.polygon(tile));
                        } 
                        iso.place(tile,x,y,layer);
                    }else{
                        tile = Crafty(tile[0]);
                    }
                    if(!tile.intersect(iso.viewport())){
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
                            tile.collision(iso.polygon(tile));
                        } 
                        iso.place(tile,x,y,layer);
                    }else{
                        tile = Crafty(tile[0]);
                    }
                    if(!tile.intersect(iso.viewport())){
                        tile.destroy();
                    }
                }
                i++;
            }
      
        }
    });
    Crafty.trigger("RenderMap");
    Crafty.bind("KeyDown",function(e){
        this._isDown = true;
        this._keyCode = e.keyCode;
     
    })
    Crafty.bind("KeyUp",function(e){
        this._isDown = false;
         Crafty.trigger("RenderMap");
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
