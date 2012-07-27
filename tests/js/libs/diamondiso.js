
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
       
    
};
