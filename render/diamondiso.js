
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

        init:function(tw, th,mw,mh){
            this._tile.width = parseInt(tw);
            this._tile.height = parseInt(th)||parseInt(tw)/2;
            this._tile.r = this._tile.width / this._tile.height;
            
            this._map.width = parseInt(mw);
            this._map.height = parseInt(mh) || parseInt(mw);
       
            this._origin.x = this._map.height * this._tile.width / 2;
    
              
            return this;
        },

        place:function(obj,x,y,offsetX,offsetY,layer){
            var pos = this.pos2px(x,y);
            if(!offsetX) offsetX = 0;
            if(!offsetY) offsetY = 0;
            if(!layer) layer = 1;
            obj.attr({
                x:(pos.left)+offsetX,
                y:(pos.top-obj.h)+offsetY,
                z:y*layer
            }); 
            
        },
        centerAt:function(x,y){
            var pos = this.pos2px(x,y);
            Crafty.viewport.x = -pos.left+Crafty.viewport.width/2+this._tile.width;
            Crafty.viewport.y = -pos.top+Crafty.viewport.height/2-this._tile.height;
        },
        area:function(){
                
            //get Rectangle of Viewport
            var vp = {
                x:-Crafty.viewport.x,
                y:-Crafty.viewport.y,
                width:-Crafty.viewport.x+Crafty.viewport.width,
                height:-Crafty.viewport.y+Crafty.viewport.height
            }
            //Adjust Rectangle
            vp = this.adjust(vp,-this._tile.width/2,-this._tile.height/2,this._tile.width/2,this._tile.height/2);
            //calculate the corners
            vp = this.rect(vp);
         
            var startX = ~~Math.max(0,this.px2pos(vp.top.left.x,vp.top.left.y).x);
            var startY = ~~Math.max(0,this.px2pos(vp.top.right.x,vp.top.right.y).y);
            var endX = ~~Math.min(this._map.width,this.px2pos(vp.bottom.right.x,vp.bottom.right.y).x);
            var endY = ~~Math.min(this._map.height,this.px2pos(vp.bottom.left.x,vp.bottom.left.y).y);

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
                        x:obj.x+obj.width,
                        y:obj.y
                    }
                },
                bottom:{
                    left:{
                        x:obj.x,
                        y:obj.y+obj.height
                    },
                    right:{
                        x:obj.x+obj.width,
                        y:obj.y+obj.height
                    }
                }
            }  
        },
        adjust:function(obj,left,top,right,bottom){
            
            obj.x += left;
            obj.y += top;
            obj.width += right;
            obj.height += bottom;
            
            return obj;
          
        },
        polygon:function(obj){
            
            var topRight = this.pos2px(obj.x+obj.width,obj.y);
            var bottomRight = this.pos2px(obj.x + obj.width,obj.y + obj.height);
            var bottomLeft = this.pos2px(obj.x,obj.y + obj.height);
            var topLeft = this.pos2px(obj.x,obj.y);
      
            var p =[
            [topLeft.x,topLeft.y],
            [topRight.x + this._tile.width/2,topRight.y + this._tile.height/2],
            [bottomRight.x,bottomRight.y + this._tile.height],
            [bottomLeft.x - this._tile.width/2,bottomLeft.y+this._tile.height/2]
            ]
         
            return new Crafty.polygon(p);
        }
       
    }
});

