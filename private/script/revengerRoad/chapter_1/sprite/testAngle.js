/**
 * Created by wgw on 2016/6/15.
 */
//≤‚ ‘∫Ø ˝ ∑ΩŒªΩ«≤‚ ‘

var Sprite = require("./Sprite_c1");

var sprite = new Sprite();
sprite.loc.x = 500;
sprite.loc.y = 500;

var dir = sprite.getDirByAimLoc({x:600,y:400});
console.log(dir);