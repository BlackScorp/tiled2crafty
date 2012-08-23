var Map = function(stage,x,y){
    this.stage = stage;
    this.x = x;
    this.y = y;
    this.tilesets = {};
    this.map = null;
    this.tiles = {};
    this.grid = {};
    this.layers = {};
    this.keyboard = new Kinetic.Keyboard();
    this.gameDiv = $('#game');
    this.moved = {
        x:0,
        y:0
    };
}
Map.prototype.setKeyboard = function(keyboard){
    this.keyboard = keyboard;
}
Map.prototype.draw = function(){
    if(!this.map) return;
    this.layers['background'].draw();
    this.layers['object'].draw();
}
Map.prototype.resetArea =  function(){
    this.map.centerAt(this.stage,this.x,this.y);
}
Map.prototype.load = function(level){
    var map = this;
    $.ajax({
        url:"js/maps/"+level,
        success:function(data){
            map.data = data;
            map.init();
        }
    });
}

Map.prototype.update = function(frame){
    
   
            var bg = this.drawLayer('background');
                    bg.drawBuffer();
         var obj = this.drawLayer('object');
                    obj.drawBuffer();
                       
                
    //this.drawLayer('object');
    //this.draw();
    this.clear();
}
Map.prototype.init = function(){
    $('#info').show();
         var stats = new Stats();
      $('#fps').append(stats.domElement);
    stats.begin();
    this.createLayers();
    this.createTilesets();
    this.createMap();
    this.resetArea();
    var background = this.drawLayer('background');
    var objects = this.drawLayer('object');
    this.draw();
    this.clear();
    var map = this;
    var speed = 2;
    var backgroundAnim = new Kinetic.Animation({
        func:function(frame){
            
                
         
                var velocity = speed+~~(speed*frame.timeDiff/1000);
             
                map.stage.attrs.x += velocity;
                map.update(frame);
           
              
                
               stats.update();
         
            
       
        },
        node:background
    });
    var objectsAnim = new Kinetic.Animation({
        func:function(frame){
          
                
   
                var velocity = speed+~~(speed*frame.timeDiff/1000);
             
                map.stage.attrs.x += velocity;
                
               
                    map.update();
                 
               
               stats.update();
              
            
       
        },
        node:objects
    });
    backgroundAnim.start();
    objectsAnim.start();
    this.gameDiv.on('keyup keydown',function(e){
         
       
        map.keyboard.dispatch(e); 
    });
}
Map.prototype.clear = function(){
    for(var i in this.tiles){
        var t = this.tiles[i];
        if(!this.grid[i]){ 
            t.attrs.visible = false;
        }else{
            t.attrs.visible = true;
        }
            
    }
    this.grid = {};
}
Map.prototype.drawLayer = function(name){
    var area = this.map.area(this.stage,1);
    var layer = this.layers[name];
    
  
    
    for(var m in area){
            
        var x = area[m][0], //get X
        y = area[m][1], //get Y
        index = y*this.map._map.width+x, //get Index of array
        z=layer.index+1,image=null,pos,name,
        tile = layer.attrs.data[index]; //get objects
         
        if(tile > 0 && this.tilesets[tile]){
         
            z++;
            tile = this.tilesets[tile]; //get sprite infos
            pos = this.map.pos2px(x, y); //calculate x/y to top/left position
            name = "Y"+y+"X"+x+"Z"+z;
            
            this.grid[name] = true;
                     
            if(!this.tiles[name]){
                   
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
                    zIndex:pos.top*z,
                    name:name
                });
                layer.add(image);
                this.tiles[name] = image;
            }
        }   
    }

    return layer;
}
Map.prototype.createLayers = function(){

    for(var l=0,ll=this.data.layers.length;l<ll;l++){
        var layer = this.data.layers[l];
        var data = layer.data || [];
     
        this.layers[layer.name]= new Kinetic.Staticlayer({
            name:layer.name,
            data:data,
            visible:layer.visible,
            listening:false
        });
        if(data.length > 0){
            this.layers[layer.name].beforeDraw(function(){
                this.children.sort(function(a,b){
                    return a.attrs.zIndex-b.attrs.zIndex;
                })
            });
        }
      
        this.stage.add( this.layers[layer.name]);
    }

}

Map.prototype.createTilesets = function(){

    for(var t = 0,tl = this.data.tilesets.length;t<tl;t++){
        var set = this.data.tilesets[t];   
        if(Kinetic.Assets[set.name]){           
            var id = set.firstgid;
            for(var y = 0,yl=(set.imageheight/set.tileheight);y<yl;y++){
                for(var x = 0,xl=(set.imagewidth/set.tilewidth);x<xl;x++){
                    var offset = set.tileoffset || {
                        x:0,
                        y:0
                    } 
                    this.tilesets[id] ={
                        img:Kinetic.Assets[set.name],
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
    }
 

}

Map.prototype.createMap = function(){
    if(this.data.orientation === "isometric"){
        var mw = this.data.width,
        mh = this.data.height,
        tw = this.data.tilewidth,
        th = this.data.tileheight;
        this.map = new Kinetic.Isometric(tw, th, mw, mh);
       
    }
   
}

