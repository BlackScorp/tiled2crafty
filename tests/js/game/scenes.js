Crafty.scene("Loading",function(){
    
    });

Crafty.scene("FrontierOutpost",function(){
    
    //Get Background Tiles
    var backgrounds = frontier_outpost2.layers[0].data; 
    //Get Object Tiles
    var objects = frontier_outpost2.layers[1].data;
    //Get Collision Tiles
    var collisions = frontier_outpost2.layers[2].data;
    //Get Map Metadata;
    var map = frontier_outpost2;

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
    //var bg = Crafty.e("IsoLayer"); //Create Background entity
      
  var counter =$('#counter').text("Amount of Tiles: 0");
    
    player.bind("Moved",function(from){
        var pos = iso.px2pos(this.x+this.w/2,this.y+this.h);
        pos.x = ~~pos.x;
        pos.y = ~~pos.y;
           //calculate index of tile
        var i = pos.y * mh + pos.x;
  
        //check if the tile is solid
        if(collisions[i] > 0) {
            this.x = from.x;
            this.y = from.y;
        }
        Crafty.background('url("img/frontier_outpost.png") '+(Crafty.viewport.x+32)+'px '+(Crafty.viewport.y-32)+'px  #000');
        this.z = (this.y+this.h) * 2;
        //If player coordiantes didnt changed return
        if(this.position.x == pos.x || this.position.y == pos.y) return;
      
        //update player coordiantes
        this.position.x = pos.x;
        this.position.y = pos.y;
        
        //update map
        // bg.render();
        renderObjects();
    });
   
    var renderObjects = function(){
        var area = iso.area();
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
                }
                //clear tile
                tile = null;
            }
                    
              
        }
        //Clearing up the objects
       
        var vp = Crafty.viewport.rect(); //get Rect of viewport
        Crafty("Tile").each(function () {
            if (!this.intersect(vp._x-128,vp._y-128,vp._w+128,vp._h+128) && Crafty("Tile").length > 200) this.destroy();
        });
        counter.text( "Amount of Tiles: "+Crafty("Tile").length);
         
    };  
    //Testing prerender
    var renderBg = function(){
        var i = 0;

       
        for(var y = 0;y<mh;y++){
            
            for(var x = 0;x<mw;x++){
                i = y * mh+x;
                var background = backgrounds[i],tile=null; //get Background image
                if(background > 0){
                    tile = Crafty.e(background); //Create Tile
                    iso.place(tile,x,y); //calculate tile positions
                    bg.addTile(tile.cacheCanvas,tile.x,tile.y); //Draw tile to offscreen
                    tile.destroy(); //Destroy object
                }
                
              
            }
                
            
        }
      bg.render(); //Draw offscreen into stage
      
    }
    
   // renderBg(); 
    renderObjects();
 
    
});
