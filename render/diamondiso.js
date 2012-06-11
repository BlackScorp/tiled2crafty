
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
        _o:{
            x:0,
            y:0
        },
        _pos:{
            x:0,
            y:0
        },

        init:function(tw, th,mw,mh){
            this._t.w = parseInt(tw);
            this._t.h = parseInt(th)||tw/2;
            this._m.w = parseInt(mw);
            this._m.h = parseInt(mh) || parseInt(mw);
            
            this._o.x = mw*tw/2-Crafty.viewport.x;
            this._o.y = th-Crafty.viewport.y;
              
            return this;
        },

        place:function(obj,x,y){
             
            var pos = this.pos2px(x,y);
            var offset = obj.__offset;
            this._pos = {
                x:pos.left-obj.w/2-offset[0],
                y:pos.top-obj.h-offset[1]
            }
            obj.attr({
                x:this._pos.x,
                y:this._pos.y,
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
        },
        polygon:function(){
        
            var p =[
                [this._pos.x - 0,this._pos.y -this._t.h/2],
                [this._pos.x -this._t.w/2,this._pos.y -0],
                [this._pos.x -this._t.w,this._pos.y -this._t.h/2],
                [this._pos.x -this._t.w/2,this._pos.y -this._t.h]
            ]
         
            return new Crafty.polygon(p);
        }
       
    }
});

