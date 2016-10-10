/**
 * Created by wgw on 2016/4/18.
 */
define(function(require){
    var spriteManager = require("gameLib/controller/SpriteManager").getInstance();
    var baEventSource = require("baBasicLib/baEventSource");
    var SceneNode = require("rpgLib/model/SceneNode");
    var Scene = SceneNode.SceneNode;
    var Choice = SceneNode.SceneChoice;
    var errorCheck = require("gameLib/webSocket/WS_errorCheck");
    //TODO 要写成单例
    function Game(initInfo){
        baEventSource.call(this);
        this.curNode = null;
        this.nodeList = {};
        this.controlSprite = null;
        this.initialize(initInfo);
    }

    Game.prototype = new baEventSource();
    Game.prototype.initialize = function(initInfo){};
    Game.prototype.loadChapter = function(chapter){
        //获取所有node
        var nodeList = chapter.nodeList;
        for(var i in nodeList){
            var nodeInfo = nodeList[i];
            var node = new Scene(i);
            node.describe = nodeInfo.describe;
            node.loc = nodeInfo.loc;
            var choiceList = nodeInfo.choiceList;
            for(var m = 0;m<choiceList.length;m++){
                var cInfo_i = choiceList[m];
                var choice_i = new Choice();
                choice_i.str = cInfo_i.str;
                choice_i.result = cInfo_i.result;
                node.choiceList.push(choice_i);
            }

            this.nodeList[i] = node;
        }

        this.curNode = this.nodeList[chapter.defaultNode];
        this.startEngine();
    };
    Game.prototype.startEngine = function(){
        this.fireEvent("nodeChange");
    };
    Game.prototype.input = function (type,info,packNum){
        var self = this;
        switch (type){
            case "addSprite":
                var sprite_i = spriteManager.generateSpriteByDetail(info);
                self.addSprite(sprite_i);
                //self.fireEvent("spriteChange");
                self.addEventToPool("spriteChange");
                break;
            case "refreshSprite":
                for(var i = 0;i<info.length;i++){
                    var sInfo = info[i];
                    var id = sInfo.id;
                    var sprite = self.spriteList[id];
                    if(sprite){
                        for(var m in sInfo){
                            sprite[m] = sInfo[m];
                        }
                        //sprite.refreshGeo();
                    }
                    else{
                        //之所以会有{！sprite}事件的发生，是因为角色死亡事件立刻触发
                        //但是角色更新操作需要当前所有对象更新完成后才会触发事件
                        //所以有可能当一个角色先执行了动作，该动作会被推送入refreshList
                        //然后在同一帧，该角色被杀死了，就会出现这个问题
                        //更新机制还需要改进。
                    }
                }
                //self.fireEvent("spriteChange",info);
                self.addEventToPool("spriteChange",info);
                break;
            case "removeSprite":
                self.removeSpriteById(info);
                //self.fireEvent("spriteChange",info);
                self.addEventToPool("spriteChange",info);
                break;
            case "gameOver":
                alert(info.detail);
                //self.fireEvent("recordChange",info.record);
                self.addEventToPool("recordChange",info.record);
                break;
        }
    };
    Game.prototype.addEventToPool = function(eventType,info){
        var _info = info||0;
        this._eventPool[eventType] = {changed:true,args:_info};
    };
    return Game;
});