Crafty.extend({
    dungeon:{
        _roomSize:{
            w:{
                min:10,
                max:17
            },
            h:{
                min:10,
                max:17
            }
        },
        _dungeon:{
            w:100,
            h:100
        },
        _maxRooms:0,
        _rooms:[],
        _roomID:0,
        _doors:[],
        
        init:function(){
            var roomSize = this._roomSize.w.max*this._roomSize.h.max;
            var dungeonSize = this._dungeon.w*this._dungeon.h;
            this._maxRooms = ~~(dungeonSize/roomSize);
           
            for(var r = 0;r<this._maxRooms;r++){
                this.createRoom();
            }
              
            return true;
        },
        createRoom:function(){
            var r = this._roomSize;
            this._roomID++;
            var w = Crafty.math.randomInt(r.w.min,r.w.max);
            var h = Crafty.math.randomInt(r.h.min,r.h.max);
            var t =this;
            Crafty.scene("Room"+this._roomID,function(){
            var room = [];
            
            
                  var doors = [0,1,2,3];
                  var s;
                for(var y = 1,yl = h;y<=yl;y++){
                    var i = y;
                    for(var x = 1,xl = w;x<=xl;x++){
                        var type='Ground',tile=null;
                        
                        if(x == 1 || x == w || y == 1 || y == h){
                            if(x == 1) s = 0;
                            else if(x == w) s = 1;
                            else if(y == 1) s = 2;
                            else if(y == h) s = 3;
                            
                          
                            type = 'Wall';  
                            var aDoor= Crafty.math.randomInt(0,100);
                            if(aDoor >90 && doors[s]>=0){
                                type = 'Door';
                                t._doors.push({
                                    'destination':'Room'+t._roomID,
                                    'direction':s
                                });
                                doors[s] = -1;
                            }
                              if(x == 1 && y == 1) type = 'Corner';
                            if(x == 1 && y == h) type = 'Corner';
                            if(x == w && y == 1) type = 'Corner';
                            if(x == w && y == h) type = 'Corner';    
                            
                        }
                        tile = Crafty.e("2D,Canvas,"+type);
                        tile.attr({x:x*tile.w,y:y*tile.h});
                        
                       room.push(type);
                            
                       i++
                    }
                }
               
           });
       
            
        },
        connectDoors:function(){
            
        }
      
    }
});