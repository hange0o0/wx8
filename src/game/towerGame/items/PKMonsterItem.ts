class PKMonsterItem extends game.BaseItem {
    private static pool = [];
    private static index = 1
     public static createItem():PKMonsterItem{
         var item:PKMonsterItem = this.pool.pop();
         if(!item)
         {
             item = new PKMonsterItem();
         }
         item.id = this.index;
         this.index++
         return item;
     }
     public static freeItem(item){
         if(!item)
             return;
         item.remove();
         if(this.pool.indexOf(item) == -1)
            this.pool.push(item);
     }

    private hpBar: HPBar;
    private list: eui.List;


    private dataProvider:eui.ArrayCollection
    public buffChange = false

    public path
    public targetPos
    public scale = 1



    public id = 0;
    public stopSkillStep = 0;
    public yunStep = 0;
    public iceStep = 0;
    public fireStep = 0;//缠绕
    public poisonStep = 0;
    public fireHurt = 0;
    public poisonHurt = 0;
    public speedRate = 0;
    public lastHurtTime = 0;
    public isSkilling = 0;

    public buff = [];

    public stateYunMV
    public stateFireMV
    public statePoisonMV
    public iceMC:eui.Image
    public monsterMV:PKMonsterMV_wx3 = new PKMonsterMV_wx3();
    
    

    public totalDis = 0;//到终点的距离，用于箭塔攻击排序
    public totalDisRecode = 0;//到终点的距离，用于箭塔攻击排序
    public speed
    public mvo:MonsterVO
    public hp
    public maxHp
    public def = 0
    public mDef = 0
    public isDie

    public constructor() {
        super();
        this.skinName = "PKMonsterItemSkin";
        this.monsterMV.addEventListener('mv_die',this.onDieFinish,this)
    }

    public childrenCreated() {
        super.childrenCreated();

        this.touchChildren = this.touchEnabled = false;
        this.hpBar.currentState = 's2';

        this.list.itemRenderer = BuffListItem;
        this.dataProvider = this.list.dataProvider = new eui.ArrayCollection([])

        this.addChildAt(this.monsterMV,0)
        this.monsterMV.x = 50;
        this.monsterMV.y = 300;
        this.anchorOffsetX = 50;
        this.anchorOffsetY = 300;
    }

    public setPath(path){
        this.path = path;
        var dis = 0;
        var lastPos
        for(var i=0;i<path.length;i++)
        {
            if(lastPos)
            {
                dis += Math.abs(lastPos[0] - path[i][0]) + Math.abs(lastPos[1] - path[i][1])
            }
            lastPos = path[i];
        }
        this.totalDisRecode = this.totalDis = dis*64;

    }
    public resetHpBarY(){
        this.hpBar.y = 300 - this.mvo.height*this.scale - 20
        this.list.y = this.hpBar.y - 30
        this.monsterMV.scaleX = this.monsterMV.scaleY = this.scale

    }

    public renewBuff(){
        var arr = [];
        var obj = {};
        for(var i=0;i<this.buff.length;i++)
        {
            var buff = this.buff[i];
            obj[buff.key] = true;
        }
        for(var s in obj)
        {
            arr.push(s);
        }
        this.dataProvider.source = arr;
        this.dataProvider.refresh();
        this.buffChange = false
    }

    public dataChanged(){
        this.mvo = MonsterVO.getObject(this.data)
        
        this.monsterMV.load(this.mvo.id)
        this.monsterMV.stand();
        this.monsterMV.alpha = 1;
        this.resetHpBarY();

        this.iceStep = 0;
        this.yunStep = 0;
        this.fireStep = 0;
        this.stopSkillStep = 0;
        this.poisonStep = 0;
        this.fireHurt = 0;
        this.poisonHurt = 0;
        this.lastHurtTime = 0;
        this.isSkilling = 0;
        this.targetPos = null;
        this.buff.length = 0;
        this.def = 0;
        this.mDef = 0;
        this.renewBuff();
        
        this.isDie = 0
        this.speed = this.mvo.speed/10
        var hp = Math.ceil(TC.monsterHPRate * this.mvo.hp);
        this.hp = hp
        this.maxHp = hp;
        this.speedRate = 1;
        
        
        

        MyTool.removeMC(this.iceMC)
        this.hpBar.visible = false;
        this.renewHp();

        if(this.stateYunMV) {
            this.stateYunMV.stop()
            MyTool.removeMC(this.stateYunMV)
        }
        if(this.stateFireMV) {
            this.stateFireMV.stop()
            MyTool.removeMC(this.stateFireMV)
        }
        if(this.statePoisonMV) {
            this.statePoisonMV.stop()
            MyTool.removeMC(this.statePoisonMV)
        }
    }

    public resetXY(x,y){
        this.x = x;
        this.y = y;
    }

    private onDieFinish(){
        if(this.isDie)
            this.isDie = 2;
    }

    public setIce(step,speedRate){
        if(!step)
            return;
        if(!this.iceMC)
        {
            this.iceMC =  new eui.Image('effect_ice_png');
            this.iceMC.anchorOffsetX = 102
            this.iceMC.anchorOffsetY = 161
            this.iceMC.x = 50;
            this.iceMC.y = 300;

        }

        this.iceStep = Math.max(step,this.iceStep);
        this.speedRate = Math.min(speedRate,this.speedRate);

        this.iceMC.scaleX = this.iceMC.scaleY = this.mvo.height/140*this.scale
        this.addChild(this.iceMC);
    }

    public setYun(step){
        if(this.isDie)
            return;
        if(!step)
            return;
        if(!this.yunStep)//表现晕
        {
            if(!this.stateYunMV)
            {
                this.stateYunMV = new MovieSimpleSpirMC2()
                this.stateYunMV.x =  50 -  154/4
                this.stateYunMV.setData('effect2_png',154/2,39,2,1000/6)
                this.stateYunMV.stop()
            }
            this.addChild(this.stateYunMV)
            this.stateYunMV.y = 300 - this.mvo.height - 40;
            this.stateYunMV.play()
            this.standMV()
        }
        this.yunStep = Math.max(step,this.yunStep);
        this.stopCurrentSkill();
    }


    public setFire(step,hurt){
        if(!step)
            return;
        if(!this.fireStep)//表现晕
        {
            if(!this.stateFireMV)
            {
                this.stateFireMV = new MovieSimpleSpirMC2()
                this.stateFireMV.anchorOffsetX = 531/3/2
                this.stateFireMV.anchorOffsetY = 532/2*0.8
                this.stateFireMV.x = 50
                this.stateFireMV.y = 300
                this.stateFireMV.setData('effect18_png',531/3,532/2,5,84)
                this.stateFireMV.widthNum = 3
                this.stateFireMV.stop()
            }
            this.addChild(this.stateFireMV)
            this.stateFireMV.play()
            this.stateFireMV.scaleX = this.stateFireMV.scaleY = this.mvo.height/140*this.scale
            this.standMV();
        }
        this.fireStep = Math.max(step,this.fireStep);
        this.fireHurt = Math.max(hurt,this.fireHurt);
    }


    public setPoison(step,hurt){
        if(!step)
            return;
        if(!this.poisonStep)//表现晕
        {
            if(!this.statePoisonMV)
            {
                this.statePoisonMV = new MovieSimpleSpirMC2()
                this.statePoisonMV.anchorOffsetX = 560/4/2
                this.statePoisonMV.anchorOffsetY = 412/2*0.8
                this.statePoisonMV.x = 50
                this.statePoisonMV.y = 300
                this.statePoisonMV.setData('effect17_png',560/4,412/2,7,84)
                this.statePoisonMV.widthNum = 4
                this.statePoisonMV.stop()
            }
            this.addChild(this.statePoisonMV)
            this.statePoisonMV.play()
            this.statePoisonMV.scaleX = this.statePoisonMV.scaleY = this.mvo.height/140*this.scale
        }
        this.poisonStep = Math.max(step,this.poisonStep);
        this.poisonHurt = Math.max(hurt,this.poisonHurt);
    }

    public stopCurrentSkill(){
        if(this.isSkilling)
        {

        }
    }

    public onStepRenew(){
        if(this.buffChange)
            this.renewBuff()
    }

    public onE(){
        if(this.isDie)
            return;
        this.runBuff();
        if(this.isDie)//buff会至死
            return;
        if(this.yunStep)
            return;



        if(this.fireStep)
            return;

        //move
        var speed = this.speed*this.speedRate;


        if(!this.targetPos)
        {
            var pos = this.path.shift()
            this.path.push(pos);
            this.targetPos = TC.getMonsterPosByPath(pos);
        }

        var addX = this.targetPos.x -  this.x
        var addY = this.targetPos.y -  this.y

        if(Math.abs(addX) < 1)
            addX = 0
        else if(Math.abs(addX) > speed)
            addX = addX>0?speed:-speed

        if(Math.abs(addY) < 1)
            addY = 0
        else if(Math.abs(addY) > speed)
            addY = addY>0?speed:-speed

        this.totalDis -= Math.abs(addX) + Math.abs(addY)
        if(this.totalDis < 0)
            this.totalDis += this.totalDisRecode;
        this.resetXY(this.x + addX,this.y+addY)
        this.runMV();


        this.monsterMV.scaleY = this.scale
        if(addX > 0)
            this.monsterMV.scaleX = -1*this.scale
        else if(addX < 0)
            this.monsterMV.scaleX = 1*this.scale

        if(Math.abs(this.targetPos.x -  this.x) < 1 && Math.abs(this.targetPos.y -  this.y) < 1 )
        {
            var pos = this.path.shift()
            this.path.push(pos);
            this.targetPos = TC.getMonsterPosByPath(pos);
        }
    }


    private runBuff(){
        if(this.yunStep)
        {
            this.yunStep --;
            if(this.yunStep <= 0)
            {
                this.yunStep = 0;
                this.stateYunMV.stop()
                MyTool.removeMC(this.stateYunMV)
            }
        }

        if(this.iceStep)
        {
            this.iceStep --;
            if(this.iceStep <= 0)
            {
                this.iceStep = 0;
                this.speedRate = 1;
                MyTool.removeMC(this.iceMC)
            }
        }

        if(this.fireStep)
        {
            this.fireStep --;
            if(this.fireStep <= 0)
            {
                this.fireStep = 0;
                this.fireHurt = 0;
                this.stateFireMV.stop()
                MyTool.removeMC(this.stateFireMV)
            }
        }

        if(this.poisonStep)
        {
            this.poisonStep --;
            if(this.poisonStep <= 0)
            {
                this.poisonStep = 0;
                this.statePoisonMV.stop()
                MyTool.removeMC(this.statePoisonMV)
            }
        }

        if(!this.isDie && TC.actionStep - this.lastHurtTime >= TC.frameRate)
        {
            this.lastHurtTime = TC.actionStep;
            var hurt = this.fireHurt + this.poisonHurt;
            if(hurt)
                this.addHp(-hurt,2)
        }

        var b = false;
        for(var i=0;i<this.buff.length;i++)
        {
            var buff = this.buff[i];
            buff.step--;
            buff.stepFun && buff.stepFun(buff)
            if(buff.step <= 0)
            {
                buff.endFun && buff.endFun(buff);
                this.buff.splice(i,1);
                i--;
                b = true;
            }
        }
        if(b)
            this.buffChange = true
    }

    //hurtType:0无加成，1要考虑物防，2要考虑魔防
    public addHp(v,hurtType=0){
        if(this.isDie)
            return

        if(v<0)
        {
            if(hurtType == 1)
            {
                v = v*(1-this.def/100)
            }
            else if(hurtType == 2)
            {
                v = v*(1-this.mDef/100)
            }
        }

        this.hp += v;
        if(this.hp <= 0)
        {
            this.hp = 0;
            this.isDie = 1
            this.dieMV();
        }
        this.renewHp()
        this.hpBar.visible = !this.isDie && this.hp < this.maxHp
        return v;
    }


    public runMV(){
        if(this.isDie)
            return;
        if(this.monsterMV.state != MonsterMV.STAT_RUN )
            this.monsterMV.run();
    }

    public standMV(){
        if(this.isDie)
            return;
        if(this.monsterMV.state != MonsterMV.STAT_STAND)
            this.monsterMV.stand();
    }
    public flyMV(){
        egret.Tween.removeTweens(this)
        egret.Tween.get(this).to({y:this.y-50},150).to({y:this.y},150)
    }

    public dieMV(){

        MyTool.removeMC(this.iceMC)
        if(this.stateYunMV) {
            this.stateYunMV.stop()
            MyTool.removeMC(this.stateYunMV)
        }
        if(this.stateFireMV) {
            this.stateFireMV.stop()
            MyTool.removeMC(this.stateFireMV)
        }
        if(this.statePoisonMV) {
            this.statePoisonMV.stop()
            MyTool.removeMC(this.statePoisonMV)
        }


        this.monsterMV.die();
        this.mvo.playDieSound()
        this.hpBar.visible = false;
    }

    public atkMV(){
        this.monsterMV.atk();
    }

    public renewHp(){
        this.hpBar.data = this;
    }

    public getHitPos(){
        return {
            x:this.x,
            y:this.y - this.mvo.height*0.4*this.scale
        }
    }

    public addBuff(data){
        data.target = this
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
        this.buffChange = true
    }

    public getBuffByID(id):any{
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

    public remove(){
        egret.Tween.removeTweens(this);
        MyTool.removeMC(this);
        this.monsterMV.stop();

        if(this.statePoisonMV)
            this.statePoisonMV.stop()
        if(this.stateFireMV)
            this.stateFireMV.stop()
        if(this.stateYunMV)
            this.stateYunMV.stop()
    }
}