/**
 * Created by wgw on 2016/6/11.
 */

var Sprite = require("../../../../model/Sprite");
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

module.exports = Sprite_c1;
function Sprite_c1(prop){
    Sprite.call(this);
    this.id = GUID.getGUID();
    this.type = "sprite_c1";//类型
    this.camp = "default";//阵营
    this.AI = true;
    this.GM = null;
    this.leader = null;//指挥官
    this.controller = null;
    this.recordInfo = {
        totalScore:0
    };
    this.geoInfo = {
        bindGeo:null,
        quaTreeNode:null
    };
    this.quaTreeNode = null;
    this.loc = {
        x:0,
        y:0,
        direction:0
    };
    this.propInfo = {
        baseLife:20,
        life:20,
        accLength:4,
        accNum:5,
        baseDamage:5,//基础伤害
        maxAccDmg:15,//通过速度获得的最大伤害
        damage:5,//伤害
        attackRange:5,//攻击距离
        baseArmor:1,//基础护甲
        armor:1,//护甲
        maxKickBack:10,//受到负反馈的最大参考值
        maxHonor:10,//收到正反馈的最大参考值
        isDead:false
    };
    this.viewInfo = {
        stamp:0,
        baseActInterval:200,
        actInterval:200,
        range:50,
    };
    this.viewData = {
        range:50,
        objList:[]
    }
    this.moveInfo = {
        stamp:0,
        baseActInterval:40,
        actInterval:40,
        stepLength:0.2,
        acc:0.01,
        draw:-0.03,
        maxStepLen:3,
        minStepLen:0,
        climbAbility:2,
        static:true,
    };
    this.attackInfo = {
        stamp:0,
        baseActInterval:100,
        actInterval:100
    };
    this.aimInfo = {
        aimLoc:null,
        aimObj:null,
        friend:null,
        enemy:null,
        aimEmptyInterval:20,
        aimEmptySignal:20
    };
    this.strategyInfo = {
        hasStrategy:false,
        ability:{range:100,baseUnit:10,maxCtr:5},
        sList:[],
        curSt:null,
        followList:[],
        curStNum:0
    };
    this.orderInfo = {
        follow:null,
        toLoc:null,
        toDir:null,
        rush:null
    };
    this.testSignal = {
        watch:false,
        halt:false
    };
    this.initialize(prop);
}
Sprite_c1.prototype = new Sprite();
Sprite_c1.prototype.initialize = function(prop){
    var self = this;
    for(var i in prop){
        self[i] = prop[i];
    }
};
Sprite_c1.prototype.addToGeo = function(geo){
    this.geoInfo.bindGeo = geo;
    this.geoInfo.bindGeo.addQuaNode(this);
    var width = geo.width;
    var height = geo.height;
    var loc_x = parseInt(Math.random()*width);
    var loc_y = parseInt(Math.random()*height);
    var direction = Math.random()*Math.PI*2;
    this.loc.x = loc_x;
    this.loc.y = loc_y;
    this.loc.direction = direction;
};
Sprite_c1.prototype.refreshGeo = function(){
    if(this.geoInfo.quaTreeNode){
        var bounds = this.geoInfo.quaTreeNode.bounds;
        if(this.loc.x > bounds.x + bounds.w ||
            this.loc.x < bounds.x||
            this.loc.y > bounds.y + bounds.h||
            this.loc.y < bounds.y){
            this.geoInfo.quaTreeNode.deleteSprite(this);
            this.geoInfo.bindGeo.addQuaNode(this);
        }
    }else{
    }
};
Sprite_c1.prototype.removeFromGeo = function(){
    if(this.geoInfo.quaTreeNode){
        this.geoInfo.quaTreeNode.deleteSprite(this);
    }
};
Sprite_c1.prototype.GMInput = function(input){
    var self = this;
    switch (input.type){
        case "acc":
            self._upButton(input.detail);
            break;
        case "draw":
            self._downButton(input.detail);
            break;
        case "turnLeft":
            self._leftButton(input.detail);
            break;
        case "turnRight":
            self._rightButton(input.detail);
    }
};
Sprite_c1.prototype._upButton = function () {
    var self = this;
    var dI = defaultGMInput;
    var mI = self.moveInfo;
    self.moveInfo.stepLength+dI.acc<=mI.maxStepLen?self.moveInfo.stepLength += dI.acc:self.moveInfo.stepLength = mI.maxStepLen;
    self.speedChanged();
};
Sprite_c1.prototype._downButton = function () {
    var self = this;
    var dI = defaultGMInput;
    var mI = self.moveInfo;
    self.moveInfo.stepLength-dI.draw>=0?self.moveInfo.stepLength -= dI.draw:self.moveInfo.stepLength = 0;
    self.speedChanged();
};
Sprite_c1.prototype._leftButton = function(){
    var self = this;
    var dI = defaultGMInput;
    var mI = self.moveInfo;
    self.loc.direction += dI.tL;
    if(self.loc.direction <= 0){
        self.loc.direction += 2*PI;
    }
};
Sprite_c1.prototype._rightButton = function(){
    var self = this;
    var dI = defaultGMInput;
    var mI = self.moveInfo;
    self.loc.direction += dI.tR;
    self.loc.direction = self.loc.direction%(2*PI);
};
//当对象的速度发生改变时的响应函数
Sprite_c1.prototype.speedChanged = function(){
    console.log("speedChanged");
};
//当对象的方向发生改变时的响应函数
Sprite_c1.prototype.dirChanged = function(){

};
//行动
Sprite_c1.prototype.action = function(){
    var self = this;
    if(this.AI){
        var _t = new Date().getTime();
        //目标检测执行判断
        var viewInfo = self.viewInfo;
        if(_t - viewInfo.stamp >= viewInfo.actInterval){
            viewInfo.stamp = _t;
            viewInfo.actInterval += (Math.random()*300 - 150);
            this.viewHandle();
        }

        //移动执行判断
        var moveInfo = self.moveInfo;
        if(_t - moveInfo.stamp >= moveInfo.actInterval){
            moveInfo.stamp = _t;
            this.moveHandle();
        }

        //攻击执行判断
        var attackInfo = self.attackInfo;
        if(_t - attackInfo.stamp >= attackInfo.actInterval){
            attackInfo.stamp = _t;
            var attResult = this.attackHandle();
            self.setAttackInterval(attResult);
        }
    };
};
//动作函数（观察）======================================================
Sprite_c1.prototype.viewHandle = function(){
    var viewObjList = this.getObjInView();
    this.viewData.objList = viewObjList;
    var aimInfo = this.getAim(viewObjList);
    this.aimInfo.friend = aimInfo.friend;
    this.aimInfo.enemy = aimInfo.enemy;
};
//获取视野内的目标
Sprite_c1.prototype.getObjInView = function(){
    var self = this;
    var loc = self.loc;
    var viewInfo = self.viewInfo;
    var quaTreeNode = self.geoInfo.quaTreeNode;
    if(!quaTreeNode){
        console.log("can't find own tree");
        return [];
    }

    var w = quaTreeNode.bounds.w;
    var spriteList = quaTreeNode.spriteList;
    var list = [];
    if(w <= viewInfo.range){
        list = spriteList;
    }
    else{
        for(var i = 0,len = spriteList.length;i<len;i++){
            var sprite_i = spriteList[i];
            var dis = util.getTwoSpriteDis(sprite_i,self);
            if(dis <= viewInfo.range){
                list.push(sprite_i);
            }
        }
        if(list.length>1 && self.testSignal.watch){
        }
    }
    return list;
};
//获取目标
Sprite_c1.prototype.getAim = function(){
    console.log("getAim");
};
//设置AI的首选目标
Sprite_c1.prototype.setAim = function(aimObj){
    console.log("setAim");
};
//动作函数（移动）======================================================
Sprite_c1.prototype.moveHandle = function () {
    var self = this;
    var loc = this.loc;
    var speed = self.moveInfo.stepLength;
    var oriDir = self.loc.direction;
    var dir = self.loc.direction;
    var _dis = null,aimLoc;
    if(this.controller){}
    else if(this.orderInfo.follow){
        var followInfo = self.orderInfo.follow;
        var aim = followInfo.aim;//指定的跟随目标
        var aimSpeed = aim.moveInfo.stepLength;//目标的速度
        aimLoc = util.getRelativeLoc(aim,{x:followInfo.qx,y:followInfo.qy});
        _dis = util.getTwoLocDis(self.loc,aimLoc);
        dir = self.getDirByAimLoc({x:aimLoc.x,y:aimLoc.y});
        //速度调整
        if(_dis>15){
            var maxStepL = self.moveInfo.maxStepLen;
            self.moveInfo.stepLength = self.accTo(maxStepL);
        }
        else{
            self.moveInfo.stepLength = self.accTo(aimSpeed);
        }
    }
    else if(this.orderInfo.toLoc){
        aimLoc = self.orderInfo.toLoc.loc;
        _dis = util.getTwoLocDis(self.loc,aimLoc);
        dir = self.getDirByAimLoc(self.orderInfo.toLoc.loc);
    }
    else if(this.orderInfo.toDir){
        dir = self.orderInfo.toDir.loc;
    }
    else{
        dir = self.getMoveDir();
    }
    self.loc.direction = dir;
    //TODO 速度调整暂时不添加
    var _x,_y;
    if(_dis!= null &&(_dis <= speed)){
        self.loc.direction = oriDir;
        _x = aimLoc.x - loc.x;
        _y = aimLoc.y - loc.y;
    }else{
        _x = speed * Math.cos(dir);
        _y = speed * Math.sin(dir);
    }

    //障碍判断
    if(this.obstacleCheck(_x,_y)){
        loc.x += _x;
        loc.y += _y;
    };
    //边界判断
    var geoInfo = this.geoInfo.bindGeo;
    if(loc.x <= 0||loc.x >= geoInfo.width){
        loc.direction = Math.PI - loc.direction;
    }
    if(loc.y <= 0||loc.y >= geoInfo.height){
        loc.direction = -1*loc.direction;
    }
    self.refreshGeo();
};
//障碍判断
Sprite_c1.prototype.obstacleCheck = function (_x, _y) {
    var oL = this.GM.obstacleList;
    var loc = this.loc;
    var newLoc = {x:this.loc.x + _x,y:this.loc.y + _y};
    var obs;
    var isHalt = false;
    outerLoop:
    for(var i = 0;i<oL.length;i++){
        obs = oL[i];
        if(obs.type == "line"){
            //如果障碍为线段
            var x1 = obs.node[0];
            var x2 = obs.node[2];
            var y1 = obs.node[1];
            var y2 = obs.node[3];
            var minX = Math.min(x1,x2);
            var maxX = Math.max(x1,x2);
            var minY = Math.min(y1,y2);
            var maxY = Math.max(y1,y2);
            //var isHalt = false;
            if (Math.max(loc.x,loc.x+_x)<minX){continue};
            if (Math.max(loc.y,loc.y+_y)<minY){continue};
            if (Math.min(loc.x,loc.x+_x)>maxX){continue};
            if (Math.min(loc.y,loc.y+_y)>maxY){continue};
            if (this.mult({x:x1,y:y1},newLoc,loc)*this.mult({x:x2,y:y2},newLoc,loc)>0){continue};
            if (this.mult(loc,{x:x2,y:y2},{x:x1,y:y1})*this.mult(newLoc,{x:x2,y:y2},{x:x1,y:y1})>0){continue};
            isHalt = true;
            break outerLoop;
        }
        else if(obs.type == "cycle"){
            var cX = obs.node[0];
            var cY = obs.node[1];
            var r = obs.node[2];
            var bAngle = obs.node[3];
            var eAngle = obs.node[4];
            var dis1 = (cX - loc.x)*(cX - loc.x) + (cY - loc.y)*(cY - loc.y);
            var dis2 = (cX - newLoc.x)*(cX - newLoc.x) + (cY - newLoc.y)*(cY - newLoc.y);
            if((dis1 - r*r)*(dis2 - r*r) < 0){
                var angle = util.getRelativeAngle({x:cX,y:cY},loc);
                var _angle = eAngle - bAngle;
                if(_angle < 0)_angle = _angle + Math.PI*2;
                var a = angle - bAngle;
                if(a < 0)a = a + Math.PI*2;
                if(a<_angle){
                    isHalt = true;
                    this.testSignal.halt = true;
                    this.testSignal.haltInfo = {x:loc.x,y:loc.y};
                    break outerLoop;
                }
            }
            else if(this.testSignal.halt){
                console.log("sdfg");
            }
        }
    }
    if(isHalt){
        //console.log("被阻止了哟");
        return false;
    }
    return true;
}
//位置计算
Sprite_c1.prototype.mult = function(a,b,c){
    return (a.x-c.x)*(b.y-c.y)-(b.x-c.x)*(a.y-c.y);
}
//获取移动方向
Sprite_c1.prototype.getMoveDir = function(){
    console.log("getMoveDir");
};
//根据目标坐标获取前进方向
Sprite_c1.prototype.getDirByAimLoc = function(aimLoc){
    var loc = this.loc;
    var dir;
    var _x = aimLoc.x - loc.x , _y = aimLoc.y - loc.y;
    if(_y > 0){
        if(_x > 0){
            dir = Math.atan(_y/_x);
        }else if(_x < 0){
            dir = Math.atan(_y/_x) + Math.PI;
        }else{
            dir = Math.PI/2;
        }
    }
    else if(_y < 0){
        if(_x > 0){
            dir = Math.PI*2 + Math.atan(_y/_x);
        }else if(_x < 0){
            dir = Math.PI + Math.atan(_y/_x);
        }else{
            dir = Math.PI*1.5;
        }
    }else{
        if(_x > 0){
            dir = 0;
        }else if (_x < 0){
            dir = Math.PI;
        }else{
            dir = loc.direction;
        }
    }
    dir = (dir)%(2*Math.PI);
    return dir;
};
//加速到指定速度
Sprite_c1.prototype.accTo = function(speed){
    var curSpeed = this.moveInfo.stepLength;
    var _s = speed - curSpeed;
    var acc = 0;
    if(_s == 0){//速度相等
        return curSpeed;
    }
    else if(_s >= 0){//加速
        acc = this.moveInfo.acc;
        curSpeed += acc;
        if(curSpeed >= speed){
            curSpeed = speed;
        };
        return curSpeed;

    }
    else{//减速
        acc = this.moveInfo.draw;
        curSpeed += acc;
        if(curSpeed <= speed){
            curSpeed = speed;
        };
        if(curSpeed < 0){
            console.log("hh");
        }
        return curSpeed;
    }
}
//动作函数（攻击）======================================================
Sprite_c1.prototype.attackHandle = function(){
    var self = this;
    var aimInfo = self.aimInfo;
    //如果有可攻击的目标（三项判断）
    if(aimInfo.enemy&&aimInfo.enemy.isReachable(this)&&!aimInfo.enemy.isDead()){
        var damageCount = self.propInfo.damage;
        var damageResult = aimInfo.enemy.getDamage(damageCount);
        self.damageCallback(damageResult);
        return true;
    }
    else{
        //攻击失败
        return false;
    };
};
/**
 * 受到伤害
 * @param damageNum
 * @returns {*}
 */
