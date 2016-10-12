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
    /**
     * 初始化
     * @param div
     * @param model
     */
    GameView.prototype.initialize = function(div,model){
        this.div = div;
        this.model = model;
        this.addOriListeners();
        this.addBasicStruct();
    };
    /**
     * 添加初始监听
     */
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
     * 添加基本元素
     */
    GameView.prototype.addBasicStruct = function(){
        var self = this;
        var h = screen.height;
        var c_w = parseInt(h * 0.65);var c_h = parseInt(h * 0.65);

        var textArea = document.getElementById("mainText");

        var ch_1 = document.getElementById("choice_0");
        ch_1.onclick = function(){
            self.model.input("choice",0);
        }
        var ch_2 = document.getElementById("choice_1");
        ch_2.onclick = function(){
            self.model.input("choice",1);
        }
        var ch_3 = document.getElementById("choice_2");
        ch_3.onclick = function(){
            self.model.input("choice",2);
        }
        var ch_4 = document.getElementById("choice_3");
        ch_4 .onclick = function(){
            self.model.input("choice",3);
        }
    };

    return GameView;
})