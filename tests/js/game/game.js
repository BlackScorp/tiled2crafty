$(function(){
    var size = $(document);
    
    var stage = new Kinetic.Stage({
        container: "game",
        width:size.width(),
        height:size.height(),
        x:-2048,
        y:-512,
        draggable:true
        
    });
    

   
    var tilesets = frontier_outpost.tilesets;
 
   

    var loaded = 0;
    var sprites = {};
    for(var i = 0,il = tilesets.length;i<il;i++){
        var set = tilesets[i];
        
        var img = new Image();
        img.onload = function(e){
           
            tilesets[loaded].img = this;
            createSprites(loaded);
            if(++loaded >= tilesets.length) {
                drawMap()
            
            }  
            
          
            
            
        }
        
        img.src = set.image;
    }
    
    function createSprites(i){
   
        
        var set = tilesets[i];
    
        var id = set.firstgid;
        //var spriteLayer = new Kinetic.Layer();
        for(var y = 0,yl=(set.imageheight/set.tileheight);y<yl;y++){
            for(var x = 0,xl=(set.imagewidth/set.tilewidth);x<xl;x++){
         
                var offset = set.offset || {
                    x:0,
                    y:0
                }

                // spriteLayer.add(sprite);
                sprites[id] ={
                    img:set.img,
                    x:(x*set.tilewidth),
                    y:(y*set.tileheight),
                    width:set.tilewidth,
                    height:set.tileheight,
                    offset:{
                        x:-offset.x,
                        y:-offset.y
                    }
                };
                id++;
            }   
        }
      
    //stage.add(spriteLayer);
    // spriteLayer.draw();
        
    }
    function drawMap(){
        
        var backgroundLayer = new Kinetic.Layer(),
        objectLayer = new Kinetic.Layer(),
        data = frontier_outpost,
        backgroundTiles = data.layers[0].data,
        objectTiles = data.layers[1].data,
        collisionTiles = data.layers[2].data,
        mw = data.width,
        mh = data.height,
        tw = data.tilewidth,
        th = data.tileheight,  
        map = new Kinetic.Isometric(tw,th,mw,mh),
        tile = null,pos=null;
       
        for(var y = 0,yl = mh;y<yl;y++){
            for(var x = 0,xl = mw;x<xl;x++){
                var index = y*mh+x,
                background = backgroundTiles[index],
                object = objectTiles[index],l=0;
                
                if(background > 0 && sprites[background]){
                    l = 1;
                    tile = sprites[background];
                    pos = map.pos2px(x, y);
                   
                    var image = new Kinetic.Image({
                        x: pos.left,
                        y:pos.top-tile.height,
                        image: tile.img,
                        width: tile.width,
                        height: tile.height,
                        crop:{
                            x:tile.x,
                            y:tile.y,
                            width:tile.width,
                            height:tile.height
                        },
                        offset :tile.offset,
                        index:pos.top*l
                    });
                    
                    
                    backgroundLayer.add(image);
            
                }
                if(object> 0 && sprites[object]){
                    l=2;
    
                    tile = sprites[object];
                    pos = map.pos2px(x, y);
                    image = new Kinetic.Image({
                        x: pos.left,
                        y:pos.top-tile.height,
                        image: tile.img,
                        width: tile.width,
                        height: tile.height,
                        crop:{
                            x:tile.x,
                            y:tile.y,
                            width:tile.width,
                            height:tile.height
                        },
                        offset :tile.offset,
                        index:pos.top*l
                    });
                    
                    objectLayer.add(image);
               
                }
              
                tile = null;
            
            }
        }
         stage.add(backgroundLayer);
        stage.add(objectLayer);
       
        backgroundLayer.draw();
      
        objectLayer.draw();
   
    }

   

});
