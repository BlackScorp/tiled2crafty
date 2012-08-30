var Map = function(stage){
    this._stage = stage;
    this._map = null;
    this._sprites = {};
    this._x = 0;
    this._y = 0;
    this._layers = [];
    this._tiles = {};
    this._vp = null;
}

Map.prototype = {
    _data:null,
    draw:function(){
        if(!this._map) return;
        if(!this._vp || !this._stageWithinViewport()) this._updateLayers();
        this._drawLayers(); 
    },
    load:function(config){
        var map = this;
        this._x = config.x;
        this._y = config.y;
        $.ajax({
            url:"js/maps/"+config.map+'.json',
            success:function(data){
                map._setData(data);
                map._init();
                map._initLayers();
                map._loadImages();
            }
        });
    },
    _stageWithinViewport:function(){
        var s = this._stage.attrs;
        var svp = {
            x:-s.x,
            y:-s.y,
            width:s.width,
            height:s.height
        }
        return ;
        console.log(this._vp,svp);
    },
    _setData:function(data){
        this._data = data;
    },
    _createSprites:function(){
        var images = [];
        
        for(var i =0,il = this._data.tilesets.length;i<il;i++){
            var tileset = this._data.tilesets[i],id=tileset.firstgid;
            for(var y = 0,yl = tileset.imageheight;y<yl;y+=tileset.tileheight){
                for(var x = 0,xl = tileset.imagewidth;x<xl;x+=tileset.tilewidth){
                    var offset = {
                        x:0,
                        y:0
                    };
                    if(tileset.tileoffset){
                        offset.x = -tileset.tileoffset.x;
                        offset.y = -tileset.tileoffset.y;
                    }
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
            images.push({
                src:tileset.image,
                id:tileset.name
            });
           
        }
        return images;
    },
    _loadImages:function(){
    
        var map = this;
        var loader = new Kinetic.Loader(this._createSprites());
        loader.onError(function(data){
          
            });
        loader.onProgress(function(data){
           
            });
        loader.onComplete(function(){
            map.draw();
        });
        loader.load();
    },
    _initLayers:function(){
        for(var i = 0,il = this._data.layers.length;i<il;i++){
            var l = this._data.layers[i];
            if(l.type === "tilelayer"){
                var layer = new Kinetic.Layer({
                    listening:false,
                    name:l.name,
                    data:l.data,
                    visible:l.visible
                });
                if(l.visible){
                    var cache =new Kinetic.Canvas(this._stage.getWidth()*2,this._stage.getHeight()*2);
                    cache.name = 'cache';
                    layer.cacheCanvas = cache;
                    layer.beforeDraw(function(){
                        this.children.sort(function(a,b){
                            return a.attrs.zIndex - b.attrs.zIndex;
                        }); 
                    });
                    layer.drawCache = function(){
                      
                        this.getContext().drawImage(this.cacheCanvas.getElement(),0,0);
                        this.cacheCanvas.clear();
                    }
                    layer.updateCache = function(){
                        this.draw(this.cacheCanvas);
                    }
                 
                    this._layers.push(layer);
                }
                this._stage.add(layer);     
            }
         
        }
        
    },
    _drawLayers:function(){
        for(var l = 0,ll = this._layers.length;l<ll;l++){
            this._layers[l].drawCache();
        }
    },
    _updateLayers:function(){
        var s = this._stage.attrs;
        this._vp = {
            x:-(~~(s.x+s.width*0.5)),
            y:-(~~(s.y+s.height*0.5)),
            width:~~(s.width*1.5),
            height:~~(s.height*1.5)
        }
       
        this._map.setViewport(this._vp);
        
        var area = this._map.area(),x=0,y=0,mw=this._data.width,i=0;
        
       
        for(var a = 0,al = area.length;a<al;a++){
            x = area[a][0];
            y = area[a][1];
            i = y*mw+x;
            
            for(var l = 0,ll = this._layers.length;l<ll;l++){
                var layer = this._layers[l],id = layer.attrs.data[i],tile = this._sprites[id];
                if(id < 1 || !tile) continue;
                var name = "Y"+y+"X"+x+"Z"+(l+1);
                if(!this._tiles[name]){
                  
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
                    layer.add(image);
                }
               
            }
        }
        for(l = 0,ll = this._layers.length;l<ll;l++){
            this._layers[l].updateCache();
        }
        delete this._tiles;
        this._tiles = {};
         
    },
    _init:function(){
        var d = this._data,
        mw = d.width,mh=d.height,tw=d.tilewidth,th=d.tileheight;
        if(d.orientation === 'isometric'){
            this._map = new Kinetic.Isometric(tw, th, mw, mh);   
        }
        this._map.centerAt(this._stage,this._x,this._y);
       

    }
}