/**
 * Created by wgw on 2016/6/16.
 * 时间分析器
 */
module.exports = TimeAnalyzer;

function TimeAnalyzer (){
    this.allTime = 0;
    this.avTime = 0;
    this.count = 0;
    this.bT = 0;
    this.eT = 0;
}

TimeAnalyzer.prototype = {
    //设置开始时间
    setBeginTime:function(){
        this.bT = new Date().getTime();
    },
    //设置结束时间
    setEndTime:function(){
        this.eT = new Date().getTime();
        var interval = this.eT - this.bT;
        this.allTime += interval;
        this.count++;
        this.avTime = this.allTime/this.count;
        console.log(this.avTime);
    }
}
