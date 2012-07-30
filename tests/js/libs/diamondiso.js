
Kinetic.Isometric = function(tw,th,mw,mh){
   
    this._tile.width = parseInt(tw);
    this._tile.height = parseInt(th)||parseInt(tw)/2;
    this._tile.r = this._tile.width / this._tile.height;
            
    this._map.width = parseInt(mw);
    this._map.height = parseInt(mh) || parseInt(mw);
       
    this._origin.x = this._map.height * this._tile.width / 2;
                            
            
         
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
    }
    ,
    centerAt:function(stage,x,y){
        var pos = this.pos2px(x,y),
        x = -pos.left+stage.getWidth()/2-this._tile.width,
        y = -pos.top+stage.getHeight()/2;
   
       stage.setX(x);
       stage.setY(y);
      
    },
    area:function(stage,offset){
        if(!offset) offset = 0;
        //calculate the corners
        var vp = {
            _x:-stage.getX(),
            _y:-stage.getY(),
            _w:stage.getWidth(),
            _h:stage.getHeight()
            
        }
        console.log("Before",vp._w,vp._h,vp._x,vp._y);
        var ow = offset*(this._tile.width);
        var oh = offset*(this._tile.height);
        vp._x -= (ow);
        vp._y -= (oh);
        vp._w += (ow);
        vp._h += (oh); 
      console.log("After",vp._w,vp._h,vp._x,vp._y);
        var grid = [];
        console.log(~~(vp._y/(this._tile.height/2)),"Until ",~~((vp._y+vp._h)/(this._tile.height/2)));
        console.log(~~(vp._x/(this._tile.width/2)),"Until ",~~((vp._x+vp._w)/(this._tile.width/2)));
        for(var y = vp._y,yl = (vp._y+vp._h);y<yl;y+=this._tile.height/2){
            for(var x = vp._x,xl = (vp._x+vp._w);x<xl;x+=this._tile.width/2){
                var row = this.px2pos(x,y);
                grid.push([~~row.x,~~row.y]);
            }
        }
        return {
            x:{
                min:~~(vp._x/(this._tile.width/2)),
                max:~~((vp._x+vp._w)/(this._tile.width/2))
            },
            y:{
                min:~~(vp._y/(this._tile.height/2)),
                max:~~((vp._y+vp._h)/(this._tile.height/2))
            }
        }
        
        return grid;       
    } 
    
};
