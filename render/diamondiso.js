
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
            this._origin.y = this._tile.h/2;
              
            return this;
        },

        place:function(obj,x,y,offsetX,offsetY){
            var pos = this.pos2px(x,y);
            if(!offsetX) offsetX = 0;
            if(!offsetY) offsetY = 0;
      
            obj.attr({
                x:(pos.left)+offsetX,
                y:(pos.top-obj.h)+offsetY,
                z:y
            }); 
            
        },
        centerAt:function(x,y){
            var pos = this.pos2px(x,y);
            Crafty.viewport.x = -pos.left+Crafty.viewport.width/2;
            Crafty.viewport.y = -pos.top+Crafty.viewport.height/2;
        },
        pos2px:function(x,y){
            var l = (x-y)*this._tile.w/2+this._origin.x;
            var t = (x+y)*this._tile.h/2+this._origin.y;
            
            return{
                left:l,
                top:t
            }
        },
        px2pos:function(left,top){
            var x = left - this._origin.x;
            var y = top - this._origin.y;
            return {
                x:(y+(x/this._tile.r)) / this._tile.h,
                y:(y-(x/this._tile.r)) / this._tile.h
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

