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


        var lastScale = this.relateTower.scale
        this.relateTower.changeScale(lastScale*1.3)
        this.addBuff({
            key:'atk',
            value:value,
            value2:lastScale,
            step:step,
            endFun:(buff)=>{
                buff.target.atk -= buff.value;
                buff.target.relateTower.changeScale(buff.value2)
            }
        })
        return true;
    }

}