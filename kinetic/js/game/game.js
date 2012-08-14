$(function(){
    var size = $(window);
    var info = $('#info');
    //Set the stage on fullscreen
    var stage = new Kinetic.Stage({
        container: "game",
        width:800,
        height:600
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
        updateMap();
        
    }
    var tiles = {};
    var init = false;
    var drawed = false;
    var countTiles = 0;
    var startX = 30;
    var startY = 30;
   
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
  
    //define vars
    var data = frontier_outpost,
    backgroundTiles = data.layers[0].data,
    objectTiles = data.layers[1].data,
    mw = data.width,
    mh = data.height,
    tw = data.tilewidth,
    th = data.tileheight,  
    map = new Kinetic.Isometric(tw,th,mw,mh),
    tile = null,pos=null,name,grid={};
    function updateMap(){
        
     
  
        
        //Center the Stage at location x/y on init
        if(!init)
            map.centerAt(stage,startX,startY);
      
        //Get locations of area within viewport
        var area = map.area(stage,1);
            
        //loop over area in viewport
        console.time("Add Images");
        for(var m in area){
            
            var
            x = area[m][0], //get X
            y = area[m][1], //get Y
            index = y*mw+x, //get Index of array
            background = backgroundTiles[index], //get Background
            object = objectTiles[index],l=0; //get objects
            
            
            if(background > 0 && sprites[background]){ //if background and sprite exists
                    
                l=1;
                tile = sprites[background]; //get sprite infos
                pos = map.pos2px(x, y); //calculate x/y to top/left position
                name = "Y"+y+"X"+x+"Z1";
                        grid[name] = true; //set the grid on true, so this location is within viewport
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
                 
            if(object > 0 && sprites[object]){ //if background and sprite exists
                    
                l=2;
                tile = sprites[object]; //get sprite infos
                pos = map.pos2px(x, y); //calculate x/y to top/left position
                name = "Y"+y+"X"+x+"Z2";
                grid[name] = true; //set the grid on true, so this location is within viewport
                //if tile does not exists
                if(!tiles[name]){
                   
                    //create new Image
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
                    //add image to layer
                    objectLayer.add(image);
                    //save image temporary
                    tiles[name] = image;   
                }  
            } 
            tile = null;
            
        }
        console.timeEnd("Add Images");
        
        //clear map
        //Loop over all tiles
        console.time("Show/Hide Tiles");
        for(var i in tiles){
            var t = tiles[i];
            if(!grid[i]){ //if the name is in Grid var
                t.attrs.visible = false;
            }else{
                //here i need to delete it
                t.attrs.visible = true;
            }
            
        }
      
        console.timeEnd("Show/Hide Tiles");
        delete grid;
        grid = {};
        
        if(!init){
            backgroundLayer.draw();
            objectLayer.draw(); 
        }
        init =true;
  
      
        info.find('#bg').text(backgroundLayer.children.length);
        info.find('#obj').text(objectLayer.children.length);
    }
 
    stage.add(backgroundLayer);
    stage.add(objectLayer);
    var keyboard = new Kinetic.Keyboard();
    var speed = {
        x:3,
        y:3
    };
   
    var updateStage = function(delta){
       
        if(keyboard.isDown('W') || keyboard.isDown('UP_ARROW')){
   
            stage.attrs.y +=~~(speed.y*delta); 
        }
        if(keyboard.isDown('S')|| keyboard.isDown('DOWN_ARROW')){

            stage.attrs.y -=~~(speed.y*delta); 
        }
        if(keyboard.isDown('D') || keyboard.isDown('RIGHT_ARROW')){

            stage.attrs.x -=~~(speed.x*delta); 
        }
        if(keyboard.isDown('A')|| keyboard.isDown('LEFT_ARROW')){
   
            stage.attrs.x +=~~(speed.x*delta); 
        }
     
    }
  

  

    var FPS = 30;
    var skipTicks = 1000/FPS;
    var maxLoops = 5;
    var nextTick = new Date().getTime();
    stats.begin();
    stage.onFrame(function(frame){
       
        var loops = 0,inter = 0;
        while((new Date()).getTime() > nextTick && loops < maxLoops){
            updateStage(1);
            nextTick +=skipTicks;
            loops++;
        }
        inter = Math.max(1,((new Date()).getTime() + skipTicks - nextTick) / skipTicks);
  
        
         
        if(keyboard.isDown())  {
            console.time("Update Stage Position")
            updateStage(inter);
            console.timeEnd("Update Stage Position")
            console.time("Update Map Images")
            updateMap();
            console.timeEnd("Update Map Images")
            console.time("Draw Background Layer")
            backgroundLayer.draw();
            console.timeEnd("Draw Background Layer")
            console.time("Draw Object Layer")
            objectLayer.draw(); 
            console.timeEnd("Draw Object Layer")
        }
           
        
        
        stats.update();
        
    });
    stats.end();
    stage.start();

   
  
    size.on("click mousedown",function(e){
        keyboard.preventDefault(e);
    })
    size.on("keydown keyup",function(e){
        keyboard.preventDefault(e);
        keyboard.dispatch(e);
    });
    size.on("focusout",function(e){
        alert("test");
    });
 
    size.on("resize",function(){
        return true;
        var size = $(window);
        init = false;
        stage.setWidth(size.width());
        stage.setHeight(size.height());
        drawMap();
    })
  
   

});
