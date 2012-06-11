
Crafty.extend({
    diamondIso:{
        _t: {
            w: 0,
            h: 0
        },
        _m:{
            w:0,
            h:0
        },
        _vp:{
            x:0,
            y:0
        },
        _o:{
            x:0,
            y:0
        },

        init:function(tw, th,mw,mh){
           this._t.w = tw;
            this._t.h = th||tw/2;
            this._m.w = mw;
            this._m.h = mh || mh;
            
            this._o.x = mw*tw/2-Crafty.viewport.x;
            this._o.y = th-Crafty.viewport.y;
              
            return this;
        },

        place:function(obj,x,y){
             
            var pos = this.pos2px(x,y);
            var offset = obj.__offset;
           
            obj.attr({
                x:pos.left-obj.w/2+offset[0],
                y:pos.top-obj.h+offset[1],
                z:y
            });
            
            
        },
       
        pos2px:function(x,y){
            var l = (x-y)*this._t.w/2;
            var t = (x+y)*this._t.h/2;
            
            return{
                top:~~(t+this._o.y),
                left:~~(l+this._o.x)
            }
        }
       
    }
});

