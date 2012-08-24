var Map = function(data){
    this.stage = null;
    this.data = data;
    this.sprites = {};
    this.map = null;
    this.tiles = {};
    this.grid = {};
}


Map.prototype.update = function(){
        this.drawLayers();
    }
Map.prototype.init = function(stage){
    this.stage = stage;
    this.createLayers();
    this.createTilesets();
    this.createMap(); 
    this.drawLayers();
}
Map.prototype.drawLayers = function(){
    var area = this.map.area(this.stage,1);
 
    var backgroundLayer = this.stage.get('#background')[0];
    var objectLayer = this.stage.get('#object')[0];
    
    for(var m in area){
        var x = area[m][0], 
        y = area[m][1], 
        index = y*this.map._map.width+x, 
        z=0,image=null,tile,pos,name,background,object;
  
   
        background = backgroundLayer.attrs.data[index];
        object = objectLayer.attrs.data[index];
            
       
        if(background > 0 && this.sprites[background]){
            z=1;
            tile = this.sprites[background]; //get sprite infos
            pos = this.map.pos2px(x, y); //calculate x/y to top/left position
            name = "Y"+y+"X"+x+"Z"+z;
            this.grid[name] = true; //set the grid on true, so this location is within viewport
            //if tile does not exists
            if(!this.tiles[name]){
                   
                //create new Image
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
                //add image to layer
                backgroundLayer.add(image);
                //save image temporary
                this.tiles[name] = image;   
            }
        }
        
          if(object > 0 && this.sprites[object]){
            z=2;
            tile = this.sprites[object]; //get sprite infos
            pos = this.map.pos2px(x, y); //calculate x/y to top/left position
            name = "Y"+y+"X"+x+"Z"+z;
            this.grid[name] = true; //set the grid on true, so this location is within viewport
            //if tile does not exists
            if(!this.tiles[name]){
                   
                //create new Image
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
                //add image to layer
                objectLayer.add(image);
                //save image temporary
                this.tiles[name] = image;   
            }
        }
    }
           

}
Map.prototype.createLayers = function(){

    for(var l=0,ll=this.data.layers.length;l<ll;l++){
        var layer = this.data.layers[l];
        var data = layer.data || [];
     
        var tmpLayer = new Kinetic.Layer({
            id:layer.name,
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
                    this.sprites[id] ={
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
        this.map.centerAt(this.stage,100,100);
    }
}

