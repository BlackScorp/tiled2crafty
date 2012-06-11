
Crafty.extend({
    diamondIso:{
        _tile: {
            w: 0,
            h: 0,
            r:0
        },
        _map:{
            w:0,
            h:0
        },
        
        _origin:{
            x:0,
            y:0
        },

        init:function(tw, th,mw,mh){
            this._tile.w = parseInt(tw);
            this._tile.h = parseInt(th)||parseInt(tw)/2;
            this._tile.r = this._tile.w / this._tile.h;
            
            this._map.w = parseInt(mw);
            this._map.h = parseInt(mh) || parseInt(mw);
            
            this._origin.x = this._map.h * this._tile.w / 2;
          
              
            return this;
        },

        place:function(obj,x,y){
            var pos = this.pos2px(x,y);
            obj.attr({
                x:pos.left-obj.__offset[0],
                y:pos.top-obj.h-obj.__offset[1],
                z:y
            }); 
            
        },
        centerAt:function(x,y){
            var pos = this.pos2px(x,y);
            Crafty.viewport.x = -pos.left;
            Crafty.viewport.y = -pos.top;
        },
        pos2px:function(x,y){
            var l = (x-y)*this._tile.w/2+this._origin.x;
            var t = (x+y)*this._tile.h/2;
            
            return{
                left:l,
                top:t
            }
        },
        px2pos:function(left,top){
            var x = left - this._origin.x;
            return {
                x:(top+(x/this._tile.r)) / this._tile.h,
                y:(top-(x/this._tile.r)) / this._tile.h
            }
        }
       
    }
});

