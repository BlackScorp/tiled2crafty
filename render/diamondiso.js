
Crafty.extend({
    diamond:{
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
            
            this._o.x = tw/2+mw*tw/2-Crafty.viewport.x;
            this._o.y = th/2-Crafty.viewport.y;
              
            return this;
        },

        place:function(obj,x,y){
             
            var pos = this.pos2px(x,y);
        
          
            obj.attr({
                x:pos.left,
                y:pos.top,
                z:pos.top-(obj.h-this._t.h/2)
            });
            
            
        },
        placeAbsolute:function(obj,x,y,z,layer){
            var pos = this.pos2px(x,y,z);
            obj.attr({
                x:pos.left+Crafty.viewport.x,
                y:pos.top,
                z:layer
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

Crafty.c("DiamondIso",{
    iso:{
        x:0,
        y:0,
        z:0,
        dynamic:false
    },
    init:function(){
        this.bind("Change",function(){
            if(!this.iso.dynamic) return;
        })
    } 
});
