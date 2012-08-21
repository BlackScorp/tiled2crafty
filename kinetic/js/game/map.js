var Map = function(data){
    this.stage = null;
    this.data = data;
    this.tilesets = {};
    this.map = null;
    this.tiles = {};
    this.grid = {};
}

Map.prototype.draw = function(x,y){
    if(!this.map) return;
    
    this.map.centerAt(this.stage,x,y);
    this.drawLayer('.background').draw();
    this.drawLayer('.object').draw();
    this.clear();
}
    
Map.prototype.update = function(){
    this.drawLayer();
    this.clear();
}
Map.prototype.init = function(stage){
    this.stage = stage;
    this.createLayers();
    this.createTilesets();
    this.createMap();
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
    var area = this.map.area(this.stage);
    var layer = this.stage.get(name)[0];
    
  
   
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
     
        var tmpLayer = new Kinetic.Layer({
            name:layer.name,
            data:data,
            visible:layer.visible
        });
        if(data.length > 0){
            tmpLayer.beforeDraw(function(){
                this.children.sort(function(a,b){
                    return a.attrs.zIndex-b.attrs.zIndex;
                })
            });
        }
        
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

