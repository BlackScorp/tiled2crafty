
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
            
            this._origin.x = (this._map.h * this._tile.w / 2);
    
              
            return this;
        },

        place:function(obj,x,y,offsetX,offsetY,layer){
            var pos = this.pos2px(x,y);
            if(!offsetX) offsetX = 0;
            if(!offsetY) offsetY = 0;
            ;
            obj.attr({
                x:(pos.left-obj.w/2)+offsetX,
                y:(pos.top-obj.h)+offsetY,
                z:y*layer
            }); 
            
        },
        centerAt:function(x,y){
            var pos = this.pos2px(x,y);
            Crafty.viewport.x = -pos.left+Crafty.viewport.width/2+this._tile.w;
            Crafty.viewport.y = -pos.top+Crafty.viewport.height/2-this._tile.h;
        },
        area:function(){
            var min = this.px2pos(-Crafty.viewport.x,-Crafty.viewport.y);
            var max = this.px2pos(-Crafty.viewport.x+Crafty.viewport.width,-Crafty.viewport.y+Crafty.viewport.height);
            console.log(min);
            return {
                x:{
                    min:min.x,
                    max:max.x
                },
                y:{
                    min:min.y,
                    max:max.y
                }
            }
        },
        pos2px:function(x,y){
            return{
                left:((x-y)*this._tile.w/2+this._origin.x),
                top:((x+y)*this._tile.h/2)
            }
        },
        px2pos:function(left,top){
            return {
                x:((top+((left - this._origin.x)/this._tile.r)) / this._tile.h),
                y:((top-((left - this._origin.x)/this._tile.r)) / this._tile.h)
            }
        },
        polygon:function(){
        
            var p =[
            [0,this._pos.y -this._t.h/2],
            [this._t.w/2,this._pos.y -0],
            [this._t.w,this._pos.y -this._t.h/2],
            [this._t.w/2,this._pos.y -this._t.h]
            ]
         
            return new Crafty.polygon(p);
        }
       
    }
});

