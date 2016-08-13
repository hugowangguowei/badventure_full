/**
 * Created by wgw on 2016/4/18.
 */

var spriteManager = require("./controller/SpriteManager").getInstance();
var Geo = require("./model/Geo");
var baEventSource = require("../dep/baBasicLib/baEventSource");
var GUID = require("../dep/baBasicLib/util/GUID");
var TimeAnalyzer = require("../dep/baBasicLib/util/TimeAnalyzer");
var config = require("./config");
var SMT = require("./socket/socket_msgDefine").SERVER_MSG_TYPE;
var SSIT = require("./socket/socket_msgDefine").SSIT;
var recordManager = require("./controller/RecordManager").getInstance();

module.exports = Game;
var gameCount = 0;
var timeAnalyzer = new TimeAnalyzer(10);

function Game(initInfo){
    this.id = null;
    this.builderId = null;
    baEventSource.call(this);
    //绑定的游戏管理器
    this.GM = null;
    //调试状态
    this.isDebug = config.isDebug;
    //绑定地理信息
    this.geoInfo = new Geo();
    //玩家列表
    this.playerList = {};
    //精灵列表
    this.spriteList = {};
    //精灵计数
    this.spriteCount = 0;
    //障碍列表
    this.obstacleList = [];
    //章节事件
    this.chapEvent = null;
    //计时器
    this.timer = {
        proHandle:null,
        proFS:40,
        dataHandle:null,
        dataFS:40,
    };
    //数据池
    this.dataPool = [];
    //游戏信息记录
    this.gameLog = {
        startTime:0,
        curTime:0,
    };
    this.initialize(initInfo);
    //游戏基本信息（用于向客户端推送game的基本信息)
    this.gameInfo = {
        id:this.id,
        charaControl:{},
    };
}

Game.prototype = new baEventSource();
/**
 * 初始化
 * @param initInfo
 */
Game.prototype.initialize = function(initInfo){
    //this.id = GUID.getGUID();
    this.id = gameCount;
    gameCount++;
    this.gameLog.startTime = new Date().getTime();
};
/**
 * 载入游戏章节
 * @param chapterInfo
 */
Game.prototype.loadChapter = function(chapterInfo){
    var self = this;
    //载入地图
    if(chapterInfo.Map){
        this.geoInfo.generateByFile(chapterInfo.Map);
        self.fireEvent('geoChange');
    }
    //载入精灵
    if(chapterInfo.Sprite){
        var spriteList = chapterInfo.Sprite;
        for(var i in spriteList){
            var num = spriteList[i].num;
            for(var m = 0;m<num;m++){
                var sprite_i = spriteManager.generateSpriteByType(i);
                if(sprite_i){
                    sprite_i.id = i + "_" + m;
                    sprite_i.testSignal.watch = true;
                    this.addSprite(sprite_i,true);
                }else{
                    throw new Error("cannot generate new Sprite");
                }

            }
        }
    }
    //载入固定物（障碍）
    if(chapterInfo.obstacle){
        this.obstacleList = chapterInfo.obstacle;
    }
    //载入事件
    if(chapterInfo.event){
        this.chapEvent = chapterInfo.event;
    }

    this.startMachine();
};
/**
 * 开启游戏循环
 */
Game.prototype.startMachine = function(){
    var self = this;
    //事务处理
    this.timer.proHandle = setInterval(function(){
        self.autoCtrl();
        self.checkChapEvent();
        //timeAnalyzer.setBeginTime();
        var changedSprite = [];
        for(var i in self.spriteList){
            var sprite_i = self.spriteList[i];
            sprite_i.action();
            changedSprite.push(sprite_i.getOutPut());
        }
        self.dataPool.push(changedSprite);
        //timeAnalyzer.setEndTime();
    },this.timer.proFS);
    //数据处理
    this.timer.dataHandle = setInterval(function(){
        //单播
        var client_i;
        for(var i = 0;i<self._eventList.length;i++){
            client_i = self._eventList[i];
            if(client_i.sprite){
                client_i.socket.emit("event_msg",["refreshSprite",[client_i.sprite.getOutPutDetail()]]);
            }
        }

        //广播
        if(!self.dataPool.length)return;
        //timeAnalyzer.setBeginTime();
        var changes = self.dataPool.shift();
        self.fireEvent("refreshSprite",changes);
        //timeAnalyzer.setEndTime();
    },this.timer.dataFS);
};
/**
 * 关闭游戏循环
 */
