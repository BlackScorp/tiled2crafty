
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
        _layers:{},
        init:function(tw, th,mw,mh){
            this._tile.width = parseInt(tw);
            this._tile.height = parseInt(th)||parseInt(tw)/2;
            this._tile.r = this._tile.width / this._tile.height;
            
            this._map.width = parseInt(mw);
            this._map.height = parseInt(mh) || parseInt(mw);
       
            this._origin.x = this._map.height * this._tile.width / 2;
                            
            
         
            return this;
        },
        layer:{
            id:0,
            tmp:{
                canvas:null,
                viewport:null
            },
            create:function(name,data){
                
                var c,t = Crafty.diamondIso,
                w =  t._map.width * (t._tile.width/2) +   t._map.height * (t._tile.width/2),
                h= t._map.width * (t._tile.height/2) +   t._map.height * (t._tile.height/2)
                c = document.createElement("canvas");
                this.id++;
                c.id = name;
                c.width = w;
                c.height = h;
                c.style.position = 'absolute';
                c.style.left = "0px";
                c.style.top = -h+"px";
                Crafty.stage.elem.appendChild(c);
                //Save temporary canvas and viewport
                if(!this.tmp.canvas){
                    this.tmp.canvas = Crafty.canvas._canvas;
                }
                if(!this.tmp.viewport){
                    this.tmp.viewport = Crafty.viewport.rect();
                }
                //add layer
                t._layers[name] = {
                    data:data,
                    id:this.id
                };
                
                //Setup viewport with full prerender screen
                Crafty.viewport._x = 0;
                Crafty.viewport._y = 0;
                Crafty.viewport.width = w;
                Crafty.viewport.height = h;
                //Setup the context of offscreen canvas
                Crafty.canvas.context = c.getContext('2d');
                Crafty.canvas._canvas = c; 
                //PLace tiles
                for(var y=0,yl = t._map.height;y<yl;y++){
                    
                    for(var x=0,xl =t._map.width;x<xl;x++){
                        var i = y*t._map.height+x,d=data[i];
                         
                        if(d > 0 ){
                            var z = (y+1)*this.id,
                            tilename = 'Y'+y+'X'+x+'Z'+z;
                            var tile = Crafty.e("2D","Canvas",d,tilename);
                          
                            t.place(tile,x,y,this.id);
                     
                        }
                    }
                }
           
                Crafty.DrawManager.drawAll();
           
                //Restore settings
                Crafty.canvas._canvas = this.tmp.canvas;
                Crafty.canvas.context = this.tmp.canvas.getContext('2d');
                Crafty.viewport._x = this.tmp.viewport._x;
                Crafty.viewport._y = this.tmp.viewport._x;
                Crafty.viewport.width = this.tmp.viewport._w;
                Crafty.viewport.height = this.tmp.viewport._h;
               
            }
        },
        render:function(){
            var vp = Crafty.viewport.rect();
            console.log(vp);
            for(var i in this._layers){
                var cache = document.getElementById(i);
              
                Crafty.canvas.context.drawImage(cache, vp._x, vp._y,vp._w,vp._h);
            }
        },
        place:function(obj,x,y,layer){
            var pos = this.pos2px(x,y);
            if(!layer) layer = 1;
            var marginX = 0,marginY = 0;
            if(obj.__margin !== undefined){
                marginX = obj.__margin[0];
                marginY = obj.__margin[1];
            }
          
            obj.x = pos.left-obj.w/2+marginX;
            obj.y = pos.top-obj.h+marginY;
            obj.z = (y+1)*layer;
           
            
        },
        centerAt:function(x,y){
            var pos = this.pos2px(x,y);
            Crafty.viewport.x = -pos.left+Crafty.viewport.width/2;
            Crafty.viewport.y = -pos.top+Crafty.viewport.height/2;
        
        },
        area:function(offset){
            if(!offset) offset = 0;
            //calculate the corners
            var vp = Crafty.viewport.rect();
            vp._x -= (this._tile.width/2+offset*this._tile.width);
            vp._y -= (this._tile.height/2+offset*this._tile.height);
            vp._w += (this._tile.width/2+offset*this._tile.width);
            vp._h += (this._tile.height/2+offset*this._tile.height); 
            /*  Crafty.viewport.x = -vp._x;
            Crafty.viewport.y = -vp._y;    
            Crafty.viewport.width = vp._w;
            Crafty.viewport.height = vp._h;   */
 
            var grid = [];
            for(var y = vp._y,yl = (vp._y+vp._h);y<yl;y+=this._tile.height/2){
                for(var x = vp._x,xl = (vp._x+vp._w);x<xl;x+=this._tile.width/2){
                    var row = this.px2pos(x,y);
                    grid.push([~~row.x,~~row.y]);
                }
            }
            return grid;       
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

