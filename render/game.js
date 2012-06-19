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
    iso.centerAt(32,32);
 /*tile = Crafty.e("2D","DOM",144,"Collision","WiredHitBox");
 tile.collision(iso.polygon(tile));
 iso.place(tile,0,0,1);
  tile = Crafty.e("2D","DOM",241,"Collision","WiredHitBox");
 tile.collision(iso.polygon(tile));
  iso.place(tile,0,1,2); */
    //get locations within the view
    var area = iso.area();
    //Rendering
    for(var y = area.y.min;y<area.y.max;y++){
        //Setup the tile counter
        var i = y * mh; 
        for(var x = area.x.min;x<area.x.max;x++){
            var object = objects[i], //get current object
            collision = collisions[i], //get current collision
            background = backgrounds[i], //get current background
            tile = null; //initialize tile
            
            //place background tiles
            if(background > 0){
                tile = Crafty.e("2D","DOM",background);
                //add colision 
                if(collision > 0) {
                    tile.addComponent("Collision,Solid");
                    tile.collision(iso.polygon(tile));
                } 

                iso.place(tile,x,y,1);
               
            }
            //place object tiles
            if(object > 0){
                tile = Crafty.e("2D","DOM",object);
                //add colision 
                if(collision > 0) {
                    tile.addComponent("Collision,Solid");
                    tile.collision(iso.polygon(tile));
                } 
                iso.place(tile,x,y,2); 
          
            }
            i++;
        }
      
    }
    
   
    Crafty.bind("KeyDown",function(e){
        this._isDown = true;
        this._keyCode = e.keyCode;
     
    })
    Crafty.bind("KeyUp",function(e){
        this._isDown = false;
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
