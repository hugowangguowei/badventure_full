/**
 * Created by wgw on 2016/6/27.
 */

define(function(require){
    var View = require("baBasicLib/view/View");
    var getGUID = require("baBasicLib/util/GUID");
    var baLib = require("baBasicLib/util/baLib");

    function SM_View(div,model){
        View.call(this);
        this.id = getGUID();
        this.div = div;
        this.cache = null;
        this.canvas = null;
        this.cw = 0;
        this.ch = 0;
        this.initialize(div,model)
    }

    SM_View.prototype = new View();
    SM_View.prototype.initialize = function(div,model){
        if(!div||!model){
            alert("数据绑定不完整");
        }
        this.div = div;
        this.model = model;
        this.strategy = model.curStrategy;
        this.addOriListeners();
        this.addBasicStruct();
        this.initCanvas();
        this.draw();
    };
    SM_View.prototype.addOriListeners = function(){

    };
    SM_View.prototype.addBasicStruct = function(){
        this.div.innerHTML = "" +
            "<input type='button' id = 'sB_0' value = '新建' class='sB'>" +
            "<input type='test' id = 'sT_0' placeholder = '阵型名称'>"+
            "<input type='button' id = 'sB_1' value = '提交' class = 'sB'>"+
            "<hr>"+
            "<input type='button' id = 'sB_2' value ='添加' class='sB'>" +
            "<input type='button' id = 'sB_3' value ='移除' class='sB'>" +
            "<hr>" +
            "<h6 id = 'sH_0'>剩余可布置兵力：</h6>"+
            "<hr>"+
            "<canvas id = 'sCanvas'></canvas>";
        this.canvas = document.getElementById("sCanvas");
        this.canvas.width = 300;
        this.canvas.height = 300;
        this.cw = this.canvas.width;
        this.ch = this.canvas.height;
        $("#sT_0").hide();
        $('#sB_1').hide();
        $('#sB_2').hide();
        $('#sB_3').hide();
        $('#sH_0').hide();

        $("#sB_0").click(function(){
            $("#sB_0").hide();
            $("#sT_0").show();
            $('#sB_1').show();
            $('#sB_2').show();
            $('#sB_3').show();
            $('#sH_0').show();
        });

    };
    SM_View.prototype.initCanvas = function(){
        this.cache = document.createElement("canvas");
        this.cache.width = 300;
        this.cache.height = 300;
        if(!this.strategy){
            return null;
        }
        var w = this.strategy.width;
        var _w = this.cw/w;
        var h = this.strategy.height;
        var _h = this.ch/h;
        var cxt = this.cache.getContext("2d");
        cxt.strokeStyle = "black";
        for(var i = 0;i<w;i++){
            for(var p = 0;p<h;p++){
                cxt.strokeRect(_w*i,_h*p,_w,_h);
            }
        }
    };
    SM_View.prototype.draw = function(){
        var cxt = this.canvas.getContext("2d");
        cxt.drawImage(this.cache,0,0);
        var data = this.strategy.data;
        var w = this.strategy.width;
        var h = this.strategy.height;
        var _w = this.cw/w;
        var _h = this.cw/h;
        for(var i = 0,len = data.length;i<len;i++){
            var x = i%w;
            var y = parseInt(i/w);
            switch (data[i]){
                case 0:
                    break;
                case 1:
                    cxt.fillStyle = "red";
                    cxt.fillRect(_w*x,_h*y,_w,_h);
                    cxt.fill();
                    break;
                case 2:
                    cxt.fillStyle = "blue";
                    cxt.fillRect(_w*x,_h*y,_w,_h);
                    cxt.fill();
                    break;
            }
        }
    }

    return SM_View;
});