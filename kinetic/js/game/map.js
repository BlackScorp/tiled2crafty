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
    
    var w = this._stage.getWidth();
    var h = this._stage.getHeight();
    this._offset = {
        top:~~(h/2),
        right:~~(w/2),
        bottom:~~(h/2),
        left:~~(w/2)
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
          
            console.time("UpdateMap");
            this._updateLayers();
            console.timeEnd("UpdateMap");
            this._stageWithinViewport()
        } 
        //draw Layer
        console.time("DrawMap");
        this._drawLayers(); 
        console.timeEnd("DrawMap");
      
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
        this._map.centerAt(this._stage,this._x,this._y);
       

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
                    var w = this._stage.getWidth();
                    var h = this._stage.getHeight();
                    var x = -this._stage.getX();
                    var y = -this._stage.getY();
                    var o = this._offset;
                    //Create a cache Canvas
                   
                    var cache =new Kinetic.Canvas(w*2,h*2);
                    cache.name = 'cache';
                    //add chacheCanvas to layer
                    layer.cacheCanvas = cache;
                     
                    //sort the children before Draw
                    layer.beforeDraw(function(){
                        this.children.sort(function(a,b){
                            return a.attrs.zIndex - b.attrs.zIndex;
                        }); 
                    });
                 
                    layer.drawCache = function(){ 
                        this.getCanvas().clear();
                        //Draw the part of cached Canvas into layer canvas
                       this.getContext().drawImage(this.cacheCanvas.getElement(),o.left,o.top,w,h,0,0,w,h);  
                    }
                    
                    layer.updateCache = function(){
                        this.cacheCanvas.clear();
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
            map.draw();
           
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
        var vp = {
            x:-this._stage.getX(),
            y:-this._stage.getY(),
            width:this._stage.getWidth(),
            height:this._stage.getHeight()
        }
       
        //set the viewport
        this._map.setViewport(vp);
        //adjust the viewport with layer
         this._vp = this._map.viewportAdjust(this._offset);
        
        //get area of viewport
        var area = this._map.area(),x=0,y=0,mw=this._data.width,i=0,grid={};
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
                //set this grid as visible
                grid[name] = true;
                
                //if no Kinetic.Image object exists
                if(!this._tiles[name]){
                    //create one
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
                    this._tiles[name] = image;
                    //add image to layer
                    layer.add(image);
                }
               
            }
        }
        
        //loop throught tiles and hide all tiles outside grid
        for(i in this._tiles){
            var t = this._tiles[i];
            t.attrs.visible = true;
            if(!grid[i]) t.attrs.visible = false; 
        }
        //clear grid for next update
        delete grid;
        grid = {};
        
        
        //loop throught visible layers and draw children on cache canvas
        for(l = 0,ll = this._layers.length;l<ll;l++){
            layer =this._layers[l];
            layer.updateCache();
      
        }
  
        
         
    },
    _stageWithinViewport:function(){
        var s = this._stage.attrs;
        var stage = {
            x:-s.x,
            y:-s.y,
            w:s.width,
            h:s.height
        }
        var vp ={
            x:this._vp.x,
            y:this._vp.y,
            w:this._vp.width,
            h:this._vp.height
        }
        console.log("stage",stage,"viewport",vp)

        return vp.x <= stage.x && vp.x + vp.w >= stage.x + stage.w &&
        vp.y <= stage.y && vp.y + vp.h >= stage.y + stage.h;
                            

 
       
    }
}