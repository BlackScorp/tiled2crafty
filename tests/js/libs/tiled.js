Kinetic.Tiled = function(data,stage){
    this.data = data;
    this.stage = stage;
 
    this.sprites = {};
};

Kinetic.Tiled.prototype = {
  
    createSprites:function(){
     
        for(var i = 0,il = this.data.tilesets.length;i<il;i++){
            var set = this.data.tilesets[i];
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
       
        for(var i = 1;i<=1;i++){
            var layerData = layers[i];
            
            if(layerData.data){ 
                console.log(layerData);
                var layer = new Kinetic.Layer();
                for(var d=0,dl = layerData.data.length-1;d<dl;d++){
                    var tile =layerData.data[d];
                    if(tile > 0 && this.sprites[tile]){
                        var sprite = this.sprites[tile];
                        layer.add(sprite);
                    }
                }
                this.stage.add(layer);
                layer.draw();
             
            }
            
        
        }
      
    },
    updateMap:function(){
        
    }
}