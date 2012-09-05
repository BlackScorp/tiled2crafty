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
           //  width:640,
           // height:480
            width:this._window.width(),
           height:this._window.height()
        });
        this._map = new Map(this._stage);
        this._map.load(this._config);
        var map = this._map;
        var stage = this._stage;
        var FPS = 25;
  
        var speed = 2;
        var frame = 0;
        var animation = new Kinetic.Animation({
            func:function(frame){
               
                if(!map.isReady()) return;
                stats.begin(); 
                  stage.attrs.y+=speed;
                if(++frame % FPS == 0) return;
                 
                  map.draw(); 
             
               
                stats.end();
            
                  
            }
        });
        animation.start();
       
    }
}
