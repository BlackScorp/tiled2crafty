var Map = function(data){
    this.stage = null;
    this.data = data;
    this.tilesets = {};
    this.map = null;

}

Map.prototype.draw = function(){
    
    }
Map.prototype.update = function(){
    
    }
Map.prototype.init = function(stage){
    this.stage = stage;
    this.createLayers();
    this.createTilesets();
    this.createMap();

}
Map.prototype.createLayers = function(){

    for(var l=0,ll=this.data.layers.length;l<ll;l++){
        var layer = this.data.layers[l];
        var data = layer.data || [];
     
        var tmpLayer = new Kinetic.Layer({
            name:layer.name,
            data:data,
            visible:layer.visible
        });
  
        
        this.stage.add(tmpLayer);
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

