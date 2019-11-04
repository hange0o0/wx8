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
    private energyBar: HPBar2;
    private mpBar: HPBar2;
    private list: eui.List;
    private doubleText: eui.Label;



    private dataProvider: eui.ArrayCollection;
    public buffChange = false




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
    public atkMVBegin
    public isHurt//已产生害
    public isAtkMVOver//攻击动画表现完
    public hurtType//攻击类型


    public childrenCreated() {
        super.childrenCreated();

        this.list.itemRenderer = BuffListItem;
        this.dataProvider = this.list.dataProvider = new eui.ArrayCollection([])

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


        this.addChildAt(this.disBottomMC,0)
    }

    public changeScale(scale){
        egret.Tween.get(this,{onChange:()=>{
            this.monsterMV.scaleY = this.scale
            if(this.monsterMV.scaleX > 0)
                this.monsterMV.scaleX = this.scale
            else
                this.monsterMV.scaleX = -this.scale
        }}).to({scale:scale},300)
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
        this.dataProvider.source = arr;
        this.dataProvider.refresh();
        this.buffChange = false;
        this.monsterMV.setSpeed(30/this.heroData.atkSpeed)
    }


    public dataChanged():void {
        if(!this.mv)
            return;
        this.heroData = null;
        this.mv.gotoAndPay()
        this.disBottomMC.visible = false;
        this.isLighting = false
        this.buffChange = false;
        this.isHurt = false
        this.isAtkMVOver = false
        this.atkMVBegin = 0
        this.monsterMV.scaleY = this.scale
        this.monsterMV.scaleX = this.scale
        this.doubleText.visible = false
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
            this.dataProvider.source = [];
            this.dataProvider.refresh()
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

    public showBottomMC(r){
        if(!r)
        {
            this.disBottomMC.visible = false
            return;
        }

        this.disBottomMC.visible = true
        this.disBottomMC.width = this.disBottomMC.height = r*2;
    }


    public onStepRenew(){
        if(this.buffChange)
            this.renewBuff()
    }

    public getHitPos(){
        return {
            x :this.x,
            y :this.y - 40
        }
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

    public getHurtOverTime(){
        return this.atkMVBegin + this.heroData.atkSpeed/2
    }
    public getAtkMVOverTime(){
        return this.atkMVBegin + this.heroData.atkSpeed
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

        if(!this.isHurt)
        {
            if(TC.actionStep >= this.getHurtOverTime())
            {
                this.isHurt = true;
                if(this.hurtType == 'skill')
                    this.onSkillAction()
                else if(this.hurtType == 'atk')
                    this.onAtkAction();
                else if(this.hurtType == 'energy')
                    this.onEnergyAction();

                if(this.heroData.currentAtkRate > 1)
                {
                    this.showDouble(this.heroData.currentAtkRate)
                }
                //else if(this.hurtType == 'bullet')
                //    this.onEnergyAction();
            }
        }

        if(this.heroData.stopStep>0)
        {
            this.heroData.stopStep --;
            return;
        }

        if(TC.actionStep < this.getAtkMVOverTime())
        {
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
        this.heroData.resetAtkRate();
        var atkSpeed = this.heroData.atkSpeed
        if(atkSpeed < 1)
            atkSpeed = 1
        this.monsterMV.atk(loop);
        this.atkMVBegin = TC.actionStep;
        this.hurtType = type
        this.heroData.stopStep = atkSpeed;
        this.isHurt = false;
    }

    public standMV(){
        if(this.monsterMV.state != MonsterMV.STAT_STAND)
            this.monsterMV.stand();
    }

    public onAtkAction(){
        console.log('atk',TC.actionStep)
        this.heroData.addEnergy(1);
        if(this.enemy)
        {
            this.heroData.atkAction(this.enemy);
        }
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

    public showDouble(value){
        egret.Tween.removeTweens(this.doubleText)
        this.doubleText.text = 'x ' + MyTool.toFixed(value,1)
        if(this.heroData.buff.length > 0)
            this.doubleText.y = this.list.y - 24
        else
            this.doubleText.y = this.list.y
        this.addChild(this.doubleText)
        this.doubleText.visible = true
        egret.Tween.get(this.doubleText).wait(300).to({y:this.doubleText.y-30},300).call(()=>{
            this.doubleText.visible = false
        })
    }
}