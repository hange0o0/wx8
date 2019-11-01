class H2 extends HeroData{
    public constructor() {
        super();
    }

    public atkAction(enemy){
        super.atkAction(enemy)
        var value = this.vo.getSkillValue(1);
        enemy.setPoison(Number.MAX_VALUE,value)
    }

    public energySkillAction(){
        if(!this.relateTower)
            return false;
        var monsterArr = PKTowerUI.getInstance().monsterArr;
        var len = monsterArr.length;
        var value = this.vo.getSkillValue(3)*this.currentAtkRate;
        for(var i=0;i<len;i++)
        {
            var mItem:PKMonsterItem = monsterArr[i]
            if(mItem.isDie)
                continue
            if(!mItem.poisonStep)
                continue
            mItem.addHp(-value,2)
        }
        return true;
    }


}