Game.prototype.stopMachine = function(){
    clearInterval(this.timer.proHandle);
    clearInterval(this.timer.dataHandle);
    this.fireEvent('gameFinished',{type:"managerStop"});
};
/**
 * 游戏结束
 */
Game.prototype.endGame = function(winnerList,detail){
    //游戏结果通知
    var winner = "";
    if(!winnerList.length){
        winner = "no one win!";
    }
    else{
        for(var i = 0;i<winnerList.length;i++){
            winner += winnerList[i];
        }
        winner = "the winner:" + winner;
    }
    var detail = "gameOver," + winner;
    //胜利结果结算
    var sprite_i;
    outerLoop:
    for(var i in this.spriteList){
        sprite_i = this.spriteList[i];
        var isWin = false;
        innerLoop:
        for(var p =0;p<winnerList.length;p++){
            if(sprite_i.camp == winnerList[p]){
                isWin = true;
                break innerLoop;
            }
        }
        if(isWin){
            sprite_i.recordInfo.totalScore += 100;
        }
        else{
            sprite_i.recordInfo.totalScore += 10;
        }

    };
    //数据记录
    var record = recordManager.generateRecordFromGame(this);
    console.log(record);
    this.fireEvent("gameOver",{record:record,detail:detail});
    //游戏管理器关闭游戏
    this.GM.closeOneGame(this.id);
};
/**
 * 数据分析
 */
Game.prototype.dataAnalyse = function(){
    var quaTree = this.geoInfo.quaTree;
    var leafList = quaTree.getLeafNode();
    for(var i = 0;i<leafList.length;i++ ){

    }
};
/**
 * 游戏自动控制
 */
Game.prototype.autoCtrl = function(){
    //如果游戏运行超过10分钟。就会自动关掉
    var self = this;
    var t = new Date().getTime();
    if(self.gameLog.startTime == 0){
        self.gameLog.startTime = t;
    }
    self.gameLog.curTime = t;
};
/**
 * 检查章节中定义的事件
 */
Game.prototype.checkChapEvent = function(){
    if(!this.chapEvent)return;
    var event;
    for(var i = 0;i<this.chapEvent.length;i++){
        event = this.chapEvent[i];
        var result = event.call(this);
        if(result){
            result.call(this);
        }
    };
};
/**
 * 在游戏中添加客户端
 * @param ws
 */
Game.prototype.addPlayer = function(client,charaType){
    console.log(charaType);
    var self = this;
    //查找空余的sprite
    var sprite = self._getUnbindSprite(client,charaType);
    if(!sprite){
        client.socket.emit(SMT.SYSTEM_INFORM,{type:SSIT.JOIN_GAME_FAIL,detail:"no chara left in this room,please try another room"});
        return false;
    }
    //在事件监听器中添加ws
    this._eventList.push(client);
    client.game = this;
    client.sprite = sprite;
    this.playerList[client.UNI_id] = {
        read:true,
        write:true,
        super:false,
        controlObj:sprite,
    };
    var info = sprite.getOutPut();
    client.socket.emit(SMT.SYSTEM_INFORM,{type:SSIT.JOIN_GAME_SUC,detail:info});
    this.gameSyn(client);
};
/**
 * 获取未绑定的精灵
 * @param player
 * @param charaType
 * @returns {*}
 * @private
 */
Game.prototype._getUnbindSprite = function(player,charaType){
    var self = this;
    for(var i in self.spriteList){
        var sprite_i = self.spriteList[i];
        if(charaType){
            if(!sprite_i.controller&& sprite_i.type == charaType){
                sprite_i.controller = player;
                return sprite_i;
            }
        }
        else if(!sprite_i.controller){
            sprite_i.controller = player;
            return sprite_i;
        }
    }
    return false;
};
/**
 * 游戏同步
 * @param player
 */
Game.prototype.gameSyn = function(player){
    //向该玩家同步游戏消息
    var self = this;
    var spriteList = self.spriteList;
    var simpleInfo = [];
    var sprite_i;
    for(var i in spriteList){
        sprite_i = spriteList[i];
        var s_info = {
            id:sprite_i.id,
            ctrName:null,
            type:sprite_i.type
        };
        if(sprite_i.controller){
            s_info.ctrName = sprite_i.controller.UNI_id.split("_")[0];
        }
        simpleInfo.push(s_info);
    }
    player.socket.emit(SMT.GAME_SYN,simpleInfo);
    console.log("finishSyn");
    //广播该玩家进入游戏的消息(主要是更新控制者的消息）
    var spriteInfo = player.sprite.getOutPut();
    if(!spriteInfo)return;
    spriteInfo.ctrName = player.UNI_id.split("_")[0];
    self.fireEvent("refreshSprite",[spriteInfo]);
};
/**
 * 触发事件
 */
