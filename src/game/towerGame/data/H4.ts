class H4 extends HeroData{
    public constructor() {
        super();
    }

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

        var atkList = this.getNearEnemys();
        if(atkList.length == 0)
            return false;
        ArrayUtil_wx4.sortByField(atkList,['totalDis'],[0])

        var enemy = atkList[0]
        var enemys = [enemy]
        var len = 50;
        for(var i=0;i<atkList.length;i++)
        {
            var item = atkList[i];
            if(item != enemy && MyTool.getDis(enemy,item) < len)
            {
                enemys.push(item);
            }
        }


        var hurt = this.vo.getSkillValue(1)
        var cd = PKTool.getStepByTime(this.vo.getSkillValue(2)*1000)
        for(var i=0;i<enemys.length;i++)
        {
            var item = enemys[i];
            item.setYun(cd)
            item.addHp(-hurt)
            item.flyMV();
        }

        return true;
    }

    public energySkillAction(){
        if(!this.relateTower)
            return false;

        var atkList = this.getNearEnemys();
        if(atkList.length == 0)
            return false;
        var hurt = this.vo.getSkillValue(3);
        var item = ArrayUtil_wx4.getMaxValue(atkList,'hp');
        item.addHp(-hurt);
        return true;
    }

    public canUseEnergySkill(){
        if(this.getNearEnemys(true).length == 0)
            return false;
        return true;
    }
}