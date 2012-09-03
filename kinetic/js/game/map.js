var Map = function(stage){
    this._stage = stage;
    //Isometric Map
    this._map = null;
    //Sprite Data
    this._sprites = {};
    //Initial Center Location
    this._x = 0;
    this._y = 0;
    //Drawn Layers
    this._layers = [];
    //Drawn Tiles
    this._tiles = {};
    //Viewport
    this._vp = null; 
    
    //Lazy vars
    var w = this._stage.attrs.width;
    var h = this._stage.attrs.height;
    //Define offset for Viewport
    this._offset = {
        top:~~(h/2),
        right:~~(w/2),
        bottom:~~(h/2),
        left:~~(w/2)
    };
    //Define cache canvas size
    this._cache = {
        width:this._offset.left+this._offset.right+w,
        height:this._offset.top+this._offset.bottom+h
    }
}

Map.prototype = {
    _data:null,
    //Main function to draw the map
    draw:function(){
        //If map is not initialized, return
        if(!this._map) return true;
        //If there is no viewport or the viewport is not within the stage
        if(!this._vp || !this._stageWithinViewport()){
        //Update layer
           
        //console.time("UpdateMap");
        //   this._updateLayers();
        // console.timeEnd("UpdateMap");
       
        } 
    //draw Layer
    // console.time("DrawMap");
    //this._drawLayers(); 
    // console.timeEnd("DrawMap");
      
    },
    //Initial Function, loads json file and initialize Map
    load:function(config){
        var map = this;
        this._x = config.x;
        this._y = config.y;
        $.ajax({
            url:"js/maps/"+config.map+'.json',
            success:function(data){
                //Save the data
                map._setData(data);
                
                map._init();
                map._initLayers();
                map._loadImages();
            }
        });
    },
    _setData:function(data){
        this._data = data;
    },
    _init:function(){
        var d = this._data,
        mw = d.width,mh=d.height,tw=d.tilewidth,th=d.tileheight;
        if(d.orientation === 'isometric'){
            //Create new Isometric Helper
            this._map = new Kinetic.Isometric(tw, th, mw, mh);   
        }
        
      
        //Center the stage at position x/y
        var pos = this._map.pos2px(this._x,this._y); //calculate position 2 pixel
       
        //set center position of stage
        this._stage.attrs.x = -pos.left+this._stage.attrs.width/2-tw/2; 
        this._stage.attrs.y = -pos.top+this._stage.attrs.height/2;
       
      

    },
    //Function to create layers
    _initLayers:function(){
        //Loop throught layers
        for(var i = 0,il = this._data.layers.length;i<il;i++){
            var l = this._data.layers[i];
            //If the layer is a tile layer
            if(l.type === "tilelayer"){
                //Create new layer
                var layer = new Kinetic.Layer({
                    listening:false,
                    name:l.name,
                    data:l.data,
                    visible:l.visible
                });
                //if layer is visible
                if(l.visible){
                    //Create a cache Canvas
                    var cache =new Kinetic.Canvas(this._cache.width,this._cache.height);
                    cache.name = 'cache';
                    //add chacheCanvas to layer
                    layer.cacheCanvas = cache;
                    $('#cache').append(cache.getElement());
                    //sort the children before Draw
                    layer.beforeDraw(function(){
                        this.children.sort(function(a,b){
                            return a.attrs.zIndex - b.attrs.zIndex;
                        }); 
                        this.cacheCanvas.clear();
                    });
                    var map = this;
                    layer.drawCache = function(){ 
                        if(!map._vp) return
                   
                        var y = -map._vp.t - map._stage.attrs.y+map._offset.top,
                        x = -map._vp.l - map._stage.attrs.x+map._offset.left,
                        w = map._stage.attrs.width,h = map._stage.attrs.height;
                        if(x < 0) x= 0;
                        if(y < 0) y = 0;
                        this.getCanvas().clear();
                        //Draw the part of cached Canvas into layer canvas
                        this.getContext().drawImage(this.cacheCanvas.getElement(),x,y,w,h,0,0,w,h);  
                    }
                    
                    layer.updateCache = function(){
                        
                        //draw children into cacheCanvas
                        this.draw(this.cacheCanvas);
                      
                   
                    }
                    //create new array of visible layers
                    this._layers.push(layer);
                }
                //add layers to stage
                this._stage.add(layer);     
            }
         
        }
        
    },
    //Function to load images
    _loadImages:function(){
    
        var map = this;
        //create sprites and get images to load from json file
        var loader = new Kinetic.Loader(this._createSprites());
        loader.onError(function(data){
          
            });
        loader.onProgress(function(data){
           
            });
        loader.onComplete(function(){
            //draw map
            //map.draw();
            map._updateLayers();
           
        });
        //start loading
        loader.load();
    },
    //Function to create sprites array
    _createSprites:function(){
        var images = [];
        
        for(var i =0,il = this._data.tilesets.length;i<il;i++){
            var tileset = this._data.tilesets[i],id=tileset.firstgid;
            for(var y = 0,yl = tileset.imageheight;y<yl;y+=tileset.tileheight){
                for(var x = 0,xl = tileset.imagewidth;x<xl;x+=tileset.tilewidth){
                    
                    //default offset
                    var offset = {
                        x:0,
                        y:0
                    };
                    //overwrite offset if set
                    if(tileset.tileoffset){
                        offset.x = -tileset.tileoffset.x;
                        offset.y = -tileset.tileoffset.y;
                    }
                    //create sprite object
                    this._sprites[id] = {
                        name:tileset.name,
                        x:x,
                        y:y,
                        width:tileset.tilewidth,
                        height:tileset.tileheight,
                        offset:offset
                    };
                    id++;
                } 
            }
            //push images to load
            images.push({
                src:tileset.image,
                id:tileset.name
            });
           
        }
        return images;
    },
    _drawLayers:function(){
        //loop throught visible layers and draw part of chacecanvas into screencanvas
        for(var l = 0,ll = this._layers.length;l<ll;l++){
            this._layers[l].drawCache();
        }
      
    },
    _updateLayers:function(){
      console.time("UpdateLayers");
        var width = this._stage.attrs.width,height = this._stage.attrs.height,o = this._offset;
        var x = -this._stage.attrs.x,y=-this._stage.attrs.y;
        this._vp = {
            x:x,
            y:y,
            w:width,
            h:height
        };
        console.log(this._vp,x);
        //set the viewport
        this._map.setViewport(this._vp);
      
        //get area of viewport
        var area = this._map.area(),mw=this._data.width,i=0;
  
        //loop throught elements
        for(var a = 0,al = area.length;a<al;a++){
            x = area[a][0]; //get x
            y = area[a][1]; //get y
            i = y*mw+x; //get index
            //loop throught visible layers
            for(var l = 0,ll = this._layers.length;l<ll;l++){
                
                var layer = this._layers[l],id = layer.attrs.data[i],tile = this._sprites[id];
                //if sprite not exists or sprite id = 0 continue to next layer
                if(id < 1 || !tile) continue;
                
                //create individual tile name
                var name = "Y"+y+"X"+x+"Z"+(l+1);

                var pos = this._map.pos2px(x,y);
                var image = new Kinetic.Image({
                    x: pos.left,
                    y:pos.top-tile.height,
                    image: Kinetic.Assets[tile.name],
                    width: tile.width,
                    height: tile.height,
                    crop:{
                        x:tile.x,
                        y:tile.y,
                        width:tile.width,
                        height:tile.height
                    },
                    offset :tile.offset,
                    zIndex:pos.top*(l+1),
                    name:name
                });
                  
                //add image to layer
                layer.add(image);
              
               
            }
        }
        
  
        
        //loop throught visible layers and draw children on cache canvas
        for(l = 0,ll = this._layers.length;l<ll;l++){
            layer =this._layers[l];
            layer.updateCache();
      
        }
          console.timeEnd("UpdateLayers");
        
         
    },
    _stageWithinViewport:function(){
        var s = this._stage.attrs,o = this._offset,x=-s.x,y=-s.y,width = s.width,height=s.height;
    
        var stage = {
            l:x-width/2,
            t:y-height/2,
            r:x+width/2,
            b:y+height/2
        };
        var vp ={
            l:this._vp.x,
            t:this._vp.y,
            r:this._vp.width,
            b:this._vp.height
        }
        var within = vp.l > stage.l && vp.t > stage.t &&
        vp.r > stage.r && vp.b >  stage.b;
    
      
   
        return within;
                            

 
       
    }
}