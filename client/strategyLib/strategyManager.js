/**
 * Created by wgw on 2016/6/27.
 */

define(function(require){

    var SM_View = require("./view/SM_View");
    var Strategy = require("./model/Strategy");

    function StrategyManager(div,game){
        this.game = game;
        this.div = div;
        this.curStrategy = null;
        this.initialize(div);
    }

    StrategyManager.prototype.initialize = function(div){
        //当前战略
        this.curStrategy = new Strategy();
        //添加视图
        var sView = new SM_View(div,this);
    }

    StrategyManager.prototype.input = function(){
    }

    return StrategyManager;

});