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
          var stats = new Stats();
    $('#stats').append(stats.domElement);
        this._stage = new Kinetic.Stage({
            container:'game',
            width:this._window.width(),
            height:this._window.height()
        });
        this._map = new Map(this._stage);
        this._map.load(this._config);
        var map = this._map;
        var stage = this._stage;
        var animation = new Kinetic.Animation({
            func:function(frame){
                    stats.update();
                    stage.attrs.y += 2;
                  //  map.draw();
            }
        });
        animation.start();
       
    }
}

