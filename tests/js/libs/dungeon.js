Crafty.extend({
    dungeon:{
        map:[],
        collision_map:[],
        rooms:{},
        w:100,
        h:100,
        tiles:{
            unused:0,
            empty:1,
            solid:2,
            wall:{
                s:3,
                n:3,
                e:3,
                w:3
            },
            door:{
                s:4,
                n:4,
                e:4,
                w:4
            },
            stairs:{
                s:5,
                n:5,
                e:5,
                w:5
            }
        },
        room:{
            w:10,
            h:10
        },
        maxObjects:0,
        directions:['n','e','s','w'],
        init:function(w,h){
            for(var y=0;y<this.h;y++){
                for(var x = 0;x<this.w;x++){
                    this.setCell(x,y,this.tiles.unused);
                }
            }
            this.createRoom(11,11);
            this.createRoom(40,40);
                      this.createRoom(10,30);
            console.log(this.rooms);
            return this;
        },
        createRoom:function(x,y){
            var w = Crafty.math.randomInt(4, this.room.w);
            var h = Crafty.math.randomInt(4, this.room.h);
            var d = Crafty.math.randomElementOfArray(this.directions);
      
            var yStart = 0;
            var yEnd = 0;
            var xStart = 0;
            var xEnd = 0;
            var tile = 0;
            var ty = 0;
            var tx = 0;
            var tyl = 0;
            var txl = 0;
            var room = 'Y'+y+'X'+x;
            var rx = 0;
            var ry = 0;
            var data = [];
            switch(d){
                case 'n':{
                    yStart = ~~(y);
                    yEnd = ~~(y-h);
                    xStart = ~~(x-(w/2));
                    xEnd = ~~(x +((w+1)/2));
                  
                    for(ty = yStart,tyl = yEnd;ty>tyl;ty-- ){
                        if(ty < 0 || ty > this.h) return false;
                        for(tx = xStart,txl = xEnd;tx<txl;tx++){
                            if(tx < 0 || tx > this.w) return false;
                           
                            if(!this.getCell(tx,ty,this.tiles.unused)) return false;
                        }
                    }
                    
        
                    for( ty = yStart,tyl = yEnd;ty>tyl;ty-- ){
                       
                        for( tx = xStart,txl = xEnd;tx<txl;tx++){
                            if(tx == xStart) tile = this.tiles.wall.w;
                            else if(tx == xEnd) tile = this.tiles.wall.e;
                            else if(ty == yStart) tile = this.tiles.wall.n;
                            else if(ty == yEnd) tile = this.tiles.wall.s;
                            else tile = this.tiles.empty;
                            this.setCell(tx,ty,tile);
                            
                            data[(rx + w * ry)] = tile;
                            rx++;
                        }
                        ry ++;
                    }
                    this.rooms[room] = {size:{w:w,h:h},data:data};
                    break;
                }
                case 'e':{
          
                    yStart = ~~(y-h/2);
                    yEnd = ~~(y+(h+1)/2);
                    xStart = ~~(x);
                    xEnd = ~~(x+w);
                  
                    for(ty = yStart,tyl = yEnd;ty<tyl;ty++ ){
                        if(ty < 0 || ty > this.h) return false;
                        for(tx = xStart,txl = xEnd;tx<txl;tx++){
                            if(tx < 0 || tx > this.w) return false;
                            if(!this.getCell(tx,ty,this.tiles.unused)) return false;
                        }
                    }
                 
    
                    for( ty = yStart,tyl = yEnd;ty<tyl;ty++ ){
                        for( tx = xStart,txl = xEnd;tx<txl;tx++){
                            if(tx == xStart) tile = this.tiles.wall.w;
                            else if(tx == xEnd) tile = this.tiles.wall.e;
                            else if(ty == yStart) tile = this.tiles.wall.n;
                            else if(ty == yEnd) tile = this.tiles.wall.s;
                            else tile = this.tiles.empty;
                            this.setCell(tx,ty,tile);
                            
                           data[(rx + w * ry)] = tile;
                            rx++;
                        }
                        ry++;
                    }
                    this.rooms[room] = {size:{w:w,h:h},data:data};
                    break;
                }
                 
                case 's':{
     
                    yStart = ~~(y);
                    yEnd = ~~(y+h);
                    xStart = ~~(x-w/2);
                    xEnd = ~~(x+(w+1)/2);
                  
                    for(ty = yStart,tyl = yEnd;ty<tyl;ty++ ){
                        if(ty < 0 || ty > this.h) return false;
                        for(tx = xStart,txl = xEnd;tx<txl;tx++){
                            if(tx < 0 || tx > this.w) return false;
                           
                            if(!this.getCell(tx,ty,this.tiles.unused)) return false;
                        }
                    }
                
     
                    for( ty = yStart,tyl = yEnd;ty<tyl;ty++ ){
                        for( tx = xStart,txl = xEnd;tx<txl;tx++){
                            if(tx == xStart) tile = this.tiles.wall.w;
                            else if(tx == xEnd) tile = this.tiles.wall.e;
                            else if(ty == yStart) tile = this.tiles.wall.n;
                            else if(ty == yEnd) tile = this.tiles.wall.s;
                            else tile = this.tiles.empty;
                            this.setCell(tx,ty,tile);
                            
                        data[(rx + w * ry)] = tile;
                            rx++;
                        }
                        ry++;
                    }
                    this.rooms[room] = {size:{w:w,h:h},data:data};

                    break;
                }
                case 'w':{
                
                    yStart = ~~(y-h/2);
                    yEnd = ~~(y+(h+1)/2);
                    xStart = ~~(x);
                    xEnd = ~~(x-w);
                  
                    for(ty = yStart,tyl = yEnd;ty<tyl;ty++ ){
                        if(ty < 0 || ty > this.h) return false;
                        for(tx = xStart,txl = xEnd;tx>txl;tx--){
                            if(tx < 0 || tx > this.w) return false;
                           
                            if(!this.getCell(tx,ty,this.tiles.unused)) return false;
                        }
                    }
                   
             
                    for( ty = yStart,tyl = yEnd;ty<tyl;ty++ ){
                       
                        for( tx = xStart,txl = xEnd;tx>txl;tx--){
                            if(tx == xStart) tile = this.tiles.wall.w;
                            else if(tx == xEnd) tile = this.tiles.wall.e;
                            else if(ty == yStart) tile = this.tiles.wall.n;
                            else if(ty == yEnd) tile = this.tiles.wall.s;
                            else tile = this.tiles.empty;
                            this.setCell(tx,ty,tile);
                       
                       data[(rx + w * ry)] = tile;
                            rx++;
                        }
                        ry++;
                    }
                    this.rooms[room] = {size:{w:w,h:h},data:data};

                    break;
                }
            }
            
            return true;
             
        },
        createDungeon:function(){
            
        },
        setCell:function(x,y,value){
            var i = x + this.w * y;
            this.map[i] = value;
          
        },
        getCell:function(x,y,value){
            var i = x + this.w * y;
        
            if(value === undefined){
                return this.map[i];
            }else {
                
                return this.map[i] === value;
            }
      
        }
    }
});