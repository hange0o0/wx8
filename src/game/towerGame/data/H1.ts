class H1 extends HeroData{
    public constructor() {
        super();
    }

    public skillAction(){
        if(!this.relateTower)
            return false;

        var atkList = this.getNearEnemys()
        ArrayUtil_wx4.sortByField(atkList,['totalDis'],[0])

        var enemy = atkList[0];
        if(enemy)
        {
            PKTowerUI.getInstance().addHero({
                id:1,
                atk:this.getHurt()*this.vo.getSkillValue(1)/100,
                aliveTime:this.vo.getSkillValue(2)*TC.frameRate,
                atkSpeed:this.atkSpeedBase,
                atkDis:this.atkDisBase,
                x:enemy.x,
                y:enemy.y,
            })
            return true;
        }
        return false;
    }

    public energySkillAction(){
        if(!this.relateTower)
            return false;

        var atkList = [];
        var monsterArr = PKTowerUI.getInstance().monsterArr;
        var len = monsterArr.length;
        for(var i=0;i<len;i++)
        {
            var mItem:PKMonsterItem = monsterArr[i]
            if(mItem.isDie)
                continue
            atkList.push(mItem)
        }
        if(atkList.length == 0)
            return false;

        ArrayUtil_wx4.random(atkList,3);
        var maxLen = this.vo.getSkillValue(3);
        if(atkList.length > maxLen)
            atkList.length = maxLen
        len = atkList.length;
        for(var i=0;i<len;i++)
        {
            var enemy:PKMonsterItem = atkList[i]
            PKTowerUI.getInstance().addHero({
                id:1,
                atk:this.getHurt()*this.vo.getSkillValue(1)/100,
                aliveTime:this.vo.getSkillValue(2)*TC.frameRate,
                atkSpeed:this.atkSpeedBase,
                atkDis:this.atkDisBase,
                x:enemy.x,
                y:enemy.y,
            })
        }
        return true;
    }

    public canUseEnergySkill(){
        var monsterArr = PKTowerUI.getInstance().monsterArr;
        var len = monsterArr.length;
        for(var i=0;i<len;i++)
        {
            var mItem:PKMonsterItem = monsterArr[i]
            if(mItem.isDie)
                continue
            return true;
        }
        return false;
    }

    public canSkill(){
        var b = super.canSkill();
        if(!b)
            return false;
        if(this.getNearEnemys(true).length == 0)
            return false;
        return true
    }
}