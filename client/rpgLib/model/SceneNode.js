/**
 * Created by wgw on 2016/10/10.
 */
define(function(require){
    function SceneNode(id){
        this.id = null;
        this.describe = "";
        this.loc = 0;
        this.choiceList = [];
    }

    function SceneChoice(){
        this.str = "";
        this.result = {
            propChange:"",
            locChange:"",
            sceneChange:"",
        }
    }

    return {
        SceneNode:SceneNode,
        SceneChoice:SceneChoice
    }
});