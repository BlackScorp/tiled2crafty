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
      
    },
    getSprites:function(){
      
        return this.sprites;
    },
    createMap:function(){
        
        var layers = this.data.layers,
        mw = this.data.width,
        mh = this.data.height,
        tw = this.data.tileheight,
        th = this.data.tilewidth;
       
       var map = new Kinetic.Isometric(tw,th,mw,mh);

       for(var i = 0;i<layers.length;i++){
            
            var layerData = layers[i];
         
            if(layerData.data){ 
                var layer = new Kinetic.Layer();
                layer.attrs.name = layerData.name;
               this.stage.add(layer);
            }
       }
      var backgrounds = layers[0].data;
      var objects = layers[1].data;
      var collision = layers[2].data;
      var backgroundLayer = this.stage.get('.background')[0];
      var objectLayer = this.stage.get('.objects')[0];
       for(var y = 0,yl = mh;y<yl;y++){
           for(var x = 0,xl = mw;x<xl;x++){
               var index = y * mh +x,
               background = backgrounds[index],
               object = objects[index];
               
               if(background > 0 && this.sprites[background]){
                   var tile = this.sprites[background];
                   var pos = map.pos2px(x, y);
                   tile.attrs.x =1500;//pos.left;
                   tile.attrs.y =0;//pos.top;
                   backgroundLayer.add(tile);
               }
           }
       }
              
        for(var i in this.stage.children){
             this.stage.children[i].draw();
        }
    
         
    },
    updateMap:function(){
        
    }
}