Game.prototype.fireEvent = function(){
    var self = this;
    if(!arguments.length){
        console.log("no arguments,you can't fire a event!");
        return;
    }

    var player_i;
    for(var i = 0,len = this._eventList.length;i<len;i++){
        player_i = this._eventList[i];
        var pack = this.recordMsg(arguments);
        player_i.socket.emit("event_msg",pack);
    }
};
//====================================================================================
/**
 * 用户输入
 * @param inputInfo
 * @param player
 */
Game.prototype.playerInput = function(inputInfo,player){
    var self  = this;
    var playerInfo = self._getPlayerInfoById(player.UNI_id);
    if(!playerInfo){
        player.socket.emit(SMT.SYSTEM_INFORM,{type:SSIT.PLAYER_INPUT_FAIL,detail:"playerNotFound"});
    };
    switch (inputInfo.type){
        case "system":
            self._systemInput(playerInfo,inputInfo.detail);
            break;
        case "addSprite":
            if(!playerInfo.write){
                player.socket.emit(SMT.SYSTEM_INFORM,{type:SSIT.PLAYER_INPUT_FAIL,detail:"noRight"});
                return;
            };
            self._addSprite(playerInfo,inputInfo.detail);
            break;
        case "refreshSprite":
            self._refreshSprite(playerInfo,inputInfo.detail);
            break;
        case "removeSprite":
            self._deleteSprite(playerInfo,inputInfo.detail);
            break;
    };
};
/**
 * 通过id获得玩家信息
 * @param id
 * @returns {*}
 * @private
 */
Game.prototype._getPlayerInfoById = function(id){
    return this.playerList[id];
};
Game.prototype._systemInput = function(playerInfo,detail){

};
Game.prototype._addSprite = function(playerInfo,detail){
    var sprite_i = spriteManager.generateSpriteByDetail(detail);
    this.addSprite(sprite_i);
    this.fireEvent("addSprite",detail);
};
Game.prototype._refreshSprite = function(playerInfo,detail){
    var sprite = playerInfo.controlObj;
    sprite.GMInput(detail);
};
Game.prototype._deleteSprite = function(detail){

};
/**
 * 添加对象
 * @param sprite
 */
Game.prototype.addSprite = function(sprite,isInit){
    var self = this;
    sprite.GM = self;
    sprite.addToGeo(self.geoInfo);
    self.spriteList[sprite.id] = sprite;
    self.spriteCount++;

    var isInit = isInit||false;
};
/**
 * 移除对象
 * @param sprite
 * @returns {boolean}
 */
Game.prototype.removeSprite = function(sprite){
    var self = this;
    for(var i in this.spriteList){
        if(this.spriteList[i] == sprite){
            sprite.removeFromGeo();
            delete this.spriteList[i];
            this.spriteCount--;
            return true;
        }
    }
    return false;
};
/**
 * 客户端程序调试
 * @param info
 */
Game.prototype.clientDebug = function(info){
    var self = this;
    switch (info.type){
        case "checkPack":
            _packCheck(info.packNum);
            break;
    }

    function _packCheck(packNum){
        console.log(self.msgList);
    }

}
/**
 * 测试代码——当{sprite}死亡的时候将该对象的id推入记录
 * @param sprite
 * @private
 */
Game.prototype._testPushDead = function (sprite) {
    var self = this;
    if(!self._testDeadList) {
        self._testDeadList = [];
    }
    self._testDeadList.push(sprite.id);
};
/**
 * 测试代码——检测当前对象是不是已经死掉了
 * @param sprite
 * @returns {boolean}
 * @private
 */
Game.prototype._testCheckDead = function(sprite){
    var self = this;
    if(!this._testDeadList)
        return false;
    for(var i = 0;i<self._testDeadList.length;i++){
        var deadID_i = self._testDeadList[i];
        if(sprite.id == deadID_i){
            console.log("!!error");
        }
    }
};
/**
 * 获取游戏的简单信息
 */
Game.prototype.getGameInfo = function(){
    var sprite;
    for(var i in this.spriteList){
        sprite = this.spriteList[i];
        if(sprite.controllable&&!sprite.controller){
            this.gameInfo.charaControl[sprite.type] = true;
        }
    }
    return this.gameInfo;

}
