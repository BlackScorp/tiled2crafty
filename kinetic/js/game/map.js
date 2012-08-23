var Map = function(stage){
    this._stage = stage;
}

Map.prototype = {
    _data:null,
    draw:function(x,y){
        
    },
    load:function(mapName){
        var map = this;
        $.ajax({
            url:"js/maps/"+mapName+'.json',
            success:function(data){
                map._setData(data);
                map._loadImages();
            }
        });
    },
    _setData:function(data){
        this._data = data;
    },
    _loadImages:function(){
        var images = [];
        for(var i =0,il = this._data.tilesets.length;i<il;i++){
            var tileset = this._data.tilesets[i];
        }
    },
    _init:function(){
        
    }
}