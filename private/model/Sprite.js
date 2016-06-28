/**
 * Created by wgw on 2016/4/18.
 */

module.exports = Sprite;

function Sprite(id){
    this.id = id;
    this.controllable = true;
    this.controller = null;
    this.geoInfo = {
    }
}
Sprite.prototype = {
    initialize:function(){

    },
    addToGeo:function(geoInfo){

    },
    setQuaTreeNode:function(node){
        this.geoInfo.quaTreeNode = node;
    },
    removeQuaTreeNode:function(){
        this.geoInfo.quaTreeNode = 0;
    },
    action:function(){

    },
    getOutPut: function () {
        return null;
    }
}