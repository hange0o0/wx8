class H16 extends HeroData{
    public constructor() {
        super();
    }

    public skillStep = 0
    public lastEnergySkillTime = 0
    public loopEnergy = 10000;

    public atkAction(enemy){
        super.atkAction(enemy)
        var monsterArr = PKTowerUI.getInstance().monsterArr;
        var len = monsterArr.length;
        var atkDis = this.vo.getSkillValue(1);
        var hurt = this.getHurt() * this.vo.getSkillValue(2)/100;

        for(var i=0;i<len;i++)
        {
            var mItem:PKMonsterItem = monsterArr[i]
            if(mItem == enemy)
                continue
            if(mItem.isDie)
                continue
            if(MyTool.getDis(mItem,enemy) > atkDis)
                continue
            enemy.addHp(-hurt,1);
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

        this.skillStep = this.vo.getSkillValue(4)
        this.lastEnergySkillTime = 0;
        this.stopStep = 9999;
        return true;
    }


    public onStep(){
        if(!this.relateTower)
            return;
        if(this.skillStep <= 0)
            return;
        if(TC.actionStep - this.lastEnergySkillTime < TC.frameRate*1.5)
            return;
        this.iceAction();
        this.skillStep --;
        this.lastEnergySkillTime = TC.actionStep;
        console.log('energy skill 16')

        if(this.skillStep<=0)
        {
            this.stopStep = 0;
            this.relateTower.standMV()
            return;
        }
    }

    public iceAction(){
        if(!this.relateTower)
            return false;

        var atkList = this.getNearEnemys(false);
        if(atkList.length == 0)
            return false;




        var hurt = this.vo.getSkillValue(3)*this.currentAtkRate
        for(var i=0;i<atkList.length;i++)
        {
            var item = atkList[i];
            item.addHp(-hurt,2)
        }
        return true;
    }

}