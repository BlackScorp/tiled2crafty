$(function(){
    var size = $(window);
    var info = $('#info');
    //Set the stage on fullscreen
    var stage = new Kinetic.Stage({
        container: "game",
        width:size.width(),
        height:size.height()
    });
    
    //Get the tilesets
    var tilesets = frontier_outpost.tilesets;
    var loaded = 0;
    var sprites = {};
    var assets = {};
    //Add Stats.js
    var stats = new Stats();
    info.append(stats.domElement);
    
    //Preload Images
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
    
    //Create spritemaps
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
      
        //Draw map after sprites are created            
        drawMap();
        
    }
    var tiles = {};
    var init = false;
    var drawed = false;
    var countTiles = 0;
    var startX = 20;
    var startY = 20;
   
    var backgroundLayer = new Kinetic.Layer({
        name:'backgrounds'
    }),
    objectLayer = new Kinetic.Layer({
        name:'objects'
    });
            
    //sort tiles on their zIndex
    backgroundLayer.beforeDraw(function(){
        this.children.sort(function(a,b){
            return a.attrs.zIndex-b.attrs.zIndex
        }); 
    });
    objectLayer.beforeDraw(function(){
        this.children.sort(function(a,b){
            return a.attrs.zIndex-b.attrs.zIndex
        }); 
    });
    function drawMap(){
        
     
        //define vars
        var data = frontier_outpost,
        backgroundTiles = data.layers[0].data,
        objectTiles = data.layers[1].data,
        mw = data.width,
        mh = data.height,
        tw = data.tilewidth,
        th = data.tileheight,  
        map = new Kinetic.Isometric(tw,th,mw,mh),
        tile = null,pos=null,name,grid=new Object();
        
        //Center the Stage at location x/y on init
        if(!init)
            map.centerAt(stage,startX,startY);
      
        //Get locations of area within viewport
        var area = map.area(stage,-1);
    
 
        //loop over area in viewport
        
        for(var m in area){
            
            var
            x = area[m][0], //get X
            y = area[m][1], //get Y
            index = y*mw+x, //get Index of array
            background = backgroundTiles[index], //get Background
            object = objectTiles[index],l=0; //get objects
            grid["Y"+y+"X"+x] = true; //set the grid on true, so this location is within viewport
            
            if(background > 0 && sprites[background]){ //if background and sprite exists
                   
                l=1;
                tile = sprites[background]; //get sprite infos
                pos = map.pos2px(x, y); //calculate x/y to top/left position
                name = "Y"+y+"X"+x+"Z1";
                //if tile does not exists
                if(!tiles[name]){
                   
                    //create new Image
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
                        zIndex:pos.top*l,
                        name:name
                    });
                    //add image to layer
                    backgroundLayer.add(image);
                    //save image temporary
                    tiles[name] = image;
                    
                }
              
            
            }
            if(object> 0 && sprites[object]){
   
                l=2;
                tile = sprites[object];
                pos = map.pos2px(x, y);
                name = "Y"+y+"X"+x+"Z2";
           
             
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
                        zIndex:pos.top*l,
                        name:name
                    });
                    
                    objectLayer.add(image);
                  
                    tiles[name] = image;
                }
                
            }
      
              
            tile = null;
            
        }
    //clear map
        //Loop over all tiles
       
        for(var i in tiles){
            name = i.substr(0,i.indexOf('Z')); //remove the Z Part
            var z = i.substr(i.indexOf('Z')+1);
            var t;
            if(!grid[name]){ //if the name is in Grid var
                
                switch(z){
                    case '1':{
                        t = backgroundLayer.get('.'+i);
                        if(t.length>0){
                            
                            backgroundLayer.remove(t[0]);
                            delete tiles[i];
                        }
                        break;
                    }
                    case '2':{
                        t = objectLayer.get('.'+i);
                         if(t.length>0){
                            objectLayer.remove(t[0]);
                         
                            delete tiles[i];
                        }
                        break;
                    }
                }
     
            }
            
        }
        delete grid;
        grid = {};
       
        if(!drawed){
            stage.draw();
        }
     
       
 
        init =true;
        drawed = true;
        var countChildren = 0;
        //count all children of layers
        for(var i in stage.children){
            var c = stage.children[i];
            countChildren += c.children.length;
        }
        info.find('#tiles').text(countChildren);
    }
    stage.add(backgroundLayer);
    stage.add(objectLayer);
    var keyboard = new Kinetic.Keyboard();
 

 
    var speed = {
        x:5,
        y:5
    };
    var globalX = stage.getX(),globalY=stage.getY();
    var update = function(){
        if(!keyboard.isDown()) return;

        if(keyboard.isDown('W') || keyboard.isDown('UP_ARROW')){
            globalY +=speed.y;  
        }
        if(keyboard.isDown('S')|| keyboard.isDown('DOWN_ARROW')){
            globalY -=speed.y;  
        }
        if(keyboard.isDown('D') || keyboard.isDown('RIGHT_ARROW')){
            globalX -=speed.x;  
        }
        if(keyboard.isDown('A')|| keyboard.isDown('LEFT_ARROW')){
            globalX +=speed.x;  
        }
     
    }
    var draw = function(interpolation){
        
        if(!keyboard.isDown()) return;
   
        var x = stage.getX()+globalX;
        var y = stage.getY()+globalY;

        if(keyboard.isDown('W') || keyboard.isDown('UP_ARROW')){
            y +=~~(speed.y*interpolation);  
            stage.setY(y);
        }
        if(keyboard.isDown('S')|| keyboard.isDown('DOWN_ARROW')){
            y -=~~(speed.y*interpolation);  
            stage.setY(y);
        }
        if(keyboard.isDown('D') || keyboard.isDown('RIGHT_ARROW')){
            x -=~~(speed.x*interpolation);  
            stage.setX(x);
        }
        if(keyboard.isDown('A')|| keyboard.isDown('LEFT_ARROW')){
            x +=~~(speed.x*interpolation);  
            stage.setX(x);
        }
     
        console.time("Draw Map")
        drawMap();
        console.timeEnd("Draw Map");
        console.time("Draw Background Layer");
        stage.children[0].draw(); //seperated for performance tests
        console.timeEnd("Draw Background Layer");
        console.time("Draw Object Layer");
        stage.children[1].draw();
        console.timeEnd("Draw Object Layer");
        globalX = 0;
        globalY = 0;
    }
    var lastTime = 0;

    var FPS = 30;
    var skipTicks = 1000/FPS;
    var maxLoops = 5;
    var nextTick = new Date().getTime();
   
    stage.onFrame(function(frame){
        stats.begin();

       
        var loops = 0;
        var currTime = (new Date()).getTime();
        while(currTime > nextTick && loops < maxLoops){
            update();
            nextTick += skipTicks;
            loops++;
              
        }
      
        var inter = Math.min(1,parseFloat(currTime + skipTicks - nextTick) / parseFloat(skipTicks));
         
        if(loops > 0){
            draw(inter);      
        }
       
        stats.end();
    });

    stage.start();
   
  
    size.on("click mousedown",function(e){
        keyboard.preventDefault(e);
    })
    size.on("keydown",function(e){
           keyboard.preventDefault(e);
        keyboard.dispatch(e);
    });
    size.on("keyup",function(e){
           keyboard.preventDefault(e);
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
