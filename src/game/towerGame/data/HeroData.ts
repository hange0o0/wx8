class HeroData{
    public constructor() {

    }
    public id = 1;
    public level = 1;
    public loopEnergy = 1;

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
    public skillCost = 30

    public stopStep = 0

    public vo:GunVO

    public relateTower

    public buff = []

    public bulletNum = 0

    public reset(){
        var PKM = PKManager.getInstance();
        this.relateTower = null;
        this.energy = 0;
        this.stopStep = 0;
        this.lastAtkTime = -9999;
        this.lastSkillTime = -9999;
        this.buff.length = 0;


        var vo = this.vo = GunVO.getObject(this.id)
        this.atk = this.atkBase = vo.atk
        this.atkSpeed = this.atkSpeedBase = PKTool.getStepByTime(vo.atkspeed,false)//this.vo.atkspeed*PKM.getForceRate()
        this.atkDis = this.atkDisBase = vo.atkdis//this.vo.atkdis*PKM.getForceRate()


        this.maxEnergy = vo.energy;
        this.mp = this.maxMp = vo.mp;
        this.skillCD = PKTool.getStepByTime(vo.cd*1000,false)
        this.skillCost = vo.mpcost
    }

    public getBuffByID(id){
        for(var i=0;i<this.buff.length;i++)
        {
            var buff = this.buff[i];
            if(buff.id == id)
            {
                return buff;
            }
        }
        return null;
    }

    public removeBuff(buff){
        var index = this.buff.indexOf(buff);
        if(index != -1)
            this.buff.splice(index,1)
    }

    public addBuff(data){
        data.target = this;
        if(data.id)
        {
            var b = false;
            for(var i=0;i<this.buff.length;i++)
            {
                var buff = this.buff[i];
                if(buff.id == data.id)
                {
                    b = true;
                    buff.endFun && buff.endFun(buff);
                    this.buff.splice(i,1);
                    i--;
                }
            }
        }
        this.buff.push(data);
        this.relateTower && this.relateTower.renewBuff()
    }

    public buffRun(){
        var b = false
        for(var i=0;i<this.buff.length;i++)
        {
            var buff = this.buff[i];
            buff.step--;
            buff.stepFun && buff.stepFun(buff)
            if(buff.step <= 0)
            {
                b = true;
                buff.endFun && buff.endFun(buff);
                this.buff.splice(i,1);
                i--;
            }
        }
        b && this.relateTower && this.relateTower.renewBuff();
    }

    public isEnergyFull(){
        return this.energy >= this.maxEnergy;
    }
    public canUseEnergySkill(){
        return true;
    }

    public testUseEnergySkill(){
        if(!this.relateTower)
            return;
        if(!this.isEnergyFull())
            return;
        if(!this.canUseEnergySkill())
            return;

        this.relateTower.useEnergyMV(this.loopEnergy);
        //this.addEnergy(-this.energy);
        //this.energySkillAction();
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
        if(!this.skillCD)
            return false;
        if(this.mp < this.skillCost)
            return false;
        if(TC.actionStep - this.lastSkillTime < this.skillCD)
            return false;
        return true
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


    public getNearEnemys(isTest?,addLen=0){
        var atkList = [];
        var monsterArr = PKTowerUI.getInstance().monsterArr;
        var len = monsterArr.length;
        var atkDis = this.atkDis + addLen;

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

    public onStep(){

    }




    //******************************************************************
    public static hDatas = {}
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


    //用地剌攻击敌人，对其及其附近的敌人造成#1点伤害，并晕眩#2秒          攻击附近生命最高的敌人，造成#3的伤害
    //用力震击地面，对附近的敌人，造成#1点伤害，并降低#2%的移动速度3秒    用力震击地面，对附近的敌人，造成#3点伤害，并晕眩#2秒
    //每次或最多攻击附近#1个敌人        召唤一道龙卷风，对经过的敌人造成每秒#3点伤害，并减速50%，持续#4秒
    //降低附近敌人#1%的防御力    沉默地图上所有的敌人，持续#3秒
    //攻击时，会对目标附近的敌人同时造成伤害        晕眩地图上所有的敌人，持续#3秒
    //用火焰灼烧附近的敌人，造成#1的伤害          在地图上随机生成#3朵火焰，灼烧经过的敌人，持续#4秒
    //缠绕附近的敌人使其无法移动并造成#1的伤害，持续#2秒      为地图上所有英雄回复#3点魔法
    //有#1%的机率产生暴击，并造成#2倍伤害        对附近的敌人，造成#3的伤害
    //召唤落石攻击生命最高的敌人，造成#1点伤害，并晕眩#2秒      对地图上所有敌人造成#1点伤害
    //攻击中有#1%的机率产生重击，并造成#2点伤害，并晕眩1秒        变强，增加#3%的攻击力，持续#4秒
    //冰冻一定范围的敌人，造成#1点伤害，并减速#2%，持续3秒       每隔1.5秒对附近的敌人释放一次冰冻，共释放$3波
    //向前方发出一道冲击波，对沿途敌人造成#1点伤害     向8个方向成米字型发出冲击波
    //攻击时会对目标附近敌人造成#1%的溅射  召唤火雨攻击敌人，每波火雨造成#3点伤害，共释放$4波
    //攻击时附带火焰，额外造成#1点伤害         增加自身50%的攻击速度，持续#3秒
    //释放一道闪电链，对最多#1个敌人造成#2点伤害，攻击力会递减     降低地图上所有敌人#3%的防御力，持续#4秒
}