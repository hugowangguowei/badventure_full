/**
 * Created by wgw on 2016/10/10.
 */
define(function(require){
    var defaultNode = "node_01";
    var nodeList = {
        node_01:{
            describe:"    已经到了黄昏，大雨仍然没有任何停止的迹象。" +
                "路上的积水越来越多，尽管我很小心的驾车，但仍然有数次车轮掉进了路边的水坑里，要拉出来，每一次都比上一次费更大的力气。" +
                "直到这一次。现在整个马车都斜躺在泥里，马不停的打着响鼻。" +
                "我只好走到雨里，把车辕解下来。" +
                "马自由了，现在可好，整个马车和我的行李都平躺在泥里。\n" +
                "    贸然前进可不是什么好选择，好在雨渐渐的小了。" +
                "我走到马车后面，翻检出几件必备的物品带在身上。" +
                "不过用不着太多，一旦跟管家碰头之后，他就可以带人帮我把车拉出来。"+
                "好了，我看看，现在我有，不过拿三样就可以了。",
            loc:"outTown_01",
            choiceList:[
                {
                    str:"等他",
                    result:{
                        propChange:"100000",
                        sceneChange:"node_02"
                    }
                },
                {
                    str:"继续前行",
                    result:{
                        propChange:"100000",
                        sceneChange:"node_03"
                    }
                }
            ]
        },
        node_02:{
            describe:"贸然前进可不是什么好选择，好在雨渐渐的小了。我走到马车后面，翻检出几件必备的物品带在身上。" +
            "不过用不着太多，一旦跟管家碰头之后，他就可以带人帮我把车拉出来。"+
            "好了，我看看，现在我有钱袋，厚披风，短剑，礼帽，我该选哪个呢？",
            loc:"outTown_01",
            choiceList:[
                {
                    str:"钱袋",
                    result:{
                        propChange:"100000",
                        sceneChange:"node_03"
                    }
                },
                {
                    str:"厚披风",
                    result:{
                        propChange:"100000",
                        sceneChange:"node_03"
                    }
                },
                {
                    str:"短剑",
                    result:{
                        propChange:"100000",
                        sceneChange:"node_03"
                    }
                },
                {
                    str:"礼帽",
                    result:{
                        propChange:"100000",
                        sceneChange:"node_03"
                    }
                }
            ]
        },
        node_03:{
            describe:"我把这些东西仔细装进外套的兜里，然后准备上路。雨现在停了，天边仍然还有一丝微光，借着微光我深一脚浅一脚的的走在泥里。" +
            "路上竟然有这么大的水坑！一脚踩下去，整个脚踝都会浸入到泥浆中，把脚拿出来的时候你会发现里面灌满了淤泥。\n" +
            "不过此时我最关心的却是老管家。\n" +
            "自从我四岁离开这个偏僻的小城堡之后，就再也没回来过。" +
            "我希望他有渡鸦传来消息五分之一的热情。在信中他好像十分热切的欢迎领主的小儿子接管这个小镇。" +
            "可是我现在又脏又累，天正逐渐黑下来。路也看不清楚了。可是城镇和管家仍然不知道在什么地方。我该怎么办？",
            loc:"outTown_01",
            choiceList:[
                {
                    str:"停在这里",
                    result:{
                        propChange:"100000",
                        sceneChange:"node_04"
                    }
                },
                {
                    str:"四处看看",
                    result:{
                        propChange:"100000",
                        sceneChange:"node_04"
                    }
                }
            ]
        },
        node_04:{
            describe:"我本想点一根火把，可是这样的大雨让我找不到任何一根干柴，看来只好先休息一下再说了。我找了块还算干净的石头坐了下。直到我看见一团火焰向我飘过来。看来是有人经过了\n" +
            "“嗨~那边的！”我朝他大喊。\n"+
            "火把稍微停顿了一下，然后向我飘过来。"+
            "我走到路中央，重新站到水坑里，现在我看得出是个佝偻的老人在举着火把。他慢慢的靠近了。",
            loc:"outTown_01",
            choiceList:[
                {
                    str:"继续",
                    result:{
                        propChange:"100000",
                        sceneChange:"node_05"
                    }
                }
            ]
        },
        node_05:{
            describe:"“少爷？”\n“啊，是我。你是布先生！”\n" +
            "“正是我，少爷。”老管家微微鞠躬。他咳嗽的非常厉害。一只手举着火把，另外一只手一直捂着嘴。我感觉他的肺像一个巨大的风箱。\n"+
            "“您的行李在哪里？我帮您去取来”他问。\n"+
            "我只好耸耸肩，我的行李都躺在泥里。我说。\n"+
            "“这该死的雨”，老头子等咳嗽停了接着说：“狂风是恶棍，暴雨是魔鬼”\n"+
            "“咱们最好赶紧进城”。老头子咳嗽个不停，火光在他手里一跳一跳。\n"+
            "“那您的行李。。。”管家有些迟疑。\n"+
            "“没有人会去偷，放心吧，明天早上再派人来取。”。管家同意了。",
            loc:"outTown_01",
            choiceList:[
                {
                    str:"继续",
                    result:{
                        propChange:"100000",
                        sceneChange:"node_06"
                    }
                }
            ]
        }
    };

    return {
        defaultNode:defaultNode,
        nodeList:nodeList
    };
})