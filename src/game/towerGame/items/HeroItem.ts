class HeroItem extends game.BaseItem {

    private static pool = [];
    public static createItem():HeroItem {
        var item:HeroItem = this.pool.pop();
        if (!item) {
            item = new HeroItem();
        }
        return item;
    }

    public static freeItem(item:HeroItem) {
        if (!item)
            return;
        item.remove();
        if (this.pool.indexOf(item) == -1)
            this.pool.push(item);
    }


    public monsterMV:HeroMVItem = new HeroMVItem();


    public atk
    public atkSpeed = 100
    public atkDis = 100

    public scale = 0.7


    public lastAtkTime = 0//上次攻击的时间
    public enemy//被攻击的目标
    public hurtStep//攻击到达倒计时
    public stopStep//不到移动的时间
    public aliveTime = 0

    public frameSpeed = 1;

    public isDie = 0
    public constructor() {
        super();
    }

    public childrenCreated() {
        super.childrenCreated();

        this.touchChildren = this.touchEnabled = false;

        this.addChildAt(this.monsterMV,0)
        this.monsterMV.x = 50;
        this.monsterMV.y = 300;
        this.anchorOffsetX = 50;
        this.anchorOffsetY = 300;

        this.monsterMV.scaleX = this.monsterMV.scaleY = this.scale;
    }



    public dataChanged(){
        this.monsterMV.load(this.data.id)
        this.monsterMV.stand();
        this.monsterMV.alpha = 1;

        this.atkSpeed = this.data.atkSpeed
        this.atk = this.data.atk
        this.atkDis = this.data.atkDis
        this.aliveTime = this.data.aliveTime

        this.lastAtkTime = 0;
        this.enemy = null;
        this.hurtStep = 0;
        this.stopStep = 0;
        this.isDie = 0

        this.setSpeed(this.frameSpeed)
    }

    public setSpeed(speed){
        this.frameSpeed = speed
        this.monsterMV && this.monsterMV.setSpeed(speed)
    }

    private testAtk(){
        if(TC.actionStep - this.lastAtkTime < this.atkSpeed)
            return;


        var monsterArr = PKTowerUI.getInstance().monsterArr;
        var len = monsterArr.length;
        var atkDis = this.atkDis

        var enemy
        var minDis
        for(var i=0;i<len;i++)
        {
            var mItem:PKMonsterItem = monsterArr[i]
            if(mItem.isDie)
                continue
            var dis = MyTool.getDis(mItem,this);
            if(dis > atkDis)
                continue

            if(!enemy || minDis > dis)
            {
                enemy = mItem;
                minDis = dis;
            }
        }

        if(enemy)
        {
            this.atkMV();
            this.hurtStep = 15;
            this.stopStep = this.atkSpeed;
            this.enemy = enemy;
            this.lastAtkTime = TC.actionStep;

            var addX = Math.floor(this.enemy.x - this.x)
            if(addX > 0)
                this.monsterMV.scaleX = -1*this.scale
            else if(addX < 0)
                this.monsterMV.scaleX = 1*this.scale
        }

    }


    public onE(){
        this.aliveTime --;
        if(this.aliveTime <=0)
        {
            this.isDie = 2;
            return;
        }
        if(this.enemy && this.enemy.isDie)
        {
            this.enemy = null;
        }

        if(this.hurtStep > 0)
        {
            this.hurtStep --;
            if(this.hurtStep == 0)
            {
                if(this.enemy)
                {
                    this.enemy.addHp(-this.atk);
                }
            }
        }

        if(this.stopStep > 0)
        {
            this.stopStep --;
            return;
        }

        this.testAtk();
    }

    public atkMV(){
        this.monsterMV.atk();
    }

    public remove(){
        egret.Tween.removeTweens(this);
        MyTool.removeMC(this);
        this.monsterMV.stop();
    }
}