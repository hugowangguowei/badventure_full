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
    Game.prototype.input = function (type,info){
        var self = this;
        switch (type){
            case "choice":
                self._choiceInput(info);
                break;
        }
    };
    Game.prototype._choiceInput = function(info){
        var self = this;
        var curNode = self.curNode;
        var choice = curNode.choiceList[info];
        if(!choice)return;
        var choiceResult = choice.result;
        var propChange = choiceResult.propChange;
        var locChange = choiceResult.locChange;
        var sceneChange = choiceResult.sceneChange;
        self._propChangeHandler(propChange);
        self._locChangeHandler(locChange);
        self._sceneChangeHandler(sceneChange);
    };
    Game.prototype._propChangeHandler = function(propChange){
    };
    Game.prototype._locChangeHandler = function(locChange){
    };
    Game.prototype._sceneChangeHandler = function(sceneChange){
        if(!sceneChange)return ;
        var scene = this.nodeList[sceneChange];
        if(!scene)throw new error("can't find a scene named" + sceneChange);
        this.curNode = scene;
        this.fireEvent("nodeChange");
    };
    Game.prototype.addEventToPool = function(eventType,info){
        var _info = info||0;
        this._eventPool[eventType] = {changed:true,args:_info};
    };
    return Game;
});