Sprite_c1.prototype.getDamage = function(damageNum){
    console.log("spriteGetDamage");
};
/**
 * 伤害的返回值处理
 * @param info info格式：{kickBack:(受到的负反馈),honor:（收到的正反馈）}
 * @private
 */
Sprite_c1.prototype.damageCallback = function(info){
    console.log("damageCallBack");
};
/**
 * 对象死亡处理
 */
Sprite_c1.prototype.died = function(){
    if(!this.geoInfo.quaTreeNode){
        console.log("quaTreeProblem");
    }
    if(!this.geoInfo.quaTreeNode.deleteSprite(this)){
        console.log("deleteSpriteProblem");
    };
    this.propInfo.isDead = true;
    this.GM._testPushDead(this);
    this.GM.removeSprite(this);
    //如果是跟随者
    if(this.orderInfo.follow){
        this.orderInfo.follow.aim.removeFollow(this);
    }
    //如果是领导者
    if(this.strategyInfo.hasStrategy){
        var fL = this.strategyInfo.followList;
        var s_i;
        for(var i = 0,len = fL.length;i<len;i++){
            s_i = fL[i];
            s_i.orderInfo.follow = null;
        }
    }
    this.GM.fireEvent('removeSprite',this.id);
};
/**
 * 自杀~
 */
