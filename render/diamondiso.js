
Crafty.extend({
    diamondIso:{
        _tile: {
            width: 0,
            height: 0,
            r:0
        },
        _map:{
            width:0,
            height:0,
            x:0,
            y:0
        },
        
        _origin:{
            x:0,
            y:0
        },
        _vp:{
            x:0,
            y:0,
            h:0,
            w:0
        },
        init:function(tw, th,mw,mh){
            this._tile.width = parseInt(tw);
            this._tile.height = parseInt(th)||parseInt(tw)/2;
            this._tile.r = this._tile.width / this._tile.height;
            
            this._map.width = parseInt(mw);
            this._map.height = parseInt(mh) || parseInt(mw);
       
            this._origin.x = this._map.height * this._tile.width / 2;
                            
            this._updateViewport();            
         
            return this;
        },

        place:function(obj,x,y,layer){
            var pos = this.pos2px(x,y);
            if(!layer) layer = 1;
            var marginX = 0,marginY = 0;
            if(obj.__margin !== undefined){
                marginX = obj.__margin[0];
                marginY = obj.__margin[1];
            }
            obj.attr({
                x:pos.left+marginX,
                y:pos.top-obj.h+marginY,
                z:(y+1)*layer
            }); 
            
        },
        centerAt:function(x,y){
            var pos = this.pos2px(x,y);
            Crafty.viewport.x = -pos.left+Crafty.viewport.width/2-this._tile.width/2;
            Crafty.viewport.y = -pos.top+Crafty.viewport.height/2-this._tile.height/2;
            this._updateViewport();
        },
        _updateViewport:function(){
            //get Rectangle of Viewport
            this._vp = {
                x:-Crafty.viewport.x,
                y:-Crafty.viewport.y,
                w:Crafty.viewport.width,
                h:Crafty.viewport.height
            }
            //Adjust Rectangle
            this._vp = this.adjust(this._vp,-this._tile.width/2,-this._tile.height/2,this._tile.width/2,this._tile.height/2);
        },
        viewport:function(){
            return this._vp;
        },
        area:function(){
            this._updateViewport();
            //calculate the corners
            var vp = this.rect(this._vp);
            var startX = Math.max(0,this.px2pos(vp.top.left.x,vp.top.left.y).x);
            var startY = Math.max(0,this.px2pos(vp.top.right.x,vp.top.right.y).y);
            var endX = Math.min(this._map.width,this.px2pos(vp.bottom.right.x,vp.bottom.right.y).x);
            var endY = Math.min(this._map.height,this.px2pos(vp.bottom.left.x,vp.bottom.left.y).y);

            return {
                x:{
                    min:startX,
                    max:endX
                },
                y:{
                    min:startY,
                    max:endY
                }
            }
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
        rect:function(obj){
          
            return {
                top:{
                    left:{
                        x:obj.x,
                        y:obj.y
                    },
                    right:{
                        x:obj.x+obj.w,
                        y:obj.y
                    }
                },
                bottom:{
                    left:{
                        x:obj.x,
                        y:obj.y+obj.h
                    },
                    right:{
                        x:obj.x+obj.w,
                        y:obj.y+obj.h
                    }
                }
            }  
        },
        adjust:function(obj,left,top,right,bottom){
            
            obj.x += left;
            obj.y += top;
            obj.w += right;
            obj.h += bottom;
            
            return obj;
          
        },
        polygon:function(obj){
      
            obj.requires("Collision");
            var marginX = 0,marginY = 0;
            if(obj.__margin !== undefined){
                marginX = obj.__margin[0];
                marginY = obj.__margin[1];
            }
            var points = [
            [marginX-0,obj.h-marginY-this._tile.height/2],
            [marginX-this._tile.width/2,obj.h-marginY-0],
            [marginX-this._tile.width,obj.h-marginY-this._tile.height/2],
            [marginX-this._tile.width/2,obj.h-marginY-this._tile.height]
            ];
            var poly = new Crafty.polygon(points);
            
           
            
       
            return poly;
           
        }
       
    }
});

