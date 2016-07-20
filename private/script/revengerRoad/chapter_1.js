/**
 * Created by wgw on 2016/4/27.
 * chapter1 猎熊者
 */


var mapManager = require('../../controller/MapManager').getInstance();

exports.Map = mapManager.getMap("RR_c1");
exports.Sprite = {
    "captain":{num:2},
    "knight":{num:15},
    "chief":{num:2},
    //"darkTower":{num:1},
    "bear":{num:30}
};
exports.event = [
    function(){
        var sprite_i;
        for(var i in this.spriteList){
            sprite_i = this.spriteList[i];
            if(sprite_i.camp == "Orc"){
                return false;
            }
        };
        return function(){
            this.endGame(["Orc"],"洛汗骑兵赢得了战争~");
        };
    },
    function(){
        var sprite_i;
        for(var i in this.spriteList){
            sprite_i = this.spriteList[i];
            if(sprite_i.camp == "Rohan"){
                return false;
            }
        };
        return function(){
            this.endGame(["Orc"],"半兽人赢得了战争~");
        };
    },
    function(){
        if(this.gameLog.curTime - this.gameLog.startTime > 240000){
            return function(){
                this.endGame([],"时间流逝完了~正如游戏已经结束");
            };
        }
        return 0;
    }
];
exports.obstacle = [
    {type:"line",node:[100,100,200,200]},
    {type:"line",node:[100,500,500,100]}
];
