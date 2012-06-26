///////////////////////////////////////////////////////////////////////
//  Sprites
///////////////////////////////////////////////////////////////////////
/**
 * Sprites constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Sprites = function() {
    this.setDefaultAttrs({
        width: 1,
        height: 1
    });
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
};
/*
 * Sprites methods
 */
Kinetic.Sprites.prototype = {
    add:function(x,y){
        console.log(this.attrs);
    }
};
// extend Shape
Kinetic.GlobalObject.extend(Kinetic.Sprite, Kinetic.Shape);

// add setters and getters
Kinetic.GlobalObject.addSettersGetters(Kinetic.Sprite, ['animation', 'animations', 'index']);
