class H5 extends HeroData{
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
        var hurt = this.vo.getSkillValue(1)*this.currentAtkRate
        var decRate = this.vo.getSkillValue(2)/100;
        var cd = PKTool.getStepByTime(3000);


        for(var i=0;i<atkList.length;i++)
        {
            var item = atkList[i];
            item.addHp(-hurt,2)

            var addSpeed = item.speed*decRate
            item.speed -= addSpeed;
            item.addBuff({
                id:5,
                key:'speed_dec',
                value:addSpeed,
                step:cd,
                endFun:(buff)=>{
                    buff.target.speed += buff.value;
                }
            })
        }
        return true;
    }

    public energySkillAction(){
        if(!this.relateTower)
            return false;
        var atkList = this.getNearEnemys();
        if(atkList.length == 0)
            return false;
        var hurt = this.vo.getSkillValue(3)*this.currentAtkRate
        var cd = PKTool.getStepByTime(this.vo.getSkillValue(4)*1000);


        for(var i=0;i<atkList.length;i++)
        {
            var item = atkList[i];
            item.addHp(-hurt,2)
            item.setYun(cd)
        }
        return true;
    }

    public canUseEnergySkill(){
        if(this.getNearEnemys(true).length == 0)
            return false;
        return true;
    }
}