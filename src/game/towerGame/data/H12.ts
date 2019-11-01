class H12 extends HeroData{
    public constructor() {
        super();
    }

    private skillStep = 0
    private lastEnergySkillTime = 0

    public canSkill(){
        var b = super.canSkill();
        if(!b)
            return false;
        if(this.getNearEnemys(true).length == 0)
            return false;
        return true
    }

    public skillAction(){
        if(!this.relateTower)
            return false;

        var atkList = this.getNearEnemys(false,50);
        if(atkList.length == 0)
            return false;


        var hurt = this.vo.getSkillValue(1)*this.currentAtkRate
        var cd = PKTool.getStepByTime(this.vo.getSkillValue(2)*1000);

        var enemy = ArrayUtil_wx4.getMaxValue(atkList,'hp')
        enemy.addHp(-hurt)
        enemy.setYun(cd)

        return true;
    }


    public canUseEnergySkill(){
        if(this.getNearEnemys(true,99999).length == 0)
            return false;
        return true;
    }

    public energySkillAction(){
        if(!this.relateTower)
            return false;

        this.skillStep = this.vo.getSkillValue(4)
        this.lastEnergySkillTime = 0;
        return true;
    }


    public onStep(){
        if(!this.relateTower)
            return;
        if(this.skillStep <= 0)
            return;
        if(TC.actionStep - this.lastEnergySkillTime < TC.frameRate)
            return;

        var hurt = this.vo.getSkillValue(3)*this.currentAtkRate;
        this.lastEnergySkillTime = TC.actionStep;
        var monsterArr = PKTowerUI.getInstance().monsterArr;
        var len = monsterArr.length;

        for(var i=0;i<len;i++)
        {
            var mItem:PKMonsterItem = monsterArr[i]
            if(mItem.isDie)
                continue
            mItem.addHp(-hurt,2)
        }
    }
}