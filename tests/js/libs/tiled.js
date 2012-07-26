Kinetic.Tiled = function(data,stage){
    this.data = data;
    this.stage = stage;
    this.layers = [];
    this.sprites = {};
};

Kinetic.Tiled.prototype = {
  
    createSprites:function(tilesets){
     
        for(var i = 0,il = tilesets.length;i<il;i++){
            var set = tilesets[i];
            var id = set.firstgid;
            
            for(var y = 0,yl=~~(set.imageheight/set.tileheight);y<yl;y++){
                for(var x = 0,xl=~~(set.imagewidth/set.tilewidth);x<xl;x++){
                    var sprite = new Kinetic.Image({
                        image:set.img,
                        crop:{
                            x:x*set.tilewidth,
                            y:y*set.tileheight,
                            width:set.tilewidth,
                            height:set.tileheight
                        },
                        name:id,
                        width:set.tilewidth,
                        height:set.tileheight
                    });
                    this.sprites[id] = sprite;
                    id++;
                }   
            }
           
        }
        this.createMap();
    },
    createMap:function(){
        
        var layers = this.data.layers;
        for(var i = 0;i<layers.length;i++){
            var layer = new Kinetic.Layer();
            var layerData = layers[i];
           
            if(layerData.data){
            for(var d=0,dl = layerData.data.length;d<dl;d++){
                var tile =layerData.data[d];
            
                if(tile > 0 && this.sprites[tile]){
                    this.sprites[tile].x = 0;
                    this.sprites[tile].y = 0;
                   
                    layer.add(this.sprites[tile]);
                }
            }
            }
            this.stage.add(layer);
            layer.draw();
        
        }
        
    },
    updateMap:function(){
        
    }
}