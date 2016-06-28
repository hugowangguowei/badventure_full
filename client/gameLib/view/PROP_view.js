/**
 * Created by wgw on 2016/6/10.
 */
define(function(require){
    var View = require("baBasicLib/view/View");
    var viewConfig = require("geoLib/view/ViewConfig");
    var listenerType = viewConfig.listenerType;
    var listenerClass = viewConfig.listenerClass;
    var getGUID = require("baBasicLib/util/GUID");
    var baLib = require("baBasicLib/util/baLib");

    function PropView(div,model){
        View.call(this,div,model);
        this.id = getGUID();
        this.div = null;
        this.model = null;
        this.initialize(div,model);
    };
    PropView.prototype = new View();
    PropView.prototype.initialize = function(div,model){
        this.div = div;
        this.model = model;
        this.addOriListeners();
        this.addBasicStruct();
    };
    PropView.prototype.addOriListeners = function(){
        var self = this;
        var prop = {
            id: this.id,
            class: "ori"
        };

        this.model.addListener("spriteChange", prop, function (arg) {
            self.draw();
        });
    };
    PropView.prototype.draw = function(){
        var self = this;
        var controlSprite = this.model.controlObj;
        if(!controlSprite){
            return 0;
        }
        var id = controlSprite.id;
        if(this.model.spriteList[id]){
            this.model.controlObj = this.model.spriteList[id];
        }
        else{
            this.controlSprite = null;
            return 0;
        }
        var propType = $("#prop_type");
        propType.html("类型：" + this.model.controlObj.type);
        var propLife = $("#prop_life");
        var life = this.model.controlObj.propInfo.life;
        propLife.html("生命：" + life.toFixed(2));
        var propSpeed = $("#prop_speed");
        var speed = this.model.controlObj.moveInfo.stepLength;
        propSpeed.html("速度：" + speed.toFixed(2));
        var propDamage = $("#prop_damage");
        var damage = this.model.controlObj.propInfo.damage;
        propDamage.html("攻击力：" + damage.toFixed(2));
        var propArmor = $("#prop_armor");
        var armor= this.model.controlObj.propInfo.armor||0;
        propArmor.html("护甲：" + armor.toFixed(2));
    };
    PropView.prototype.addBasicStruct = function(){

    };
    return PropView;
})