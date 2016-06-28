/**
 * Created by wgw on 2016/4/29.
 */

var Bear = require('../script/revengerRoad/chapter_1/sprite/Bear');
var Knight = require('../script/revengerRoad/chapter_1/sprite/Knight');
var DarkTower = require('../script/revengerRoad/chapter_1/sprite/DarkTower');
var Chief = require('../script/revengerRoad/chapter_1/sprite/Chief');
var Orc = require('../script/revengerRoad/chapter_1/sprite/Orc');

var instance = null;
exports.getInstance = function(){
    if(!instance){
        instance = new SpriteManager();
    }
    return instance;
}

function SpriteManager(){

}
SpriteManager.prototype ={
    generateSpriteByType:function(type){
        var sprite;
        switch (type){
            case 'bear':
                sprite = new Bear();
                break;
            case 'knight':
                sprite = new Knight();
                break;
            case 'darkTower':
                sprite = new DarkTower();
                break;
            case 'orc':
                sprite = new Orc();
                break;
            case 'chief':
                sprite = new Chief();
                break;
        }
        return sprite;
    },
    generateSpriteByDetail:function(detail){
        var sprite;
        switch (detail.type){
            case 'bear':
                sprite = new Bear(detail.prop);
                break;
            case 'knight':
                sprite = new Knight(detail.prop);
                break;
            case 'darkTower':
                sprite = new DarkTower(detail.prop);
                break;
            case 'orc':
                sprite = new Orc(detail.prop);
                break;
            case 'chief':
                sprite = new Chief(detail.prop);
                break;
        }
        return sprite;
    }
}
