class PKManager {
    private static instance:PKManager;

    public static getInstance():PKManager {
        if (!this.instance)
            this.instance = new PKManager();
        return this.instance;
    }

    public maxEnergy = 20;
    public energyCD = 30*60;

    public energy = 1;
    public lastEnergyTime = 1;

    public atkLevel = 0//攻击
    public mAtkLevel = 0//魔法攻击力
    public mpLevel = 0//魔法上限
    public doubleLevel = 0//暴击率

    public myHero = [5,2,3,4,1];
    public posHero = []
    public heroValue = {};

    public initData(data) {

        data = data || {}
        var energyData = data.energy || {};
        this.energy = energyData.v || 0;
        this.lastEnergyTime = energyData.t || 0;

        var levels = data.playerLevel;
        this.atkLevel = levels[0] || 0;
        this.mAtkLevel = levels[1] || 0;
        this.mpLevel = levels[2] || 0;
        this.doubleLevel = levels[3] || 0;

        this.myHero = data.myHero || [1,2,3];
        this.posHero = data.posHero || [];
        this.heroValue = data.heroValue || {};
        this.myHero = [1,2,3,4,5]
    }

    public getHeroPos(id){
        return this.posHero.indexOf(id) + 1
    }

    public getSave(){
        return {
            energy:{v:this.energy,t:this.lastEnergyTime},
            playerLevel:[this.atkLevel,this.mAtkLevel,this.mpLevel,this.doubleLevel],
            myHero:this.myHero,
            posHero:this.posHero,
            heroValue:this.heroValue,
        }
    }

    public resetEnergy(){
        var num = Math.floor((TM_wx4.now() - this.lastEnergyTime)/this.energyCD)
        if(num)
        {
            this.energy += num;
            if(this.energy > this.maxEnergy)
                this.energy = this.maxEnergy;
            this.lastEnergyTime += num*this.energyCD;
        }
    }

    public getEnergy(){
        this.resetEnergy();
        return this.energy
    }

    public addEnergy(v){
        this.resetEnergy();
        this.energy += v;
        if(this.energy < 0)
            this.energy = 0;
        UM_wx4.needUpUser = true
    }

    public getNextEnergyCD(){
        return this.energyCD - (TM_wx4.now() - this.lastEnergyTime)
    }



    public getCoinRate(){
        return 1;
    }

    public getWinCoin(level){
        var rate = this.getCoinRate();
        return Math.ceil(level * 50 * rate)
    }

    public getFailCoin(level,rate){
        var rate2 = this.getCoinRate();
        return Math.ceil(level * rate * 20 * rate2)
    }

    public onGameEnd(isWin){

        UM_wx4.needUpUser = true
    }

    public getUpCost(){
        return 50 + Math.floor(Math.pow(this.atkLevel,1.5))*50
    }
    public upPlayerLevel(){
        var cost = this.getUpCost();
        this.atkLevel ++;
        UM_wx4.addCoin(-cost);
        SoundManager.getInstance().playEffect('upgrade')
    }


















    public sendKey
    public sendKeyName
    public sendGameStart(key){
        if(Config.isZJ || Config.isQQ)
            return;
        var wx = window['wx']
        if(!wx)
            return;
        this.sendKey = key
        this.sendKeyName = key == 9999?'无尽':'第'+key+'关'
        wx.aldStage.onStart({
            stageId : this.sendKey, //关卡ID， 必须是1 || 2 || 1.1 || 12.2 格式  该字段必传
            stageName : this.sendKeyName,//关卡名称，该字段必传
            userId  : UM_wx4.gameid//用户ID
        })
    }

    public sendGameReborn(type){
        if(Config.isZJ || Config.isQQ)
            return;
        var wx = window['wx']
        if(!wx)
            return;
        wx.aldStage.onRunning({
            stageId : this.sendKey,    //关卡ID 该字段必传
            stageName : this.sendKeyName, //关卡名称  该字段必传
            userId : UM_wx4.gameid,//用户ID
            event : "revive",  //支付成功 关卡进行中，用户触发的操作    该字段必传
            params : {    //参数
                itemName : type || 'unknow',  //购买商品名称  该字段必传
            }
        })
    }

    public sendGameEnd(isSuccess,info?){
        if(Config.isZJ || Config.isQQ)
            return;
        var wx = window['wx']
        if(!wx)
            return;
        wx.aldStage.onEnd({
            stageId : this.sendKey,    //关卡ID 该字段必传
            stageName : this.sendKeyName, //关卡名称  该字段必传
            userId : UM_wx4.gameid,  //用户ID 可选
            event : isSuccess?"complete":"fail",   //关卡完成  关卡进行中，用户触发的操作    该字段必传
            params : {
                desc :info  || 'unknow'  //描述
            }
        })
    }
}