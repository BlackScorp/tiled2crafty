$(function(){
    var files = [
   
    "img/grassland_structures.png",
    "img/grassland_water.png",
    "img/grassland_trees.png",
    "img/grassland.png",
    "img/male_player.png"

    ];
    var loader = new Kinetic.Loader(files);

    loader.onProgress(function(data){
        console.log(data.name);
    });
    loader.onError(function(data){
        console.warn("Error on Load "+data.name);
    });
    loader.onComplete(function(){
        var game = new Game();
        game.start();
    });
 
    loader.load();
});

var Game = function(){
    this.stage = new Kinetic.Stage({
       container:'game',
       width:800,
       height:600
    });
}
Game.prototype.update = function(){
    
    }
Game.prototype.start = function(){
    
    }
Game.prototype.pause = function(){
    
    }
Game.prototype.unpause = function(){
    
    }