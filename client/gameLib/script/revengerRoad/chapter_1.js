/**
 * Created by wgw on 2016/4/27.
 * chapter1 猎熊者
 */

define(function(require){
    var mapManager = require('gameLib/controller/MapManager').getInstance();
    return{
        Map:mapManager.getMap("RR_c1"),
        Sprite:{
            "chief":{num:1},
            "darkTower":{num:1},
            "knight":{num:10},
            "bear":{num:30}
        }
    }
})