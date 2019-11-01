class H6 extends HeroData{
    public constructor() {
        super();
    }
    public bulletNum = 5
    public mv
    public step = 0
    public loopEnergy = 10000;

    public reset(){
        super.reset();
        if(this.mv)
        {
            AniManager_wx3.getInstance().removeMV(this.mv)
            this.mv = null;
        }
    }

    public canUseEnergySkill(){
        if(this.getNearEnemys(true).length == 0)
            return false;
        return true;
    }

    public energySkillAction(){
        if(!this.relateTower)
            return false;
        var atkList = this.getNearEnemys();
        if(atkList.length == 0)
            return false;


        var cd = PKTool.getStepByTime(this.vo.getSkillValue(4)*1000);
        var enemy = ArrayUtil_wx4.getMinValue(atkList,'totalDis')


        if(this.mv)
        {
            AniManager_wx3.getInstance().removeMV(this.mv)
        }
        this.mv = AniManager_wx3.getInstance().getAni('skill8');
        PKTowerUI.getInstance().addToRoleCon(this.mv)
        this.mv.x = enemy.x
        this.mv.y = enemy.y;
        this.step = cd +1;
        this.onStep();
        this.stopStep = 9999;

        return true;
    }

    public onStep(){
        if(!this.mv)
            return;
        if(this.step<=0)
            return;

        this.step --;
        if(this.step<=0)
        {
            AniManager_wx3.getInstance().removeMV(this.mv)
            this.stopStep = 0;
            this.relateTower.standMV()
            this.mv = null;
            return;
        }

        var hurt = this.vo.getSkillValue(3)/2
        var decRate = 0.5;

        var monsterArr = PKTowerUI.getInstance().monsterArr;
        var len = monsterArr.length;
        var atkDis = 50;
        var cd = 15;

        for(var i=0;i<len;i++)
        {
            var mItem:PKMonsterItem = monsterArr[i]
            if(mItem.isDie)
                continue
            if(MyTool.getDis(mItem,this.mv) > atkDis)
                continue
            var buff = mItem.getBuffByID(6)
            if(buff && buff.step > 1)
                continue;
            mItem.addHp(-hurt,2)
            if(mItem.isDie)
                continue;

            var addSpeed = mItem.speed*decRate
            mItem.speed -= addSpeed;
            mItem.addBuff({
                id:6,
                key:'speed_dec',
                value:addSpeed,
                step:cd,
                endFun:(buff)=>{
                    buff.target.speed += buff.value;
                }
            })
        }
    }


}