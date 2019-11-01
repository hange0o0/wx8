class H15 extends HeroData{
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

        var enemy = ArrayUtil_wx4.getMinValue(atkList,'totalDis')
        var rota = Math.atan2(enemy.y - this.relateTower.y,enemy.x - this.relateTower.x)
        this.atkByRota(rota);
        return true;
    }

    public atkByRota(rota){
        var bullet = PKTowerUI.getInstance().createBullet(this,null,{
            type:'move_hit',
            atkR:40,
            rota:rota,
            speed:20,
            hurt:this.getHurt(),
            endTime:TC.actionStep + 5,
            img:'skill22_png'
        });
    }

    public energySkillAction(){
        if(!this.relateTower)
            return false;

        for(var i=0;i<8;i++)
        {
            this.atkByRota(i*Math.PI/4)
        }
        return true;
    }
}