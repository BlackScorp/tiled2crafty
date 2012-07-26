Kinetic.SpriteMap = function(img,width,height){
    this.sprites = {};
    this.img = img;
    this.width = width;
    this.height = height;
    return this;
}

Kinetic.SpriteMap.prototype = {
    setMap:function(map){
        this.map = map;
     
        return this;
    },
    createMap:function(width,height){
        for(var i in this.map){
            var m = this.map[i];
            var sprite = new Kinetic.Image({
                image:this.img,
                crop:{x:m[0]*width,y:m[1]*height,width:width,height:height},
                name:i,
                width:width,
                height:height
            });
            this.sprites[i] = sprite;
            
        }
        return this;

    },
    getSprites:function(name){
        if(name && this.sprites[name]) return this.sprites[name]; 
        return this.sprites;
    }
   
}
