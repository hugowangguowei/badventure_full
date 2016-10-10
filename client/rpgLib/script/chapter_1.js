/**
 * Created by wgw on 2016/10/10.
 */
define(function(require){
    var defaultNode = "node_01";
    var nodeList = {
        node_01:{
            describe:"已经到了黄昏，大雨仍然没有任何停止的迹象。" +
                "路上的积水越来越多，尽管我很小心的驾车，但仍然有数次车轮掉进了路边的水坑里，要拉出来，每一次都比上一次费更大的力气。" +
                "直到这一次。现在整个马车都斜躺在泥里，马不停的打着响鼻。" +
                "我只好走到雨里，把车辕解下来。" +
                "马自由了，现在可好，整个马车和我的行李都平躺在泥里。",
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
            describe:"贸然前进可不是什么好选择，好在雨渐渐的小了。" +
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
        }
    };

    return {
        defaultNode:defaultNode,
        nodeList:nodeList
    };
})