Crafty.extend({
    dungeon:{
        map:[],
        collision_map:[],
        w:50,
        h:50,
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
            if(this.createRoom(11,11,'n')) console.log(this.map);
            return this;
        },
        createRoom:function(x,y,direction){
            var w = Crafty.math.randomInt(4, this.room.w);
            var h = Crafty.math.randomInt(4, this.room.h);
            var d = 'n';
          
            var i = this.directions.indexOf(direction);
            if( i !== -1){
            
                d = this.directions[i];
            }
            var yStart = 0;
            var yEnd = 0;
            var xStart = 0;
            var xEnd = 0;
            var tile = 0;
            var ty = 0;
            var tx = 0;
            var tyl = 0;
            var txl = 0;
           
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
                        }
                    }

                  

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