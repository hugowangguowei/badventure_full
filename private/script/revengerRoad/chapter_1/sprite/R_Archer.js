/**
 * Created by wgw on 2016/8/17.
 */
var Sprite = require("./Sprite_c1");
var util = require("../../../../../dep/baBasicLib/util/baLib");
var GUID = require("../../../../../dep/baBasicLib/util/GUID");
var PI = Math.PI;

//默认输入控制
var defaultGMInput = {
    acc:0.1,//加速
    draw:0.3,//暂停
    tL:-0.3,//左转
    tR:0.3//右转
}

module.exports = Archer;
function Archer(prop){
    Sprite.call(this);
    this.id = GUID.getGUID();
    this.type = "archer";
    this.camp = "Rohan";
    this.propInfo = {
        baseLife:20,
        life:20,
        accLength:4,
        accNum:5,
        baseDamage:10,//基础伤害
        damage:10,//伤害
        attackRange:5,//攻击距离
        baseArmor:1,//基础护甲
        armor:1,//护甲
        maxKickBack:10,//受到负反馈的最大参考值
        maxHonor:10,//收到正反馈的最大参考值
        attackState:false,
        isDead:false
    };
    this.viewInfo = {
        stamp:0,
        baseActInterval:200,
        actInterval:200,
        range:100,
        data:[]
    };
    //移动数据
    this.moveInfo.maxStepLen = 3;
    this.moveInfo.stepLength = 0.1;

    this.attackInfo = {
        stamp:0,
        baseActInterval:100,
        actInterval:100
    };
    this.attackDis = {
        min:70,
        max:95,
        range:Math.PI*0.3,
        quaTreeRange:null
    }

    this.initialize(prop);
}

Archer.prototype = new Sprite();
Archer.prototype.addToGeo = function (geo) {
    this.geoInfo.bindGeo = geo;
    this.geoInfo.bindGeo.addQuaNode(this);
    var width = geo.width;
    var height = geo.height;
    var base_x = width*0.2;
    var base_y = height*0.2;
    var ran_x = width*0.1;
    var ran_y = height*0.05;
    var loc_x = base_x + parseInt(Math.random()*ran_x);
    var loc_y = base_y + parseInt(Math.random()*ran_y);
    //var loc_x = 100;
    var direction = Math.random()*Math.PI*2;

    this.loc.x = loc_x;
    this.loc.y = loc_y;
    this.loc.direction = direction;
};
Archer.prototype.viewHandle = function(){
    var aimInfo = this.getAim();
    this.aimInfo.friend = aimInfo.friend;
    this.aimInfo.enemy = aimInfo.enemy;
};
Archer.prototype.getAim = function(){
    var self = this;
    var friend = null;
    var enemy = null;
    if(this.propInfo.attackState){
        enemy = this.getShot();
    }
    return {friend:friend,enemy:enemy};
};
Archer.prototype.getShot = function(){
    var self = this;
    var aD = this.attackDis;
    var d = (aD.max + aD.min)/2;
    var shotLoc = {x:0,y:0};
    shotLoc.x = this.loc.x + Math.cos(this.loc.direction)*d;
    shotLoc.y = this.loc.y + Math.sin(this.loc.direction)*d;

    var quaNode = this.geoInfo.bindGeo.quaTree.getNodeByLoc(shotLoc);
    if(!quaNode)return null;
    var aimList = quaNode.spriteList;
    this.attackDis.quaTreeRange = quaNode.bounds;
    var aim_i = null;
    for(var i = 0;i< aimList.length;i++){
        aim_i = aimList[i];
        if(this.isObjCanBeShot(aim_i)&&this.isObjInRange(aim_i))return aim_i;
    }
    return null;
};
Archer.prototype.isObjCanBeShot = function(aim){
    if(aim.camp == "Orc")return true;
    return false;
};
Archer.prototype.isReachable = function(aim){
    if(this.isObjInRange(aim))return true;
    return false;
};
Archer.prototype.isObjInRange = function(obj){
    var ad = this.attackDis;
    var dis = util.getTwoSpriteDis(this,obj);
    if(ad.min > dis || ad.max < dis)return false;
    var angle = util.getRelativeAngle(this.loc,obj.loc);
    //if(Math.abs(this.loc.direction - angle)>ad.range/2)return false;
    if(util.getIncludedAngle(this.loc.direction,angle)>ad.range/2)return false;
    return true;
};
Archer.prototype.getMoveDir = function(){
    var self = this;
    if(self.controller){
        return self.loc.direction;
    };
    if(self.propInfo.attackState){
        return self.loc.direction;
    };
    var loc = self.loc;
    var curDir = self.loc.direction;
    var dir = curDir;
    var enemy = self.aimInfo.enemy;
    if(enemy){
        var aimLoc = enemy.loc;
        dir = self.getDirByAimLoc(aimLoc);
        self.aimInfo.aimEmptySignal = self.aimInfo.aimEmptyInterval;
    }
    else{
        self.aimInfo.aimEmptySignal --;
        if(self.aimInfo.aimEmptySignal <= 0){
            dir += (Math.random()*0.5 - 0.25);
            self.aimInfo.aimEmptySignal = self.aimInfo.aimEmptyInterval;
        }
    }

    var needRot = dir - curDir;
    if(Math.abs(needRot) > self.propInfo.rotate){
        var i;
        Math.abs(needRot)==needRot?i = 1:i= -1;
        self.loc.direction += i*self.propInfo.rotate;
    }
    else{
        self.loc.direction = dir;
    }
    return self.loc.direction;
};
Archer.prototype.setAttackInterval = function (attResult) {
    var self = this;
    var p = self.getAccPercent();
    self.attackInfo.actInterval -= 20*p;
};
Archer.prototype.changeSpeedFunc = function(){
    if(this.moveInfo.stepLength == 0){
        this.propInfo.attackState = true;
    }else{
        this.propInfo.attackState = false;
    }
};
Archer.prototype.getDamage = function(damageNum){
    var self = this;
    var propInfo = self.propInfo;
    var realDamage;
    damageNum - propInfo.armor >0?realDamage = (damageNum - propInfo.armor):realDamage = 0;
    propInfo.life -= realDamage;

    var kickBack = propInfo.armor*01;
    kickBack > 1?kickBack = 1:kickBack;
    if(propInfo.life > 0){
        return {kickBack:kickBack,honor:0};
    }
    else{
        self.died();
        return {kickBack:kickBack,honor:0.5};
    }
};
Archer.prototype.damageCallback = function(info){
    var self = this;
    var kickBack = info.kickBack;
    this.changeSpeed(-5*kickBack);
    var honor = info.honor;
    self.propInfo.life += honor*20;
    self.propInfo.baseDamage += honor*10;
    self.recordInfo.totalScore += honor;
};
Archer.prototype.getOutPutDetail = function(){
    return{
        id:this.id,
        loc:this.loc,
        propInfo:this.propInfo,
        moveInfo:this.moveInfo,
        strategyInfo:{
            hasStrategy:this.strategyInfo.hasStrategy,
            ability:this.strategyInfo.ability
        },
        attackDis:this.attackDis
    };
};
