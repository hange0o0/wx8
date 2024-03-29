class PKTowerUI extends game.BaseUI_wx4 {

    public static _instance: PKTowerUI;
    public static getInstance(): PKTowerUI {
        if(!this._instance)
            this._instance = new PKTowerUI();
        return this._instance;
    }

    private bg: eui.Image;
    private levetText: eui.Label;
    private barMC: eui.Image;
    private list: eui.List;
    private leftBtn: eui.Group;
    private rightBtn: eui.Group;








    public dataProvider:eui.ArrayCollection

    public dragHero = new DragHeroItem()


    public pkMap = new PKMap();
    public scale


    public data:LevelVO;


    public mapData;
    public ww;
    public hh;

    public towerPos = {}
    public movePaths

    public monsterArr = []
    public bulletArr = []
    public heroCopyArr = []

    public touchPos


    public chooseSkill = null;
    public heroList = [];
    public page = 1;
    public maxPage = 1;

    public selectItem;
    public showLightPos
    public constructor() {
        super();
        this.skinName = "PKTowerUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();



        this.addChildAt(this.pkMap,1);
        this.pkMap.horizontalCenter = 0
        this.pkMap.verticalCenter = -80



        this.list.itemRenderer = PKSkillItem
        this.list.dataProvider = this.dataProvider = new eui.ArrayCollection([])
        this.list.selectedIndex = 0;

        this.addBtnEvent(this.pkMap,this.onMap)
        this.addBtnEvent(this.leftBtn,()=>{
            this.page --;
            this.renewHero()
        })
        this.addBtnEvent(this.rightBtn,()=>{
            this.page ++;
            this.renewHero()
        })

        this.addEventListener('start_drag',this.onDragStart,this)
        this.addEventListener('move_drag',this.onDragMove,this)
        this.addEventListener('end_drag',this.onDragEnd,this)

        this.pkMap.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouchBegin,this)
        GameManager_wx4.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouchMove,this)
        GameManager_wx4.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.onTouchEnd,this)
    }

    //判断是不是有效的塔位，返回对应的塔位座标
    private isTowerPos(x,y){
        if(this.mapData[y] && this.mapData[y][x] == 2)
            return {x:x,y:y}
        if(this.mapData[y+1] && this.mapData[y+1][x] == 2)
            return {x:x,y:y+1}
        return null;
    }

    private onTouchBegin(e){
        var itemSize = 64*this.scale;
        var x = Math.floor((e.stageX - this.pkMap.x)/itemSize)
        var y = Math.floor((e.stageY - this.y - this.pkMap.y)/itemSize)
        if(y >= this.hh || y < -1 || x >= this.ww || x < 0)
            return;

        var towerPos = this.isTowerPos(x,y)
        if(towerPos)
        {
            this.showLightPos = {
                tid:this.towerPos[towerPos.x+'_' + towerPos.y],
                x:towerPos.x,
                y:towerPos.y
            }
            this.touchPos = {
                x:towerPos.x,
                y:towerPos.y,
                towerID:this.towerPos[towerPos.x+'_' + towerPos.y]
            }
        }

        this.onTouchMove(e);
    }

    private onTouchMove(e){
        if(!this.stage)
            return;

        this.onDragMove({
            data:{
                x:e.stageX,
                y:e.stageY,
            }
        })


        var itemSize = 64*this.scale;
        var x = Math.floor((e.stageX - this.pkMap.x)/itemSize)
        var y = Math.floor((e.stageY - this.y - this.pkMap.y)/itemSize)
        if(y >= this.hh || y < -1 || x >= this.ww || x < 0)
            return;

        if(this.touchPos && this.touchPos.towerID && !this.dragHero.stage)// && !(this.touchPos.x == x && this.touchPos.y == y)
        {
            this.addChild(this.dragHero);
            this.dragHero.data = this.touchPos.towerID
            this.dragHero.x = e.stageX
            this.dragHero.y = e.stageY - this.y;
        }
    }

    private onTouchEnd(e){
        if(!this.stage)
            return;
        this.touchPos = null;
        this.onDragEnd(e);
    }

    private onDragStart(e){
        var data = e.data;
        var target = e.target;
        this.addChild(this.dragHero);
        this.dragHero.data = target.id
        this.dragHero.x = data.x
        this.dragHero.y = data.y - this.y;


        this.selectItem = null;
        this.setSelect(HeroData.getHero(target.id))
    }

    private onDragMove(e){
        if(!this.dragHero.stage)
            return;
        var data = e.data;
        this.dragHero.x = data.x
        this.dragHero.y = data.y - this.y;


        var itemSize = 64*this.scale;
        var x = Math.floor((data.x - this.pkMap.x)/itemSize)
        var y = Math.floor((data.y - this.y - this.pkMap.y)/itemSize)
        if(y >= this.hh || y < -1 || x >= this.ww || x < 0)
        {
            this.setDragOK(false)
            return;
        }

        var towerPos = this.isTowerPos(x,y)

        if(towerPos)
        {
            var tower = this.pkMap.getTowerByPos(towerPos.x,towerPos.y)
            if(!tower || !tower.data || tower.data.id != this.dragHero.data)
            {
                this.setDragOK(true,tower)
            }
            else
            {
                this.setDragOK(false)
            }

            this.showLightPos = {
                tid:this.dragHero.data,
                x:towerPos.x,
                y:towerPos.y
            }
        }
        else
        {
            this.setDragOK(false)

            this.showLightPos = {
                hide:true
            }
        }


        //var arr = this.pkMap.gunArr;
        //var hitMC = null;
        //for(var i=0;i<arr.length;i++)
        //{
        //    if(this.mapData[y][x] != 2)
        //}
    }

    private setDragOK(b,tower?){
        this.dragHero.setOKState(b,tower)
    }

    private onDragEnd(e){
        if(!this.dragHero.stage)
            return;
        MyTool.removeMC(this.dragHero)


        if(this.dragHero.overTower)
        {
            var key = this.dragHero.overTower.posX + '_' + this.dragHero.overTower.posY
            var lastKey//上次本塔的位置
            //判断交换还是上阵
            for(var s in this.towerPos)
            {
                if(this.towerPos[s] == this.dragHero.data)
                    lastKey = s;
            }

            if(key == lastKey)//没变化
                return;

            var otherTower = this.towerPos[key];//目标位置上的塔
            if(lastKey)//移动的是场上的塔
            {
                var temp = lastKey.split('_')
                var lastTower = this.pkMap.getTowerByPos(temp[0],temp[1])
                if(otherTower)//新的位置上有另一个塔
                {
                    //把目标原有的塔放到我原来的位置上
                    this.towerPos[lastKey] = otherTower
                    lastTower.data = HeroData.getHero(otherTower)
                    HeroData.getHero(otherTower).testUseEnergySkill()
                }
                else
                {
                    //清空我原来的位置上的塔
                    this.towerPos[lastKey] = 0
                    lastTower.data = null
                }
            }
            else//上阵
            {

            }
            this.dragHero.overTower.data = HeroData.getHero(this.dragHero.data)
            this.towerPos[key] = this.dragHero.data
            HeroData.getHero(this.dragHero.data).testUseEnergySkill()

            this.onTowerChange();
        }

        this.showLightPos = {
            hide:true
        }


    }

    public setSelect(data){
        if(this.selectItem == data)
            this.selectItem = null;
        else
            this.selectItem = data;
        MyTool.runListFun(this.list,'renewSelect')
    }

    private onTowerChange(){
        var PKM = PKManager.getInstance();
        //重置玩家数据
        PKM.posHero.length = 0;
        for(var s in this.towerPos)
            PKM.posHero.push(this.towerPos[s]);
        UM_wx4.needUpUser = true;

        //更新列表显示
        var lastPage = this.page
        this.initHeroList();
        if(lastPage > this.maxPage)
            lastPage = this.maxPage
        this.page = lastPage
        this.renewHero();
    }


    private onMap(e){
        var itemSize = 64*this.scale;
        var x = Math.floor((e.stageX - this.pkMap.x)/itemSize)
        var y = Math.floor((e.stageY - this.y - this.pkMap.y)/itemSize)
        if(y >= this.hh || y < 0 || x >= this.ww || x < 0)
            return;

        //if(this.mapData[y][x] == 2 && this.towerPos[x+'_'+y])
        //{
        //    var tower = this.pkMap.getTowerByPos(x,y);
        //    if(tower.isLighting)
        //    {
        //        //GunInfoUI.getInstance().show(tower)
        //    }
        //    else
        //    {
        //        tower.showLight(this.pkMap)
        //        //if(UM_wx4.level < 10)
        //        //    MyWindow.ShowTips('再次点击底座可查看详情')
        //    }
        //    return;1
        //}
    }



    public show(data?){

        this.data = data;
        this.towerPos = {};
        this.movePaths = this.data.roadPos;


        this.pkMap.initMap(data.id)
        this.ww = data.width
        this.hh = data.height
        var arr1 = data.getRoadData();
        this.mapData = [];
        for(var i=0;i<this.hh;i++)
        {
            this.mapData.push([]);
            for(var j=0;j<this.ww;j++)
            {
                var id = Math.floor(arr1[i][j]) || 0
                this.mapData[i].push(id);
                if(id == 2)
                {
                    this.towerPos[j+'_' + i] = 0;
                }
            }
        }

        var index = 0;
        var PKM = PKManager.getInstance();
        for(var s in this.towerPos)
        {
            this.towerPos[s] = PKM.posHero[index] || 0;
            index ++;
        }

        super.show()
    }

    public hide() {
        super.hide();
        SoundManager.getInstance().playSound('main_bg')
    }

    private renewMap(){
        this.pkMap.draw(this.mapData);
        this.pkMap.renewTower(this.towerPos);
    }

    public onShow(){

        if(!UM_wx4.shareUser[0] && TC.isSpeed && TC.isTest != 1)
        {
            TC.isSpeed = false
        }

        this.bg.source = UM_wx4.getBG()
        SoundManager.getInstance().playSound('pk_bg')
        this.showLightPos = null

        while(this.monsterArr.length)
        {
            PKMonsterItem.freeItem(this.monsterArr.pop())
        }
        while(this.bulletArr.length)
        {
            PKBulletItem.freeItem(this.bulletArr.pop())
        }
        while(this.heroCopyArr.length)
        {
            HeroItem.freeItem(this.heroCopyArr.pop())
        }

        this.levetText.text = '第 '+this.data.id+' 关'
        this.chooseSkill = null;
        this.pkMap.width = 64*this.ww
        this.pkMap.height = 64*this.hh

        this.scale = TowerManager.getInstance().getScale(this.ww,this.hh)
        this.pkMap.scaleX = this.pkMap.scaleY = this.scale;
        this.dragHero.scaleX = this.dragHero.scaleY = this.scale;

        TC.initData(this.data);
        this.renewMap();
        this.initHeroList();
        this.renewHero();


        this.addPanelOpenEvent(GameEvent.client.timerE,this.onE)
        this.barMC.width = 640-2

        //if(this.data.id == 1 && UM_wx4.level == 1)
        //{
        //    HelpUI.getInstance().show(2)
        //}
    }

    public initHeroList(){
        var PKM = PKManager.getInstance();

        this.heroList.length = 0;
        for(var s in PKM.heros)
        {
            var id = parseInt(s);
            var heroPos = PKM.getHeroPos(id)
            if(!heroPos)
            {
                var hData = HeroData.getHero(id);
                this.heroList.push(hData);
                hData.relateTower = null;
            }
        }

        this.maxPage = Math.ceil(this.heroList.length / 5) || 1
        this.page = 1;

    }

    public renewHero(){
        var arr = this.heroList.slice((this.page-1)*5,(this.page)*5)
        this.dataProvider.source = arr;
        this.dataProvider.refresh();
        this.leftBtn.visible = this.page > 1;
        this.rightBtn.visible = this.page < this.maxPage;
    }

    public onFail(){
        if(TC.isStop)
            return;
        if(UM_wx4.level == 1)
            return;
        if(TC.wudiEnd > TC.actionStep)
            return;
        TC.isStop = true;
        if(TC.rebornTime || TC.isTest)//复活过
        {
            ResultUI.getInstance().show(false);
        }
        else
        {
            RebornUI.getInstance().show();
        }

    }

    public onReborn(){
        TC.isStop = false;
        //显示无敌
        this.pkMap.showWUDI();
        SoundManager.getInstance().playEffect('reborn')
    }

    private onE(){

        if(ZijieScreenBtn.e && !TC.isTest && !TC.isStop && TC.maxStep - TC.actionStep < 900)
        {
            ZijieScreenBtn.e.start();
        }
        var runTime = TC.isSpeed?TC.speedNum:1
        while(runTime >0)
        {
            if(TC.isStop)
                return;
            this.onStep();
            runTime --;
        }

        //buff状态显示
        var len = this.monsterArr.length
        for(var i=0;i<len;i++)
        {
            this.monsterArr[i].onStepRenew();
        }
        var len = this.monsterArr.length
        for(var i=0;i<len;i++)
        {
            this.monsterArr[i].onStepRenew();
        }
        var gunArr = this.pkMap.gunArr;
        len = gunArr.length;
        for(var i=0;i<len;i++)
        {
            gunArr[i].onStepRenew();
        }


        MyTool.runListFun(this.list,'onE');
        this.pkMap.sortY();
        if(TC.wudiEnd &&  TC.wudiEnd < TC.actionStep)//移除无敌显示
        {
            TC.wudiEnd = 0;
            this.pkMap.hideWUDI();
        }
        if(this.monsterArr.length == 0 && TC.roundAutoMonster.length == 0 && TC.totalAutoMonster.length == 0)//过关了
        {
            ResultUI.getInstance().show(true);
        }
        this.barMC.width = (640-2)*(TC.actionStep/TC.maxStep);

        if(this.showLightPos)
        {
            if(this.showLightPos.hide)
            {
                this.pkMap.showTowerLight(0,0,0)
            }
            else
            {
                var r = GunVO.getObject(this.showLightPos.tid).atkdis
                this.pkMap.showTowerLight(this.showLightPos.x,this.showLightPos.y,r);
            }
            this.showLightPos = null;
        }
    }

    private onStep(){

        TC.onStep();



        var len = this.monsterArr.length;
        for(var i=0;i<len;i++)
        {
            var mItem = this.monsterArr[i];
            if(mItem.isDie == 2)
            {
                PKMonsterItem.freeItem(mItem);
                this.monsterArr.splice(i,1)
                len--;
                i--;
                continue;
            }
            mItem.onE();
        }

        for(var s in HeroData.hDatas)
        {
            var heroData = HeroData.hDatas[s];
            heroData.autoAddMp();
            heroData.buffRun();
            heroData.onStep();
        }

        var len = this.bulletArr.length;
        for(var i=0;i<len;i++)
        {
            var bItem = this.bulletArr[i];
            if(bItem.isDie)
            {
                PKBulletItem.freeItem(bItem);
                this.bulletArr.splice(i,1)
                len--;
                i--;
                continue;
            }
            bItem.onE();
        }

        var len = this.heroCopyArr.length;
        for(var i=0;i<len;i++)
        {
            var hItem = this.heroCopyArr[i];
            if(hItem.isDie)
            {
                HeroItem.freeItem(hItem);
                this.heroCopyArr.splice(i,1)
                len--;
                i--;
                continue;
            }
            hItem.onE();
        }

        var gunArr = this.pkMap.gunArr;
        len = gunArr.length;
        for(var i=0;i<len;i++)
        {
            var gItem = gunArr[i];
            gItem.onE(this.monsterArr);
        }
    }

    public addMonster(mid){
        var path = this.movePaths.concat();
        if(path.length == 0)
            throw new Error();
        var newItem = PKMonsterItem.createItem();
        this.monsterArr.push(newItem);
        this.pkMap.roleCon.addChild(newItem);
        newItem.data = mid;
        newItem.setPath(path);
        var pos = newItem.path.shift()
        newItem.path.push(pos)
        var startPos = TC.getMonsterPosByPath(pos);
        newItem.resetXY(startPos.x,startPos.y)
    }

    public addHero(data){
        var newItem = HeroItem.createItem();
        this.heroCopyArr.push(newItem);
        this.pkMap.roleCon.addChild(newItem);
        newItem.data = data;
        newItem.x = data.x
        newItem.y = data.y
    }

    public createBullet(owner,target,sp?){
        var bullet = PKBulletItem.createItem();
        this.bulletArr.push(bullet);
        this.pkMap.topCon.addChild(bullet);
        bullet.data = {
            owner:owner,
            target:target,
            sp:sp
        }
        bullet.resetXY(owner.relateTower.x,owner.relateTower.y - 50)
        return bullet;
    }

    public addToRoleCon(mc){
        this.pkMap.roleCon.addChild(mc);
    }
    public addToTopCon(mc){
        this.pkMap.topCon.addChild(mc);
    }
}