Sprite_c1.prototype.killSelf = function(){
    this.propInfo.isDead = true;
    this.propInfo.life = 0;
    this.died();
};
/**
 * 判断对象是否死亡
 * @returns {boolean}
 */
Sprite_c1.prototype.isDead = function(){
    if(this.propInfo.life <= 0){
        return true;
    }
    return false;
};
/**
 * 判断对象是否在攻击范围之内
 * @param aimObj
 * @returns {boolean}
 */
Sprite_c1.prototype.isReachable = function(aimObj){
    var loc_1 = this.loc;
    var loc_2 = aimObj.loc;
    var aR = aimObj.propInfo.attackRange||2;
    var dis2 = Math.pow((loc_1.x - loc_2.x),2) + Math.pow((loc_1.y - loc_2.y),2);
    if(dis2 <= aR * aR)
        return true;
    return false;
};
/**
 * 设置下一次的攻击间隔
 * @param attResult
 */
Sprite_c1.prototype.setAttackInterval = function (attResult) {
    var self = this;
    var p = self.getAccPercent();
    self.attackInfo.actInterval -= 20*p;
}
//战术相关函数===================================================================
/**
 * 添加战术
 * @param strategy
 */
Sprite_c1.prototype.addStrategy = function(strategy){
    var sInfo = this.strategyInfo;
    if(!this.strategyInfo.hasStrategy)return null;
    sInfo.sList.unshift(strategy);
    this.changeStrategy(strategy);
};
/**
 * 更换当前战术
 */
