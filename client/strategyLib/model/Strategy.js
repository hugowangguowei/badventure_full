/**
 * Created by wgw on 2016/6/27.
 */
define(function(require){
    function Strategy(){

        this.width = 10;
        this.height = 10;
        this.data = new Int8Array(this.width*this.height);
        this.data[parseInt(this.width/2) + this.width*parseInt(this.height/2)] = 1;
    }
    Strategy.prototype.initialize = function(){
    }
    Strategy.prototype.input = function(){

    }

    return Strategy;

})