var Map = function(stage){
    this._stage = stage;
    this._bgLayer = new Kinetic.Canvas(stage.getWidth()*3,stage.getHeight()*3);
    
}

Map.prototype = {
    _data:null,
    _tilesets:{},
    draw:function(x,y){
        
    },
    load:function(mapName){
        var map = this;
        $.ajax({
            url:"js/maps/"+mapName+'.json',
            success:function(data){
                map._setData(data);
                map._loadImages();
            }
        });
    },
    _setData:function(data){
        this._data = data;
   
    },
    _loadImages:function(){
       
        var images = [];
        for(var i =0,il = this._data.tilesets.length;i<il;i++){
            var tileset = this._data.tilesets[i];
            images.push({
                id:tileset.name,
                src:tileset.image
            });
        }
       
        var loader = new Kinetic.Loader(images);
        var map = this;
   
        loader.onComplete(function(){
          
            map._createTilesets();
            map._create();
            map._map.centerAt(map._stage,100,200);
            map._updateCache();
        });
        loader.load();
     
    },
    _createTilesets:function(){
        
        for(var t = 0,tl = this._data.tilesets.length;t<tl;t++){
            var set = this._data.tilesets[t];
          
            if(Kinetic.Assets[set.name]){     
              
                
                var id = set.firstgid;
                for(var y = 0,yl=(set.imageheight/set.tileheight);y<yl;y++){
                    for(var x = 0,xl=(set.imagewidth/set.tilewidth);x<xl;x++){
                        var offset = set.tileoffset || {
                            x:0,
                            y:0
                        };
                        this._tilesets[id] = {
                            img:Kinetic.Assets[set.name],
                            x:x*set.tilewidth,
                            y:y*set.tileheight,
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
         
    },
    _updateCache:function(){
         console.log(this._bgLayer);
         var viewport = {
             x:this._stage.attrs.x,
             y:this._stage.attrs.y,
             w:this._bgLayer.element.width,
             h:this._bgLayer.element.height
         }
         
        var area = this._map.area(this._bgLayer);
       console.log(viewport,area);
    },
    _create:function(){
        var tw = this._data.tilewidth,
        th = this._data.tileheight,
        mw = this._data.width,
        mh = this._data.height;
        
        this._map = new Kinetic.Isometric(tw, th, mw, mh);
    }
}
