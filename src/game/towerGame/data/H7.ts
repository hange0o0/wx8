class H7 extends HeroData{
    public constructor() {
        super();
    }

    public onStep(){
        if(!this.relateTower)
            return;

        var def = this.vo.getSkillValue(1);
        var myTower = this.relateTower

        var monsterArr = PKTowerUI.getInstance().monsterArr;
        var len = monsterArr.length;
        var atkDis = this.atkDis;
        var cd = 15;

        for(var i=0;i<len;i++)
        {
            var mItem:PKMonsterItem = monsterArr[i]
            if(mItem.isDie)
                continue
            if(MyTool.getDis(mItem,myTower) > atkDis)
                continue
            var buff = mItem.getBuffByID(7)
            if(buff)// && buff.step > 1
                continue;

            mItem.def -= def;
            mItem.addBuff({
                id:7,
                key:'def_dec',
                value:def,
                step:cd,
                endFun:(buff)=>{
                    buff.target.def += buff.value;
                }
            })
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
            mItem.stopCurrentSkill();
            mItem.stopSkillStep ++;
            mItem.addBuff({
                id:'7_2',
                key:'noskill',
                value:1,
                step:cd,
                endFun:(buff)=>{
                    buff.target.stopSkillStep --;
                }
            })
        }

        return b;
    }
}