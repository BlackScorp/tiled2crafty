
Crafty.extend({
    diamond:{
        _tile: {
            width: 0,
            height: 0,
            ratio:0,
            angle:0,
            sin:0,
            cos:0
        },
        _map:{
            w:0,
            h:0
        },
        _grid:{
            width:0,
            height:0
        },
        _vp:{
            x:0,
            y:0
        },
        _origin:{
            x:0,
            y:0
        },
        grid:function(width, height){
            this._grid.width = width;
            this._grid.height = height||width;
            return this;  
        },
        init:function(width, height){
            this._tile.width = width;
            this._tile.height = height||width/2;
            this._tile.ratio = this._tile.height/this._tile.width;
            this._tile.angle = Math.atan(this._tile.ratio);
            this._tile.sin = Math.sin(this._tile.angle);
            this._tile.cos = Math.cos(this._tile.angle);
     
            this._origin.x =  Crafty.viewport.x + Crafty.viewport.width/2;
            this._origin.y =  Crafty.viewport.y;
            
            return this;
        },
        place:function(obj,x,y){
             
            var pos = this.pos2px(x*this._grid.width,y*this._grid.height);
            var padding = obj.attr('__padding');
            
            var paddingX = padding[0] || 0;
            var paddingY = padding[1] || 0;
            obj.attr({
                x:pos.left+paddingX,
                y:pos.top-paddingY+this._tile.height,
                z:y
            });
            
            
        },
        placeAbsolute:function(obj,x,y,z,layer){
            var pos = this.pos2px(x,y,z);
            obj.attr({
                x:pos.left,
                y:pos.top,
                z:layer
            });
        },
        pos2px:function(x,y){
            var l = (x-y)*this._tile.cos;
            var t = (x+y)*this._tile.sin;
            return{
                top:~~(t+this._origin.y),
                left:~~(l+this._origin.x)
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
