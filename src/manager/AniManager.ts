class AniManager_wx3 {

    private static _instance:AniManager_wx3;
    public static getInstance():AniManager_wx3 {
        if (!this._instance)
            this._instance = new AniManager_wx3();
        return this._instance;
    }

    private mcFactorys:any = {}
    private mcPool = [];
    private mvList = [];

    private imgPool = [];
    private imgList = [];


    //frameRate:默认是12，要变快就加大，慢变就减小
    public mvConfig = {
        '14':{frameRate:24,scale:1},
        '30':{scale:1.5},
        '39':{scale:1.5},
        '116':{frameRate:24}
    };

    public mvSoundConfig = {}
    public aniList = []




    public constructor() {

    }

    public getImg(source){
        var mc = this.imgPool.pop() || new eui.Image()
        mc.source = source;
        this.imgList.push(mc);

        return mc;
    }
    public removeImg(mc){
        var index = this.imgList.indexOf(mc);
        if(index != -1)
        {
            this.imgList.splice(index,1);
        }
        index = this.imgPool.indexOf(mc);
        if(index == -1)
        {
            this.imgPool.push(mc);
        }

        mc.rotation = 0
        mc.scaleX = 1
        mc.scaleY = 1
        mc.alpha = 1
        egret.Tween.removeTweens(mc);
        MyTool.removeMC(mc);
    }

    public removeAllMV(){
        while(this.mvList.length > 0)
        {
            this.removeMV(this.mvList[0])
        }

        while(this.imgList.length > 0)
        {
            this.removeImg(this.imgList[0])
        }
    }

    //移除MC
    public removeMV(mc){
        var index = this.mvList.indexOf(mc);
        if(index != -1)
        {
            this.mvList.splice(index,1);
        }
        mc.stop();
        mc.removeEventListener(egret.Event.COMPLETE, this.onComp, this);
        this.mcPool.push(mc);

        mc.rotation = 0
        mc.scaleX = 1
        mc.scaleY = 1
        mc.alpha = 1
        egret.Tween.removeTweens(mc);

        MyTool.removeMC(mc);
    }

    public preLoadMV(name){
        if(this.mcFactorys[name])
            return true;
        var data:any = RES.getRes(name + "_json"); //qid
        var texture:egret.Texture = RES.getRes(name + "_png");
        if(data && texture)
            return true;
        var groupName = 'mv' + name;
        if(RES.getGroupByName(groupName).length == 0)
        {
            RES.createGroup(groupName, [name + "_json",name + "_png"], true);
            RES.loadGroup(groupName);
        }
        return false;
    }

    private getMV(name){
        var mcFactory:egret.MovieClipDataFactory = this.mcFactorys[name];
        if(!mcFactory)
        {
            var data:any = RES.getRes(name + "_json"); //qid
            var texture:egret.Texture = RES.getRes(name + "_png");
            if(data == null)
            {
                if(Config.isDebug)
                    throw new Error('111');
                return this.mcPool.pop() || new egret.MovieClip();
            }
            mcFactory = new egret.MovieClipDataFactory(data, texture);
            //mcFactory.enableCache = true;
            this.mcFactorys[name] = mcFactory
        }
        var mc:any = this.mcPool.pop() || new egret.MovieClip();
        mc.movieClipData = mcFactory.generateMovieClipData(name);
        if(mc.movieClipData == null)
        {
            if(Config.isDebug)
                throw new Error('222');
            return mc
        }
        mc.frameRate = 12//技能动画变慢
        mc.scaleX = mc.scaleY = 1;
        mc.rotation = 0;
        return mc;
    }

    //取重复播放的ani
    public getAni(name){
        var mc = this.getMV(name);
        if(mc.totalFrames)
            mc.gotoAndPlay(1, -1);
        this.mvList.push(mc);
        return mc;
    }

    //取播完一次后回调的ani
    public getAniOnce(name,fun?,thisObj?){
        var mc = this.getMV(name);
        if(!mc.totalFrames)
        {
            fun && fun.apply(thisObj);
            return mc;
        }
        mc.comFun = fun;
        mc.thisObj = thisObj;


        mc.gotoAndPlay(1, 1);
        mc.once(egret.Event.COMPLETE, this.onComp, this);


        this.mvList.push(mc);
        return mc;
    }

    private onComp(e:egret.Event){
        if(e.currentTarget.comFun)
            e.currentTarget.comFun.apply(e.currentTarget.thisObj);
        this.removeMV(e.currentTarget);

    }


    public playOnItem(mvID,item,xy?){
        if(!this.preLoadMV(mvID))
        {
            return;
        }
        var mv = this.getAniOnce(mvID);
        if(xy)
        {
            mv.x = xy.x;
            mv.y = xy.y;
        }
        else
        {
            mv.x = item.x;
            mv.y = item.y;
        }
        //mv.scaleX = mv.scaleY = 0.5
        item.parent.addChildAt(mv,item.parent.getChildIndex(item) + 1);
        return mv;
    }

    public playInItem(mvID,item,xy?){
        if(!this.preLoadMV(mvID))
        {
            return;
        }
        var mv = this.getAniOnce(mvID);
        mv.x = xy?xy.x:0
        mv.y = xy?xy.y:0
        item.addChild(mv);
        return mv;
    }

    //掉下来
    public drop(source,target){
        var mc = this.getImg(source)
        mc.y = target.y - 500
        mc.x = target.x
        target.parent.addChildAt(mc,target.parent.getChildIndex(target) + 1);
        var tw = egret.Tween.get(mc)
        tw.to({y:target.y},300).call(function(){
            this.removeImg(mc);
        },this)
        return mc
    }

}