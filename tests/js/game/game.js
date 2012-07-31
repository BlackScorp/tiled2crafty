$(function(){
    var size = $(window);
    
    var stage = new Kinetic.Stage({
        container: "game",
        width:size.width(),
        height:size.height(),
        draggable:true
        
    });
    var tilesets = frontier_outpost.tilesets;
    var loaded = 0;
    var sprites = {};
    var assets = {};
    for(var i = 0,il = tilesets.length;i<il;i++){
        var set = tilesets[i];
        
        var img = new Image();
        img.onload = function(){

            if(++loaded >= tilesets.length) {
                createSprites();  
            }     
        }
        
        img.src = set.image;
    }
    
    function createSprites(){
        for(var i = 0,il = tilesets.length;i<il;i++){
            
            var set = tilesets[i];
            var id = set.firstgid;
           
            if(!assets[set.image]){
                var img  = new Image();
                img.src = set.image;
                assets[set.image] = img;
               
            }
            
            for(var y = 0,yl=(set.imageheight/set.tileheight);y<yl;y++){
                for(var x = 0,xl=(set.imagewidth/set.tilewidth);x<xl;x++){
         
                    var offset = set.offset || {
                        x:0,
                        y:0
                    }
              
                    
                    sprites[id] ={
                        img:assets[set.image],
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
        }
      
                    
        drawMap();
        
    }
    var tiles = {};
    var init = false;
    var drawed = false;
    function drawMap(){
        
        if(!drawed){
            var backgroundLayer = new Kinetic.Layer(),
            objectLayer = new Kinetic.Layer(),
            collisionLayer = new Kinetic.Layer();
       
        }else{
            
            backgroundLayer = stage.children[0];
            objectLayer = stage.children[1];
            collisionLayer = stage.children[2];
        }
        var data = frontier_outpost,
        backgroundTiles = data.layers[0].data,
        objectTiles = data.layers[1].data,
        collisionTiles = data.layers[2].data,
        mw = data.width,
        mh = data.height,
        tw = data.tilewidth,
        th = data.tileheight,  
        map = new Kinetic.Isometric(tw,th,mw,mh),
        tile = null,pos=null,name;
        if(!init)
            map.centerAt(stage,32,32);
      
        var area = map.area(stage,2);
        for(var m in area){
            
            var
            x = area[m][0],
            y = area[m][1],
            index = y*mh+x,
            background = backgroundTiles[index],
            object = objectTiles[index],
            collision = collisionTiles[index],l=0;
             
            if(background > 0 && sprites[background]){
                   
                l = 1;
                tile = sprites[background];
                pos = map.pos2px(x, y);
                name = "Y"+y+"X"+x+"Z"+l;
                if(!tiles[name]){
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
                        index:pos.top*l,
                        name:name
                    });
                    
                    backgroundLayer.add(image);
                    tiles[name] = image;
                }
            
            }
            if(object> 0 && sprites[object]){
                l=2;
    
                tile = sprites[object];
                pos = map.pos2px(x, y);
                name = "Y"+y+"X"+x+"Z"+l;
                if(!tiles[name]){
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
                        index:pos.top*l,
                         name:name
                    });
                    
                    objectLayer.add(image);
                    tiles[name] = image;
                }
            }
            if(collision< 0 && sprites[collision]){
                l=3;
    
                tile = sprites[collision];
                pos = map.pos2px(x, y);
                name = "Y"+y+"X"+x+"Z"+l;
                if(!tiles[name]){
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
                        index:pos.top*l,
                         name:name
                    });
                    
                    collisionLayer.add(image);
                    tiles[name] = image;
                }
            }
              
            tile = null;
            
        }
        if(!drawed){
            stage.add(backgroundLayer);
            stage.add(objectLayer);
       
            //  stage.add(collisionLayer); 
        }
      
     
        backgroundLayer.draw();
        objectLayer.draw();
          //  collisionLayer.draw();
    
        init =true;
        drawed = true;
        console.log(backgroundLayer);
    }
    size.on("resize",function(){
     
        var size = $(window);
        init = false;
        stage.setWidth(size.width());
        stage.setHeight(size.height());
        drawMap();
        stage.draw();
    })
    .on("mouseup",function(){
        
        drawMap();
    });;
   

});
