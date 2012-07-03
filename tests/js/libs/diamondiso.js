
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

        place:function(obj,x,y,layer){
            var pos = this.pos2px(x,y);
            if(!layer) layer = 1;
            var marginX = 0,marginY = 0,posX=0,posY=0,posZ=0;
            if(obj.__margin !== undefined){
                marginX = obj.__margin[0];
                marginY = obj.__margin[1];
            }
            posX =  pos.left-obj.w/2+marginX;
            posY = pos.top-obj.h+marginY;
            posZ = (y+1)*layer;
            obj.attr({
                x:posX,
                y:posY,
                z:posZ
            });
           
            
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

Crafty.c("IsoLayer",{
    canvas:null,
    zones:{},
    w:0,
    h:0,
    init:function(){
            
    
        var rect ={
            _x:0,_y:0,_w:800,_h:600
        };
                
        var c,t = Crafty.diamondIso,w =  t._map.width * (t._tile.width/2) +   t._map.height * (t._tile.width/2),
        h= t._map.width * (t._tile.height/2) +   t._map.height * (t._tile.height/2);
        this.h = h;
        this.w = w;
        var my = Math.round(h/Crafty.viewport.height),mx = Math.round(w/Crafty.viewport.width);
        for(var y = 0;y<my;y++){
            for(var x = 0;x<mx;x++){
                var name = 'Y'+y+'X'+x;
                c = document.createElement('canvas');
                c.id=name;
                c.width = rect._w;
                c.height = rect._h;
                c.style.position = 'absolute';
                c.style.left = x*rect._w+'px';
                c.style.top = y*rect._h+'px';
                 document.body.appendChild(c);
                this.zones[name] = c.getContext("2d");
            }
        }
             
         
     
    } ,
    addTile:function(img,x,y){
       
        var zy = ~~(y/Crafty.viewport.height),zx = ~~(x/Crafty.viewport.width);
        x -=(zx*Crafty.viewport.width);
        y -=(zy*Crafty.viewport.height);
        var name = 'Y'+zy+'X'+zx;
    
        var zone = this.zones[name];
        if(zone)
        zone.drawImage(img,x,y);
    else console.log(name);
             
    },
    render:function(){
        var ctx = Crafty.canvas.context,rect=Crafty.viewport.rect();
            
        console.log("Destination Canvas");
        console.log(ctx);
        console.log("Zones");
        console.log(this.zones);
        console.log("Viewport Rect");
        console.log(rect);
       // ctx.drawImage(this.canvas,rect._x,rect._y);
            
    }
});

