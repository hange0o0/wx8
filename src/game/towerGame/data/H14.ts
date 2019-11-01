class H14 extends HeroData{
    public constructor() {
        super();
    }

    public skillStep = 0
    public lastEnergySkillTime = 0

    public canSkill(){
        var b = super.canSkill();
        if(!b)
            return false;
        if(this.getNearEnemys(true).length == 0)
            return false;
        return true
    }

    public skillAction(){
        return this.iceAction();
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
        return true;
    }


    public onStep(){
        if(!this.relateTower)
            return;
        if(this.skillStep <= 0)
            return;
        if(TC.actionStep - this.lastEnergySkillTime < TC.frameRate)
            return;
        this.iceAction();
    }




















    public iceAction(){
        if(!this.relateTower)
            return false;

        var atkList = this.getNearEnemys(false,50);
        if(atkList.length == 0)
            return false;

        var enemy = ArrayUtil_wx4.randomOne(atkList);
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


        var hurt = this.vo.getSkillValue(1)*this.currentAtkRate
        var decRate = this.vo.getSkillValue(2)/100;
        var cd = PKTool.getStepByTime(3*1000)
        for(var i=0;i<enemys.length;i++)
        {
            var item = enemys[i];
            item.addHp(-hurt,2)

            var addSpeed = item.speed*decRate
            item.speed -= addSpeed;
            item.addBuff({
                id:14,
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
}