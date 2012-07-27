$(function(){
    var size = $(document);
    
    var stage = new Kinetic.Stage({
        container: "game",
        width:800,
        height:600,
        x:0,
        y:0,
        draggable:true
        
    });
    

   
    var tilesets = frontier_outpost.tilesets;
    //  var map = new Kinetic.Tiled(frontier_outpost,stage);
   

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
            console.log(this);
            if(loaded == tilesets.length) {
                //drawMap()
            
            }  
            }
          
            
            
        }
        
        img.src = set.image;
    }
    
    function createSprites(i){
   
        
        var set = tilesets[i];
        var id = set.firstgid;
        var spriteLayer = new Kinetic.Layer();
        for(var y = 0,yl=(set.imageheight/set.tileheight);y<yl;y++){
            for(var x = 0,xl=(set.imagewidth/set.tilewidth);x<xl;x++){
                var sprite = new Kinetic.Image({
                    image:set.img,
                    name:id,
                    width:set.tilewidth,
                    height:set.tileheight,
                    crop:{
                        x:x*set.tilewidth,
                        y:y*set.tileheight,
                        width:set.tilewidth,
                        height:set.tileheight
                    }
                       
                });
                sprite.on("load",function(){
                    console.log("test");
                });
                spriteLayer.add(sprite);
                sprites[id] =sprite;
                id++;
            }   
        }
        stage.add(spriteLayer);
        spriteLayer.draw();
        
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
        tile = null,pos=null;
        stage.add(backgroundLayer);
        stage.add(objectLayer);
      
        for(var y = 0,yl = mh;y<yl;y++){
            for(var x = 0,xl = mw;x<xl;x++){
                var index = y * mh +x,
                background = backgroundTiles[index],
                object = objectTiles[index];
               
                if(background > 0 && sprites[background]){
                    tile = sprites[background];
                    pos = map.pos2px(x, y);
                    tile.attrs.x =pos.left;
                    tile.attrs.y =pos.top-tile.attrs.height;
                    backgroundLayer.add(tile);
                 
                }
                if(object > 0 && sprites[object]){
                    tile = sprites[object];
                    pos = map.pos2px(x, y);
                    tile.attrs.x =pos.left;
                    tile.attrs.y =pos.top-tile.attrs.height;
                    objectLayer.add(tile);
                }
                tile = null;
            }
        }
      //  backgroundLayer.draw();
       //  objectLayer.draw();
    }

   

});
