
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
       
            this._origin.x = (this._map.height * this._tile.width / 2);
    
              
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
                
            console.log("Current Viewport");
            console.log(Crafty.viewport);
            var vp = {
                x:-Crafty.viewport.x,
                y:-Crafty.viewport.y,
                width:-Crafty.viewport.x+Crafty.viewport.width,
                height:-Crafty.viewport.y+Crafty.viewport.height
            }
            vp = this.adjust(vp,-this._tile.width/2,-this._tile.height/2,this._tile.width/2,this._tile.height/2);
           
            console.log("Viewport Size adjusted with tilesize");
            console.log(vp);
            var min = this.px2pos(vp.x,vp.y);
            var max = this.px2pos(vp.width,vp.height);
            console.log("Start Tile Coordinates");
            console.log(min);
            console.log("End Tile Coordinates");
            console.log(max);
            //  min.x = 0;
            // max.x = 20;
            //min.y = 0;
            // max.y= 20;
        
            return {
                x:{
                    min:Math.max(0,~~min.x),
                    max:Math.min(this._map.width,~~max.x)
                },
                y:{
                    min:Math.max(0,~~min.y),
                    max:Math.min(this._map.height,~~max.y)
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
            return {
                x:((top+((left - this._origin.x)/this._tile.r)) / this._tile.height),
                y:((top-((left - this._origin.x)/this._tile.r)) / this._tile.height)
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

