$(function(){
    var size = $(document);
    
    var stage = new Kinetic.Stage({
        container: "game",
        width:800,
        height:600,
        x:-896,
        y:-256,
        draggable:true
        
    });
    

   
    var tilesets = frontier_outpost.tilesets;
 
   

    var loaded = 0;
    var sprites = {};
    for(var i = 0,il = tilesets.length;i<il;i++){
        var set = tilesets[i];
        var img = new Image();
        img.onload = function(e){
            if(this.complete){
                tilesets[loaded].img = this;
                createSprites(loaded);
                loaded++;
               
                if(loaded == tilesets.length) {
                    drawMap()
            
                }  
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
                var sprite = new Kinetic.Image({
                    image:set.img,
                    name:id,
                    width:set.tilewidth,
                    height:set.tileheight,
                    crop:{
                        x:(x*set.tilewidth),
                        y:(y*set.tileheight),
                        width:set.tilewidth,
                        height:set.tileheight
                    },
                    x:(x*set.tilewidth),
                    y:(y*set.tileheight)
                       
                });

                // spriteLayer.add(sprite);
                sprites[id] =sprite;
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
        tw = data.tileheight,
        th = data.tilewidth,  
        map = new Kinetic.Isometric(tw,th,mw,mh),
        tile = null,pos=null,index = 0;
        stage.add(backgroundLayer);
        stage.add(objectLayer);
        
        for(var y = 0,yl = mh/4;y<yl;y++){
            for(var x = 0,xl = mw/4;x<xl;x++){
                var
                background = backgroundTiles[index],
                object = objectTiles[index],l=0;
                
                if(background > 0 && sprites[background]){
                    l = 1;
                    tile = sprites[background];
                    pos = map.pos2px(x, y);
                    tile.attrs.pos = {
                        x:x,
                        y:y
                    };
               
                 
                    backgroundLayer.add(tile);
                    tile.setX(pos.left);
                    tile.setY(pos.top-tile.getHeight());
                    tile.setZIndex(pos.top*l);
                }
                if(object > 0 && sprites[object]){
                    l=2;
                    tile = sprites[object];
                    pos = map.pos2px(x, y);
                    tile.attrs.pos = {
                        x:x,
                        y:y
                    };
                 
                 
                    objectLayer.add(tile);
                    tile.setX(pos.left);
                    tile.setY(pos.top-tile.getHeight());
                    tile.setZIndex(pos.top*l);
                }
              
                tile = null;
                index++;
            }
        }
        backgroundLayer.draw();
        objectLayer.draw();
        console.log(backgroundLayer.children[0]);
    }

   

});
