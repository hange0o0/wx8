class H10 extends HeroData{
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


        var hurt = this.vo.getSkillValue(1)
        var cd = PKTool.getStepByTime(this.vo.getSkillValue(2)*1000);


        for(var i=0;i<atkList.length;i++)
        {
            var item = atkList[i];
            item.setFire(cd,hurt)
        }
        return true;
    }

    public energySkillAction(){
        if(!this.relateTower)
            return false;
        var gunArr = PKTowerUI.getInstance().pkMap.gunArr;
        var len = gunArr.length;
        var addMp = this.vo.getSkillValue(3);
        for(var i=0;i<len;i++)
        {
            var gItem = gunArr[i];
            var target = gItem.data;
            if(!target)
                continue;
            target.addMp(addMp)
        }

        return true
    }
}