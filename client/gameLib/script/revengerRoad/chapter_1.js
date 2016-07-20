/**
 * Created by wgw on 2016/4/27.
 * chapter1 猎熊者
 */

define(function(require){
    var mapManager = require('gameLib/controller/MapManager').getInstance();
    return{
        Map:mapManager.getMap("RR_c1"),
        Sprite:{
            "captain":{num:2},
            "knight":{num:15},
            "chief":{num:2},
            //"darkTower":{num:1},
            "bear":{num:30}
        },
        obstacle:[
            {type:"line",node:[100,100,200,200]},
            {type:"line",node:[100,500,500,100]}
        ]
    }
})