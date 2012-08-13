///////////////////////////////////////////////////////////////////////
//  Image
///////////////////////////////////////////////////////////////////////
/**
 * Image constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 * @param {ImageObject} config.image
 * @param {Number} [config.width]
 * @param {Number} [config.height]
 * @param {Object} [config.crop]
 */
Kinetic.ImageList = Kinetic.Shape.extend({
    init: function(config) {
        this.shapeType = "ImageList";
        config.drawFunc = this.drawFunc;
        var c = document.createElement('canvas');
        c.width =config.width;
        c.height = config.height;
       
        var ctx = c.getContext('2d');
        ctx.drawImage(config.image,config.crop.x,config.crop.y,config.crop.width,config.crop.height,0,0,config.crop.width,config.crop.height);
        config.image = c;
        // call super constructor
        this._super(config);
    },
    drawFunc: function(context) {
        if(this.attrs.image) {
            var width = this.getWidth();
            var height = this.getHeight();
            
            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            this.fill(context);
            this.stroke(context);
  
              this.drawImage(context, this.attrs.image, 0, 0);
              
      
        }
    },
    /**
     * set width and height
     * @name setSize
     * @methodOf Kinetic.Image.prototype
     */
    setSize: function() {
        var size = Kinetic.Type._getSize(Array.prototype.slice.call(arguments));
        this.setAttrs(size);
    },
    /**
     * return image size
     * @name getSize
     * @methodOf Kinetic.Image.prototype
     */
    getSize: function() {
        return {
            width: this.attrs.width,
            height: this.attrs.height
        };
    },
    /**
     * get width
     * @name getWidth
     * @methodOf Kinetic.Image.prototype
     */
    getWidth: function() {
        if(this.attrs.width) {
            return this.attrs.width;
        }
        if(this.attrs.image) {
            return this.attrs.image.width;
        }
        return 0;
    },
    /**
     * get height
     * @name getHeight
     * @methodOf Kinetic.Image.prototype
     */
    getHeight: function() {
        if(this.attrs.height) {
            return this.attrs.height;
        }
        if(this.attrs.image) {
            return this.attrs.image.height;
        }
        return 0;
    },
    /**
     * apply filter
     * @name applyFilter
     * @methodOf Kinetic.Image.prototype
     * @param {Object} config
     * @param {Function} config.filter filter function
     * @param {Function} [config.callback] callback function to be called once
     *  filter has been applied
     */
    applyFilter: function(config) {
        try {
            if(!this.attrs.originalImage) this.attrs.originalImage = this.attrs.image;
            var trans = this._clearTransform();
            this.saveImageData(this.getWidth(), this.getHeight());
            this._setTransform(trans);

            config.filter.call(this, config);
            var that = this;
            Kinetic.Type._getImage(this.getImageData(), function(imageObj) {
                that.setImage(imageObj);

                if(config.callback) {
                    config.callback();
                }
            });
        }
        catch(e) {
            Kinetic.Global.warn('Unable to apply filter.');
        }
    },
    /**
     * clear filter
     * @name clearFilter
     * @methodOf Kinetic.Image.prototype
     * @param {Object} config
     * @param {Function} [config.callback] callback function to be called once
     *  filter has been cleared
     */
    clearFilter:function(config){
        try{
            this.setImage(this.attrs.originalImage);
            if(config.callback){
                config.callback();
            }
        }catch(e){
             Kinetic.Global.warn('Unable to clear filter.');
        }
    }
});

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Image, ['image', 'crop', 'filter']);
Kinetic.Node.addSetters(Kinetic.Image, ['width', 'height']);

/**
 * set width
 * @name setWidth
 * @methodOf Kinetic.Image.prototype
 * @param {Number} width
 */

/**
 * set height
 * @name setHeight
 * @methodOf Kinetic.Image.prototype
 * @param {Number} height
 */

/**
 * set image
 * @name setImage
 * @methodOf Kinetic.Image.prototype
 * @param {ImageObject} image
 */

/**
 * set crop
 * @name setCrop
 * @methodOf Kinetic.Image.prototype
 * @param {Object} config
 */

/**
 * set filter
 * @name setFilter
 * @methodOf Kinetic.Image.prototype
 * @param {Object} config
 */

/**
 * get crop
 * @name getCrop
 * @methodOf Kinetic.Image.prototype
 */

/**
 * get image
 * @name getImage
 * @methodOf Kinetic.Image.prototype
 */

/**
 * get filter
 * @name getFilter
 * @methodOf Kinetic.Image.prototype
 */