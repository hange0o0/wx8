class H17 extends HeroData{
    public constructor() {
        super();
    }

    public atkAction(enemy){
        super.atkAction(enemy)

        if(this.mp >= this.skillCost)
        {
            this.addMp(-this.skillCost)
            if(!enemy.isDie)
            {
                var value = this.vo.getSkillValue(1)*this.currentAtkRate;
                enemy.addHp(-value,2);
            }
        }
    }

    public energySkillAction(){
        if(!this.relateTower)
            return false;

        var value = this.atkSpeedBase*0.5;
        var step = this.vo.getSkillValue(3)*TC.frameRate
        this.atkSpeed -= value;
        this.stopAddEnergy  = true;
        this.addBuff({
            key:'speed',
            value:value,
            step:step,
            endFun:(buff)=>{
                buff.target.atkSpeed += buff.value;
                buff.target.stopAddEnergy  = false;
            }
        })
        return true;
    }


}