class H18 extends HeroData{
    public constructor() {
        super();
    }

    public enemyNum = 0;
    public currentHurt = 0;
    public lastEnemy;
    public hurtList = {};

    public waitStep = 5

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
        var hurt = this.currentHurt = this.vo.getSkillValue(2)*this.currentAtkRate
        this.enemyNum = this.vo.getSkillValue(1) - 1;


        enemy.addHp(-hurt,2)
        TC.showLight(this.relateTower.getHitPos(),enemy.getHitPos())
        this.hurtList = {}
        this.hurtList[enemy.id]  =1;
        this.lastEnemy = enemy
        this.currentHurt *= 0.9
        this.waitStep = 2;
        return true;
    }

    public hurtOne(){
        var monsterList = PKTowerUI.getInstance().monsterArr;
        var len = monsterList.length;
        if(len == 0)
            return false;
        var minMonster;
        var minDis;
        var maxDis = 100;
        for(var i=0;i<len;i++)
        {
            var monster = monsterList[i];
            if(monster.isDie)
                continue;
            if(this.hurtList[monster.id])
                continue;

            var dis = MyTool.getDis(monster,this.lastEnemy)
            if(dis > maxDis)
                continue;
            if(!minMonster || dis < minDis)
            {
                minMonster = monster
                minDis = dis
            }
        }
        if(!minMonster)
            return false;

        this.hurtList[minMonster.id] = 1
        minMonster.addHp(-this.currentHurt)
        this.currentHurt *= 0.9
        TC.showLight(this.lastEnemy.getHitPos(),minMonster.getHitPos())
        this.enemyNum --;
        this.lastEnemy = minMonster

        return true
    }




    public onStep(){
        if(!this.relateTower)
            return;
        if(this.enemyNum <= 0)
            return;
        if(this.waitStep > 0)
        {
            this.waitStep --;
            return;
        }

        if(!this.hurtOne())
            this.enemyNum = 0;
        this.waitStep = 2
    }


    public canUseEnergySkill(){
        if(this.getNearEnemys(true,99999).length == 0)
            return false;
        return true;
    }

    public energySkillAction(){
        if(!this.relateTower)
            return false;

        var cd = PKTool.getStepByTime(this.vo.getSkillValue(4)*1000)
        var def = this.vo.getSkillValue(3);

        var b = false;

        var monsterArr = PKTowerUI.getInstance().monsterArr;
        var len = monsterArr.length;

        for(var i=0;i<len;i++)
        {
            var mItem:PKMonsterItem = monsterArr[i]
            if(mItem.isDie)
                continue

            mItem.def -= def;
            mItem.addBuff({
                id:18,
                key:'def_dec',
                value:def,
                step:cd,
                endFun:(buff)=>{
                    buff.target.def += buff.value;
                }
            })
            b = true;
        }

        return b;
    }
}