Sprite_c1.prototype.changeStrategy = function(strategy){
    this.strategyInfo.curSt = strategy;
    this.strategyInfo.curStNum = 0;
    var f_i;
    for(var i = 0,len = this.strategyInfo.followList.length;i<len;i++){
        f_i = this.strategyInfo.followList[i];
        this.addFollowToSt(f_i);
    }
};
/**
 * 给当前战术添加追随者
 * @param follow
 * @returns {boolean}
 */
Sprite_c1.prototype.addFollowToSt = function(follow){
    var st = this.strategyInfo;
    if(st.curStNum + 1 > st.curSt.dataInfo.length){
        follow.orderInfo.follow = null;
        follow.leader = null;
        return false;
    }
    var dataList = st.curSt.dataInfo;
    var data_i = dataList[st.curStNum];
    var followInfo = {
        aim:this,
        qx:data_i.x,
        qy:data_i.y
    };
    follow.orderInfo.follow = followInfo;
    follow.leader = this;
    st.curStNum++;

    //添加到followList中
    var isIn = false;
    outerLoop:
    for(var i = 0;i<st.followList.length;i++){
        if(follow == st.followList[i]){
            isIn = true;
            break outerLoop;
        }
    }
    if(!isIn){
        st.followList.push(follow);
    }
};
/**
 * 移除追随者
 * @param follow
 * @returns {boolean}
 */
Sprite_c1.prototype.removeFollow = function(follow){
    var st = this.strategyInfo;
    var f_i;
    for(var i = 0,len = st.followList.length;i<len;i++){
        f_i = st.followList[i];
        if(f_i == follow){
            st.followList.splice(i,1);
            st.curStNum--;
            return true;
        }
    }
    return false;
}
//数据相关函数==========================================================
/**
 * 获得当前速度与最大速度之比
 */
Sprite_c1.prototype.getAccPercent = function(){
    var self = this;
    var mI = self.moveInfo;
    var percent = mI.stepLength/mI.maxStepLen;
    if(percent >= 1)percent = 1;
    if(percent <= 0)percent = 0;
    return percent;
};
Sprite_c1.prototype.getOutPut = function(){
        //TODO 现在的情况是不论sprite Change与否都会返回
        return{
            id:this.id,
            loc:this.loc,
        }
    };
Sprite_c1.prototype.getOutPutDetail = function(){
    return{
        id:this.id,
        loc:this.loc,
        //viewData:this.viewData,
        propInfo:this.propInfo,
        moveInfo:this.moveInfo,
        strategyInfo:{
            hasStrategy:this.strategyInfo.hasStrategy,
            ability:this.strategyInfo.ability
        }
    };
};
