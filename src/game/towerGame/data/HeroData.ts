class HeroData{
    public constructor() {

    }
    public id = 1;
    public level = 1;

    public energy;
    public maxEnergy;

    public mp;
    public maxMp;

    public lastAtkTime = 0;

    public atk;
    public atkSpeed;
    public atkDis;
    public atkBase;
    public atkSpeedBase;
    public atkDisBase;

    public skillCD = 30*5
    public lastSkillTime
    public skillNeed = 30

    public stopStep = 0

    public vo:GunVO

    public relateTower

    public reset(){
        var PKM = PKManager.getInstance();
        this.energy = 0;
        this.maxEnergy = 10;
        this.mp = 100;
        this.maxMp = 100;


        this.stopStep = 0;
        this.lastAtkTime = 0;
        this.lastSkillTime = 0;


        this.vo = GunVO.getObject(this.id)
        this.atk = this.atkBase = this.vo.atk/2
        this.atkSpeed = this.atkSpeedBase = 30//this.vo.atkspeed*PKM.getForceRate()
        this.atkDis = this.atkDisBase = 100//this.vo.atkdis*PKM.getForceRate()
    }

    public isEnergyFull(){
        return this.energy >= this.maxEnergy;
    }
    public canUseEnergySkill(){
        return true;
    }

    public testUseEnergySkill(){
        if(!this.isEnergyFull())
            return;
        if(!this.canUseEnergySkill())
            return;
        this.addEnergy(-this.energy);
        this.energySkillAction();
    }

    public addEnergy(v){
        this.energy += v;
        if(this.energy > this.maxEnergy)
            this.energy = this.maxEnergy;
        else if(this.energy < 0)
            this.energy = 0;
    }


    public addMp(v){
        this.mp += v;
        if(this.mp > this.maxMp)
            this.mp = this.maxMp;
        else if(this.mp < 0)
            this.mp = 0;
    }

    public autoAddMp(){
        this.addMp(this.maxMp/1800)
    }

    public canSkill(){
        if(this.mp < this.skillNeed)
            return false;
        if(TC.actionStep - this.lastSkillTime < this.skillCD)
            return false;
        if(!this.getNearEnemys(true))
            return false;
        return true
    }

    public useSkill(){
        this.addMp(-this.skillNeed)
        this.lastSkillTime = TC.actionStep;
    }

    public skillAction(){
        if(!this.relateTower)
            return;

        var atkList = this.getNearEnemys()
        ArrayUtil_wx4.sortByField(atkList,['totalDis'],[0])

        var enemy = atkList[0];
        if(enemy)
        {
            enemy.addHp(-this.atk*2);
        }
    }

    public atkAction(enemy){
        enemy.addHp(-this.atk)
    }


    public getNearEnemys(isTest?){
        var atkList = [];
        var monsterArr = PKTowerUI.getInstance().monsterArr;
        var len = monsterArr.length;
        var atkDis = this.atkDis

        for(var i=0;i<len;i++)
        {
            var mItem:PKMonsterItem = monsterArr[i]
            if(mItem.isDie)
                continue
            if(MyTool.getDis(mItem,this.relateTower) > atkDis)
                continue
            atkList.push(mItem)
            if(isTest)
                return atkList;
        }
        return atkList;
    }


    public energySkillAction(){
        if(!this.relateTower)
            return;

        var atkList = this.getNearEnemys()
        ArrayUtil_wx4.sortByField(atkList,['totalDis'],[0])

        var enemy = atkList[0];
        if(enemy)
        {
            enemy.addHp(-this.atk*10);
        }
    }




    //******************************************************************
    public static hDatas = []
    public static getHero(id):HeroData{
        if(!this.hDatas[id])
        {
            var cls = this.getClassByHid(id);
            this.hDatas[id] = new cls();
            this.hDatas[id].id = id;
            this.hDatas[id].reset();
        }
        return this.hDatas[id];
    }

    public static getClassByHid(hid){
        switch(hid)
        {
            case 1:return H1;
            case 2:return H2;
            case 3:return H3;
            case 4:return H4;
            case 5:return H5;
            case 6:return H6;
            case 7:return H7;
            case 8:return H8;
            case 9:return H9;
            case 10:return H10;
            case 11:return H11;
            case 12:return H12;
            case 13:return H13;
            case 14:return H14;
            case 15:return H15;
            case 16:return H16;
            case 17:return H17;
            case 18:return H18;
        }
    }

}