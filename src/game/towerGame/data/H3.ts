class H3 extends HeroData{
    public constructor() {
        super();
    }

    public canSkill(){
        var b = super.canSkill();
        if(!b)
            return false;
        if(this.getTowerList().length == 0)
            return false;
        return true
    }

    public getTowerList(){
        var gunArr = PKTowerUI.getInstance().pkMap.gunArr;
        var len = gunArr.length;
        var list = []
        for(var i=0;i<len;i++)
        {
            var gItem = gunArr[i];
            if(!gItem.data)
                continue;
            var buff = gItem.data.getBuffByID(3)
            if(!buff)
                list.push(gItem.data);
        }
        return list;

    }

    public skillAction(){
        if(!this.relateTower)
            return false;

        var atkList = this.getTowerList()
        for(var i=0;i<atkList.length;i++)
        {
            atkList[i].temp = MyTool.getDis(this.relateTower,atkList[i].relateTower)
        }
        ArrayUtil_wx4.sortByField(atkList,['temp'],[0])

        var target = atkList[0];
        if(target)
        {
            var value = target.atkBase*this.vo.getSkillValue(1)/100;
            var step = this.vo.getSkillValue(2)*TC.frameRate
            target.atk += value;
            target.addBuff({
                id:3,
                key:'atk',
                value:value,
                step:step,
                endFun:(buff)=>{
                    buff.target.atk -= buff.value;
                }
            })
            return true;
        }
        return false;
    }

    public energySkillAction(){
        if(!this.relateTower)
            return false;
        var gunArr = PKTowerUI.getInstance().pkMap.gunArr;
        var len = gunArr.length;
        for(var i=0;i<len;i++)
        {
            var gItem = gunArr[i];
            var target = gItem.data;
            if(!target)
                continue;

            var value = target.atkSpeedBase*this.vo.getSkillValue(3)/100;
            var step = this.vo.getSkillValue(4)*TC.frameRate
            target.atkSpeed -= value;
            target.addBuff({
                key:'speed',
                value:value,
                step:step,
                endFun:(buff)=>{
                    buff.target.atkSpeed += buff.value;
                }
            })
        }
        return true;

    }
}