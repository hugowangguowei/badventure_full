/**
 * Created by wgw on 2016/5/5.
 */
define(function(require){
    var View = require("baBasicLib/view/View");
    var getGUID = require("baBasicLib/util/GUID");
    var baLib = require("baBasicLib/util/baLib");

    function GameView(div,model){
        View.call(this,div,model);
        this.id = getGUID();
        this.div = null;
        this.model = null;
        this.isObstacleInit = false;
        this.initialize(div,model);
    };
    GameView.prototype = new View();
    GameView.prototype.initialize = function(div,model){
        this.div = div;
        this.model = model;
        this.addOriListeners();
        this.addBasicStruct();
    };
    GameView.prototype.addOriListeners = function(){
        var self = this;
        var prop = {
            id: this.id,
            class: "ori"
        };

        this.model.addListener("nodeChange",prop,function(){

            self.draw();
        });
    };
    /**
     * 绘制
     */
    GameView.prototype.draw = function(){
        var curNode = this.model.curNode;
        var textArea = $("#mainText");
        textArea.val(curNode.describe);
        var choiceList = curNode.choiceList;
        var choice_i,choice_str;
        for(var i = 0;i<choiceList.length||i<4;i++){
            var btn_i = $("#choice_" + i);
            choice_i = choiceList[i];
            if(choice_i){
                choice_str = choice_i.str;
                btn_i.show();
                btn_i.val(choice_str);
            }else{
                btn_i.hide();
            }
        }

    };
    /**
     * 绘制背景图片
     */
    GameView.prototype.drawBgPic = function(canvas){
        var cxt = canvas.getContext("2d");
        cxt.clearRect(0,0,canvas.width,canvas.height);
        var bgImage = new Image();
        //bgImage.src = wsConfig.WS_URL +"/client/image/c1_map.png";
        //bgImage.src = "localHost:18080/client/image/DarkTower.png";
        bgImage.src = "http://badventure.duapp.com/client/image/c1_map.png";
        bgImage.onload = function(){
            cxt.drawImage(bgImage,0,0,canvas.width,canvas.height);
        }
    };
    /**
     * 添加基本元素
     */
    GameView.prototype.addBasicStruct = function(){
        var self = this;
        var h = screen.height;
        var c_w = parseInt(h * 0.65);var c_h = parseInt(h * 0.65);

        var textArea = document.getElementById("mainText");


        var canvas = this.div;
        canvas.style.width = c_w + "px";
        canvas.style.height = c_h + "px";
        canvas.width = c_w;
        canvas.height = c_h;

        self._geoCache = document.createElement("canvas");
        self._geoCache.width =c_w;
        self._geoCache.height = c_h;

        self._spriteCache = document.createElement('canvas');
        //self._spriteCache = document.getElementById("spCanvas");
        self._spriteCache.width = c_w;
        self._spriteCache.height = c_h;

        self._quaTreeCache = document.createElement('canvas');
        self._quaTreeCache.width = c_w;
        self._quaTreeCache.height = c_h;

        self._obstacleCache = document.createElement('canvas');
        self._obstacleCache.width = c_w;
        self._obstacleCache.height = c_h;

        self._bgPicCache = document.createElement('canvas');
        self._bgPicCache.width = c_w;
        self._bgPicCache.height = c_h;
        self.drawBgPic(self._bgPicCache);
    };
    return GameView;
})