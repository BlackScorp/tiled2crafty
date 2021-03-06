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
    this._ready = false;
    //Viewport
    this._vp = null; 
    
  
    //Define cache canvas size
    this._cache = {
        width:this._stage.attrs.width*2,
        height:this._stage.attrs.height*2,
        x:0,
        y:0
    }
    this._offset = {
        x:(this._cache.width-this._stage.attrs.width)/2,
        y:(this._cache.height-this._stage.attrs.height)/2
    }
    
    this._info = {
        updateLayer:$('#update_layer'),
        getImages:$('#get_images'),
        drawImages:$('#draw_images'),
        drawCache:$('#draw_cache'),
        draw:$('#draw'),
        bgChildren:$('#count_bg'),
        objChildren:$('#count_obj'),
        totalChildren:$('#count_all')
    }
    this._tiles = {};
}

Map.prototype = {
    _data:null,
    //Main function to draw the map
    draw:function(){
        
        //If map is not initialized or there is no viewport,return
      
        if(!this._ready) return;
       var drawTime = this._t();
     
        //If  the viewport is not within the stage
        if(!this._stageWithinViewport()){
            //Update layer
            this._updateLayers();
        } 
        //draw Layer
        this._drawLayers(); 
        var drawDiff = this._t() - drawTime;
        this._info.draw.text(drawDiff);
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
        this._stage.attrs.x = -pos.left+this._cache.width/2-tw/2; 
        this._stage.attrs.y = -pos.top+this._cache.height/2;
  
      

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
                    var map = this;
                    //Create a cache Canvas
                    var cache =new Kinetic.Canvas(this._cache.width,this._cache.height);
                    cache.name = 'cache';
                    //add chacheCanvas to layer
                    layer.cacheCanvas = cache;
                     //$('#cache').append(cache.getElement());
                    //sort the children before Draw
                    layer.beforeDraw(function(){
                        if(this.attrs.name === 'background') {
                            map._info.bgChildren.text(this.children.length);
                        }
                        if(this.attrs.name === 'object') {
                            map._info.objChildren.text(this.children.length);
                        }
                        this.children.sort(function(a,b){
                            return a.attrs.zIndex - b.attrs.zIndex;
                        }); 
                        this.cacheCanvas.clear();
                    });

                    layer.drawCache = function(){  
                        var 
                        w=map._stage.attrs.width,
                        h=map._stage.attrs.height,
                        x=(-map._stage.attrs.x-map._vp.x)+map._offset.x,
                        y=(-map._stage.attrs.y-map._vp.y)+map._offset.y;
                       
                    
                        this.getCanvas().clear();
                       
                        //Draw the part of cached Canvas into layer canvas
                        this.getContext().drawImage(this.cacheCanvas.getElement(),x,y,w,h,0,0,w,h);  
                     
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
            map._updateLayers();
            map._ready = true;
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
        var t = this._t();
        //loop throught visible layers and draw part of chacecanvas into screencanvas
        for(var l = 0,ll = this._layers.length;l<ll;l++){
            this._layers[l].drawCache();
        }
        var diff = this._t() - t;
        this._info.drawCache.text(diff);
    },
    _updateLayers:function(){
        var updateTime = this._t();

      
        this._vp = {
            x:-this._stage.attrs.x,
            y:-this._stage.attrs.y,
            w:this._cache.width,
            h:this._cache.height
        }
     
   
      
        //get area of viewport
        var area = this._map.area(this._vp),mw=this._data.width,x=0,y=0,i=0,tiles = {},grid={};
            
        //loop throught elements
       
        var imageTime = this._t();
        for(var a = 0,al = area.length;a<al;a++){
            x = area[a][0]; //get x
            y = area[a][1]; //get y
            i = y*mw+x; //get index
            //loop throught visible layers
            for(var l = 0,ll = this._layers.length;l<ll;l++){
                
                var layer = this._layers[l],
                id = layer.attrs.data[i],
                tile = this._sprites[id];
                //if sprite not exists or sprite id = 0 continue to next layer
                
                var name = "Y"+y+"X"+x+"Z"+(l+1);
                grid[name] = true;
                //reduce amount of loops
              
                if(id < 1 || !tile || this._tiles[name]) continue;
                //create individual tile name
                   
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
             
                this._tiles[name]=image; 
                //add image to layer
                layer.add(image);
                    
 
            }
        }
        var imageDiff = this._t()-imageTime;
        this._info.getImages.text(imageDiff);
   
        for(var i in this._tiles){
            var t = this._tiles[i];
            if(!grid[i]){ //if the name is in Grid var
                t.attrs.visible = false;
            }else{
                //here i need to delete it
                t.attrs.visible = true;
            }   
        }
        delete grid;
 
        var drawTime = this._t();
        //loop throught visible layers and draw children on cache canvas
        var children = 0;
        for(l = 0,ll = this._layers.length;l<ll;l++){
            layer =this._layers[l];
            children += layer.children.length;
            layer.draw(layer.cacheCanvas);
            
        }
        this._info.totalChildren.text(children);
        var drawDiff = this._t()-drawTime;
        this._info.drawImages.text(drawDiff);
   
        var updateDiff = this._t()-updateTime;
        this._info.updateLayer.text(updateDiff);
         
    },
    
    _stageWithinViewport:function(){
        //lazy vars
        var s = this._stage.attrs,o = this._offset,vp = this._vp,tw =this._data.tilewidth,th = this._data.tileheight;
    
        var stage = {
            x:-s.x+(o.x-tw/2),
            y:-s.y+(o.y-th),
            w:s.width,
            h:s.height
        };
        var viewport ={
            x:vp.x,
            y:vp.y,
            w:vp.w,
            h:vp.h
        }
        
        var within = viewport.x <= stage.x && viewport.x + viewport.w >= stage.x + stage.w &&
        viewport.y <= stage.y && vp.y + viewport.h >= stage.y + stage.h;
        
  
        return within;
                            

 
       
    },
    _t:function(){
        return Date.now();
    },
    isReady:function(){
        return this._ready;
    }
}
