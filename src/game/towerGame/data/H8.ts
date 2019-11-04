class H8 extends HeroData{
    public constructor() {
        super();
    }

    public atkAction(enemy){
        //super.atkAction(enemy)
        var monsterArr = PKTowerUI.getInstance().monsterArr;
        var len = monsterArr.length;
        var atkDis = 30;

        for(var i=0;i<len;i++)
        {
            var mItem:PKMonsterItem = monsterArr[i]
            if(mItem.isDie)
                continue
            if(MyTool.getDis(mItem,enemy) > atkDis)
                continue
            super.atkAction(mItem)
        }
    }

    public canUseEnergySkill(){
        if(this.getNearEnemys(true,99999).length == 0)
            return false;
        return true;
    }

    public energySkillAction(){
        if(!this.relateTower)
            return false;

        var cd = PKTool.getStepByTime(this.vo.getSkillValue(3)*1000)
        var b = false
        var monsterArr = PKTowerUI.getInstance().monsterArr;
        var len = monsterArr.length;
        for(var i=0;i<len;i++)
        {
            var mItem:PKMonsterItem = monsterArr[i]
            if(mItem.isDie)
                continue
            b = true;
            mItem.setYun(cd);
        }
        return b;
    }


}