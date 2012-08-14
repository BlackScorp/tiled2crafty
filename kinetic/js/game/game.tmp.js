$(function(){
  
    var toLoad = [
    {
        id:"tall structures",
        src:"img/grassland_structures.png"
    },

    {
        id:"water",
        src:"img/grassland_water.png"
    },

    {
        id:"trees",
        src:"img/grassland_trees.png"
    },

    {
        id:"grassland",
        src:"img/grassland.png"
    },

    {
        id:"male player",
        src:"img/male_player.png"
    }
    ];
    var loader = new Kinetic.Loader(toLoad);

    loader.onProgress(function(data){
        console.log(data);
    });
    loader.onError(function(data){
        console.warn("Error on Load "+data.name);
    });
    loader.onComplete(function(){
        var game = new Game();
        game.load('frontier_plains.json');
       
    });
 
    loader.load();
});

var Game = function(){
    this.gameDiv = $('#game');
    this.stage = new Kinetic.Stage({
        container:'game',
        width:this.gameDiv.width(),
        height:this.gameDiv.height()
    });
    this.paused = false;
  
}
Game.prototype.load = function(file){
    var game = this;

    $.ajax({
        url:"js/maps/"+file,
        success:function(data){
            game.run(data);
        }
    });
}
Game.prototype.render = function(diff){
  
    
}
Game.prototype.update = function(){
    
   
    
}
Game.prototype.run = function(data){
 
    //create Map
    var map = new Map(data);
    map.init(this.stage);
    var lastTime = 0;
    var game = this;
    var fps = 1;
 
   
    this.stage.onFrame(function(frame){
        if(!!game.paused) return;
        var currTime = +new Date;
        game.update();
        var timeToCall = Math.max(0, ~~(1000/fps) - (currTime - lastTime));
    
        var id = window.setTimeout(function() {
            game.render(timeToCall);
        },
        timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    });
    this.stage.start();
    
    
}
Game.prototype.pause = function(){
    this.paused = true;
}
Game.prototype.unpause = function(){
    this.paused = false;
}

