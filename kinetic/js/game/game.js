var Game = function(config){
    this._config = config;
}

Game.prototype ={
    _stage:null,
    _window:null,
    _map:null,
    run:function(){
        this._init();
    },
    _init:function(){
        this._window = $('#game');
        this._stage = new Kinetic.Stage({
            container:'game',
            width:this._window.width(),
            height:this._window.height()
        });
        this._map = new Map(this._stage);
        this._map.load(this._config.map);
        this._map.draw(this._config.x,this._config.y);
    }
}

