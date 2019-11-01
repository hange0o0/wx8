class H13 extends HeroData{
    public constructor() {
        super();
    }

    public atkAction(enemy){
        var rate = this.vo.getSkillValue(1)/100
        if(Math.random() > rate)
        {
            super.atkAction(enemy);
            return;
        }
        var hurt = this.vo.getSkillValue(2)*this.currentAtkRate
        enemy.setYun(TC.frameRate)
        super.atkAction(enemy,-hurt);
    }

    public energySkillAction(){
        if(!this.relateTower)
            return false;


        var value = this.atkBase*this.vo.getSkillValue(3)/100;
        var step = this.vo.getSkillValue(4)*TC.frameRate
        this.atk += value;
        this.addBuff({
            key:'atk',
            value:value,
            step:step,
            endFun:(buff)=>{
                buff.target.atk -= buff.value;
            }
        })
        return true;
    }

}