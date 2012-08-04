$(function(){
    var size = $(window);
    var info = $('#info');
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
    var countTiles = 0;
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
            map.centerAt(stage,10,10);
      
        var area = map.area(stage,-1);
        var grid = {};
        for(var m in area){
            
            var
            x = area[m][0],
            y = area[m][1],
            index = y*mh+x,
            background = backgroundTiles[index],
            object = objectTiles[index],
            collision = collisionTiles[index],l=0;
            grid["Y"+y+"X"+x] = true;
            if(background > 0 && sprites[background]){
                   
                
                tile = sprites[background];
                pos = map.pos2px(x, y);
                name = "Y"+y+"X"+x+"Z1";
                if(!tiles[name]){
                    countTiles++;
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
                        index:y*l,
                        name:name
                    });
                    
                    backgroundLayer.add(image);
                    tiles[name] = image;
                
                }
            
            }
            if(object> 0 && sprites[object]){
   
    
                tile = sprites[object];
                pos = map.pos2px(x, y);
                name = "Y"+y+"X"+x+"Z2";
                if(!tiles[name]){
                    countTiles++;
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
                        index:(y)*l,
                        name:name
                    });
                    
                    objectLayer.add(image);
                  
                    tiles[name] = image;
                }
            }
            if(collision< 0 && sprites[collision]){
                tile = sprites[collision];
                pos = map.pos2px(x, y);
                name = "Y"+y+"X"+x+"Z3";
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
                        index:y,
                        name:name
                    });
                    
                    collisionLayer.add(image);
                    tiles[name] = image;
                }
            }
              
            tile = null;
            
        }
        
        for(var i in tiles){
            name = i.substr(0,i.indexOf('Z'));
            if(!grid[name]){
                
                var t = tiles[i];
                t.parent.remove(t);
                delete tiles[i];
                countTiles--;
            }
            
        }
       
        if(!drawed){
            stage.add(backgroundLayer);
            stage.add(objectLayer);
       
            stage.add(collisionLayer); 
            backgroundLayer.draw();
            objectLayer.draw();
            collisionLayer.draw();
        }
  
        init =true;
        drawed = true;

        info.find('#tiles').text(countTiles);
    }
  
    var keyboard = new Kinetic.Keyboard();
 
    window.requestAnimationFrame = (function(){
        return  window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
    })();
 
    var speed = {
        x:5,
        y:10
    };
    var globalX = 0,globalY=0;
    var update = function(){
        if(!keyboard.isDown()) return; 
        if(keyboard.isDown('W')){
            globalY +=speed.y;  
        }
        if(keyboard.isDown('S')){
            globalY -=speed.y;  
        }
        if(keyboard.isDown('D')){
            globalX -=speed.x;  
        }
        if(keyboard.isDown('A')){
            globalX +=speed.x;  
        }
     
    }
    var draw = function(interpolation){
        
        if(!keyboard.isDown()) return; 
       
        var x = stage.getX()+globalX;
        var y = stage.getY()+globalY;
        
      
       
        if(keyboard.isDown('W')){
            y +=~~(speed.y*interpolation);  
            stage.setY(y);
        }
        if(keyboard.isDown('S')){
            y -=~~(speed.y*interpolation);  
            stage.setY(y);
        }
        if(keyboard.isDown('D')){
            x -=~~(speed.x*interpolation);  
            stage.setX(x);
        }
        if(keyboard.isDown('A')){
            x +=~~(speed.x*interpolation);  
            stage.setX(x);
        }
        
       
        drawMap();
        stage.draw();
        globalX = 0;
        globalY = 0;
    }
    var FPS = 25;
    var SKIP = 1000/FPS;
    var MAX_FRAMES = 5;
    var tick = (new Date()).getTime();
    var frameTime =(new Date()).getTime();
    var frame = 0;
    var fpsText = info.find('#fps');
    var gameLoop = function(){
        requestAnimationFrame(gameLoop);
         var loops = 0;
        var currTime = (new Date()).getTime();
         if(currTime > frameTime){
           fpsText.text(frame);
            frame = 0;
            frameTime += 1000;
        }else{
            frame++;
        }
       
        while(currTime > tick && loops < MAX_FRAMES){
            update();
            tick += SKIP;
            loops++;
        }
        if(loops > 0){
            var interpolation = parseFloat(currTime + SKIP - tick) / parseFloat(SKIP);
            draw(interpolation);
            tick = currTime;
        }
       
    }
    gameLoop();
    
    size.on("keydown",function(e){
        keyboard.dispatch(e);
    });
    size.on("keyup",function(e){
        keyboard.dispatch(e);
    });
 
    size.on("resize",function(){
     
        var size = $(window);
        init = false;
        stage.setWidth(size.width());
        stage.setHeight(size.height());
        drawMap();
        stage.draw();
    })
  
   

});
