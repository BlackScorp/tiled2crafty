
Kinetic.Isometric = function(tw,th,mw,mh){
   
    this._tile.width = parseInt(tw);
    this._tile.height = parseInt(th)||parseInt(tw)/2;
    this._tile.r = this._tile.width / this._tile.height;
            
    this._map.width = parseInt(mw);
    this._map.height = parseInt(mh) || parseInt(mw);
       
    this._origin.x = this._map.height * this._tile.width / 2;
    this._width =  this._map.height * this._tile.width;
    this._height = this._map.height * this._tile.height;
            
         
    return this;
}
   
Kinetic.Isometric.prototype ={
    _tile :{
        width:0,
        height:0,
        r:0
    },
    _map:{
        width:0,
        height:0
    },
    _origin:{
        x:0,
        y:0
    },
    _vp:{
      x:0,
      y:0,
      width:0,
      height:0
    },
    setViewport:function(vp){
      this._vp = vp;  
    },
    viewportAdjust:function(offset){
      
        this._vp.x += offset.left;
        this._vp.y += offset.top;
        this._vp.width += offset.right;
        this._vp.height += offset.bottom;
     
        return this._vp;
    },

    pos2px:function(x,y){
 
        return{
            left:((x-y)*this._tile.width/2+this._origin.x),
            top:((x+y)*this._tile.height/2)
        }
    },
    px2pos:function(left,top){
        var x = (left - this._origin.x)/this._tile.r;
        return {
            x:((top+x) / this._tile.height),
            y:((top-x) / this._tile.height)
        }
    },
    centerAt:function(stage,x,y){
        var pos = this.pos2px(x,y),
        posX = -pos.left+stage.attrs.width/2-this._tile.width/2,
        posY = -pos.top+stage.attrs.height/2;
       
        stage.setX(~~posX);
        stage.setY(~~posY);
     
    },
    area:function(offset,torus){
        if(!offset) offset = 0;
        if(!torus) torus = false;
        var grid = [];
        
        for(var y = this._vp.y,yl = (this._vp.y+this._vp.height);y<yl;y+=this._tile.height/2){
            for(var x = this._vp.x,xl = (this._vp.x+this._vp.width);x<xl;x+=this._tile.width/2){
                var row = this.px2pos(x,y),
                posX = ~~row.x,posY = ~~row.y;
                if(!torus && posX > 0 || posY > 0) {
                    posX = Math.max(0, Math.min(this._map.width, posX));
                    posY = Math.max(0, Math.min(this._map.height, posY));
                    grid.push([posX,posY]); 
                }else{
                    grid.push([posX,posY]);  
                }
              
            }
        }
      
       
        return grid;       
    } 
    
};
