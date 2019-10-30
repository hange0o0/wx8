class TowerItem extends game.BaseItem{

    public static index = 1
    private static pool = [];
    public static createItem():TowerItem {
        var item:TowerItem = this.pool.pop();
        if (!item) {
            item = new TowerItem();
            item.tid = this.index;
            this.index ++;
        }
        return item;
    }

    public static freeItem(item:TowerItem) {
        if (!item)
            return;
        item.remove();
        if (this.pool.indexOf(item) == -1)
            this.pool.push(item);
    }


    public constructor() {
        super();
        this.skinName = "TowerItemSkin";
    }

    private disBottomMC: eui.Image;
    private disBottomMVMC: eui.Image;
    private energyBar: HPBar;
    private mpBar: HPBar;
    private list: eui.List;




    public monsterMV:HeroMVItem = new HeroMVItem();

    public posX
    public posY


    public tid = 0
    private mv;


    public stateFireMV
    public statePoisonMV

    private isLighting = false

    public heroData:HeroData
    public scale = 1;


    public enemy
    public hurtStep//攻击到达时间
    public hurtType//攻击类型


    public childrenCreated() {
        super.childrenCreated();

        this.list.itemRenderer = BuffListItem;

        this.anchorOffsetX = 32
        this.anchorOffsetY = 32

        var arr = [];
        for(var i=1;i<=11;i++)
        {
            arr.push('resource/game_assets2/map/gun_mv/mv_' + i + '.png')
        }
        this.mv = new MovieSimpleSpirMC()
        this.addChildAt(this.mv,0)
        this.mv.setData(arr);
        this.mv.anchorOffsetX = 66/2
        this.mv.anchorOffsetY = 30
        this.mv.x = 32
        this.mv.y = 32

        this.addChildAt(this.monsterMV,1)
        this.monsterMV.x = 32;
        this.monsterMV.y = 32;
    }

    public renewBuff(){
        var arr = [];
        var obj = {};
        var buffList = this.heroData.buff;
        for(var i=0;i<buffList.length;i++)
        {
            var buff = buffList[i];
            obj[buff.key] = true;
        }
        for(var s in obj)
        {
            arr.push(s);
        }
        this.list.dataProvider = new eui.ArrayCollection(arr)
    }


    public dataChanged():void {
        if(!this.mv)
            return;
        this.heroData = null;
        this.mv.gotoAndPay()
        MyTool.removeMC(this.disBottomMC);
        MyTool.removeMC(this.disBottomMVMC);
        this.isLighting = false
        if(this.data)
        {
            this.heroData = this.data;
            this.heroData.relateTower = this;
            this.monsterMV.visible = true;
            this.monsterMV.load(this.data.id)
            this.monsterMV.stand();
            this.energyBar.visible = true
            this.mpBar.visible = true
            this.renewInfo();
            this.renewBuff();
        }
        else
        {
            this.energyBar.visible = false
            this.mpBar.visible = false
            this.monsterMV.visible = false;
            this.monsterMV.stop();
            this.list.dataProvider = new eui.ArrayCollection([])
        }

        if(this.stateFireMV) {
            this.stateFireMV.stop()
            MyTool.removeMC(this.stateFireMV)
        }
        if(this.statePoisonMV) {
            this.statePoisonMV.stop()
            MyTool.removeMC(this.statePoisonMV)
        }
    }

    private renewInfo(){
        this.energyBar.data = {hp:this.data.energy,maxHp:this.data.maxEnergy};
        this.mpBar.data = {hp:this.data.mp,maxHp:this.data.maxMp};

        //显示满MP
        if(this.heroData.isEnergyFull())
        {
            if(!this.stateFireMV)
            {
                this.stateFireMV = new MovieSimpleSpirMC2()
                this.stateFireMV.anchorOffsetX = 531/3/2
                this.stateFireMV.anchorOffsetY = 532/2*0.8
                this.stateFireMV.x = 32
                this.stateFireMV.y = 32
                this.stateFireMV.setData('effect18_png',531/3,532/2,5,84)
                this.stateFireMV.widthNum = 3
                this.stateFireMV.stop()
            }

            if(!this.stateFireMV.stage)
            {
                this.addChildAt(this.stateFireMV,0)
                this.stateFireMV.play()
            }
        }
        else if(this.stateFireMV && this.stateFireMV.stage) {
            this.stateFireMV.stop()
            MyTool.removeMC(this.stateFireMV)
        }
    }

    public getDis(m2)
    {
        return MyTool.getDis(this,m2)
    }

    public resetBottomMC(map?,con?){
        return;
        //if(!this.gvo)
        //    return;
        //map = map || this.lastMap;
        //if(!map)
        //    return;
        //
        //this.lastMap = map;
        //egret.Tween.removeTweens(this.disBottomMC)
        //con && con.addChild(this.disBottomMC);
        //this.setItemSize(map,this.disBottomMC)
    }

    //public setItemSize(map,mc){
    //    var atkDis = this.atkDis
    //    if(atkDis > this.gvo.atkdis)
    //        atkDis = this.gvo.atkdis + 1;
    //
    //    var xx = Math.floor(this.x/64)
    //    var yy = Math.floor(this.y/64)
    //
    //    var left = Math.min(xx,atkDis)
    //    var right = Math.min(map.ww - (xx + 1),atkDis)
    //    var top = Math.min(yy,atkDis)
    //    var bottom = Math.min(map.hh - (yy + 1),atkDis)
    //
    //    mc.width = (left+right + 1)*64
    //    mc.height = (top+bottom + 1)*64
    //    mc.anchorOffsetX = left*64 + 32;
    //    mc.anchorOffsetY = top*64 + 32;;
    //    mc.x = this.x
    //    mc.y = this.y
    //}

    public showLight(pkMap){
        //this.isLighting = true
        //egret.Tween.removeTweens(this.disBottomMVMC)
        //this.disBottomMVMC.alpha = 1;
        //this.disBottomMVMC.scaleX = this.disBottomMVMC.scaleY = 0.1;
        //this.setItemSize(pkMap,this.disBottomMVMC)
        //pkMap.bottomCon.addChild(this.disBottomMVMC)
        //egret.Tween.get(this.disBottomMVMC).to({alpha:0.5,scaleX:1,scaleY:1},500).
        //    wait(1500).to({alpha:0,scaleX:0.1,scaleY:0.1},500).call(this.removeLight,this)
    }

    private removeLight(){
        this.isLighting = false
        MyTool.removeMC(this.disBottomMVMC)
    }



    public remove(){
        MyTool.removeMC(this);
        MyTool.removeMC(this.disBottomMC);
        this.stop();

        if(this.statePoisonMV)
            this.statePoisonMV.stop()
        if(this.stateFireMV)
            this.stateFireMV.stop()
    }

    public stop(){
        this.mv && this.mv.stop();
        this.monsterMV && this.monsterMV.stop()
    }
    public play(){
        this.mv && this.mv.play();
        this.monsterMV && this.monsterMV.play()
    }

    public getHurt(mid){
        return this.heroData.atk
    }

    public onE(monsterArr){
        if(!this.data)
            return;

        this.renewInfo();
        this.runBuff();


        if(this.enemy && this.enemy.isDie)
        {
            this.enemy = null;
        }

        if(this.hurtStep > 0)
        {
            this.hurtStep --;
            if(this.hurtStep == 0)
            {
                if(this.hurtType == 'skill')
                    this.onSkillAction()
                else if(this.hurtType == 'atk')
                    this.onAtkAction();
                else if(this.hurtType == 'energy')
                    this.onEnergyAction();
                //else if(this.hurtType == 'bullet')
                //    this.onEnergyAction();
            }
        }


        if(this.heroData.stopStep > 0)
        {
            this.heroData.stopStep --;
            return;
        }

        //判断能不能技能
        if(this.heroData.canSkill())
        {
            this.heroData.lastSkillTime = TC.actionStep;
            this.atkMV('skill')
            return;
        }




        //判断能不能攻击
        var atkSpeed = this.heroData.atkSpeed
        if(atkSpeed < 1)
            atkSpeed = 1
        if(TC.actionStep - this.heroData.lastAtkTime < atkSpeed)
            return;

        var atkList = [];
        var len = monsterArr.length;
        var atkDis = this.heroData.atkDis

        for(var i=0;i<len;i++)
        {
            var mItem:PKMonsterItem = monsterArr[i]
            if(mItem.isDie)
                continue
            if(this.getDis(mItem) > atkDis)
                continue
            atkList.push(mItem)
        }

        ArrayUtil_wx4.sortByField(atkList,['totalDis'],[0])

        if(this.heroData.bulletNum && atkList.length)
        {
            this.heroData.lastAtkTime = TC.actionStep
            this.atkMV('bullet');
            this.bulletAtk(atkList);
            return;
        }

        var enemy = atkList[0];
        this.enemy = enemy;
        if(enemy)
        {
            //PKTowerUI.getInstance().createBullet(this,atkList[i])
            this.heroData.lastAtkTime = TC.actionStep
            this.atkMV('atk')

            SoundManager.getInstance().playEffect('arc')

            var addX = Math.floor(enemy.x - this.x)
            if(addX > 0)
                this.monsterMV.scaleX = -1*this.scale
            else if(addX < 0)
                this.monsterMV.scaleX = 1*this.scale
        }
    }

    public atkMV(type,loop?){
        var atkSpeed = this.heroData.atkSpeed
        if(atkSpeed < 1)
            atkSpeed = 1
        this.monsterMV.atk(loop);
        this.hurtStep = atkSpeed/2;
        this.hurtType = type
        this.heroData.stopStep = atkSpeed;
    }

    public standMV(){
        if(this.monsterMV.state != MonsterMV.STAT_STAND)
            this.monsterMV.stand();
    }

    public onAtkAction(){
        this.heroData.addEnergy(1);
        if(this.enemy)
            this.heroData.atkAction(this.enemy);
    }

    public onSkillAction(){
        if(this.heroData.skillAction())
        {
            this.heroData.addMp(-this.heroData.skillCost)
        }
        else
        {
            this.heroData.lastSkillTime = -9999;
        }
    }

    public onEnergyAction(){
        if(this.heroData.energySkillAction())
        {
            this.heroData.addEnergy(-this.heroData.energy)
        }
    }

    public useEnergyMV(loop?){
        this.atkMV('energy',loop)
    }

    private runBuff(){

    }

    public bulletAtk(atkList){
        var b = false
        var shootNum = this.heroData.bulletNum;
        for(var i=0;i<shootNum;i++)
        {
            if(atkList[i])
            {
                PKTowerUI.getInstance().createBullet(this.heroData,atkList[i])
                b = true;
            }
        }

        if(b)
            this.heroData.addEnergy(1);
    }
}