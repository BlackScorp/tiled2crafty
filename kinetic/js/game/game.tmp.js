$(function(){
  
    var toLoad = [
    "img/grassland_structures.png",
    "img/grassland_water.png",
    "img/grassland_trees.png",
    "img/grassland.png",
    "img/male_player.png"
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
        $.ajax({
            url:"js/maps/frontier_plains.json",
            success:function(data){
                game.run(data);
            }
        });
    });
 
    loader.load();
});

var Game = function(){
    this.stage = new Kinetic.Stage({
        container:'game',
        width:800,
        height:600
    });
    this.paused = false;
  
}
Game.prototype.load = function(file,callback){

    }
Game.prototype.update = function(){
    
    }
Game.prototype.run = function(data){
    console.log(data);
   
    this.stage.onFrame(function(){
        if(!this.paused) return;
    });
    this.stage.start();
}
Game.prototype.pause = function(){
    this.paused = true;
}
Game.prototype.unpause = function(){
    this.paused = false;
}