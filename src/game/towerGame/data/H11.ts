class H11 extends HeroData{
    public constructor() {
        super();
    }

    public atkAction(enemy){
        var rate = this.vo.getSkillValue(1)/100
        var value = this.vo.getSkillValue(2) - 1
        if(Math.random() < rate)
            this.currentAtkRate += value;
        super.atkAction(enemy);
    }


    public energySkillAction(){
        if(!this.relateTower)
            return false;
        var atkList = this.getNearEnemys();
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

    public canUseEnergySkill(){
        if(this.getNearEnemys(true).length == 0)
            return false;
        return true;
    }

}