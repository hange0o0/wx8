class PKBulletItem extends game.BaseItem {
    private static pool = [];
    public static createItem():PKBulletItem {
        var item:PKBulletItem = this.pool.pop();
        if (!item) {
            item = new PKBulletItem();
        }
        return item;
    }

    public static freeItem(item) {
        if (!item)
            return;
        item.remove();
        if (this.pool.indexOf(item) == -1)
            this.pool.push(item);
    }

    private mc: eui.Image;

    public owner:HeroData;
    public target:PKMonsterItem;


    public speed = 15;
    public isDie = 0;
    public waitStep = 0;

    public hurt = 0
    public type = 'bullet'
    public atkR = 0
    public rota = 0
    public endTime = 0
    public lastHurt = {}


    public targetDiePos;
    public constructor() {
        super();
        this.skinName = "PKBulletItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.anchorOffsetX = 25
        this.anchorOffsetY = 25

        //this.mc.scaleX = this.mc.scaleY = 0.6
        //this.mc.rotation = 90
    }

    public dataChanged(){
        this.owner = this.data.owner;
        this.target = this.data.target;
        this.waitStep = this.owner.atkSpeed/2

        this.type = 'bullet'
        this.mc.source = 'bullet9_png';
        this.hurt = this.owner.getHurt()

        this.isDie = 0
        this.targetDiePos = null

        this.scaleX = this.scaleY = 0;
        this.lastHurt = {};

        var sp = this.data.sp;
        if(sp)
        {
            if(sp.img)this.mc.source = sp.img;
            if(sp.type)this.type = sp.type;
            if(sp.atkR)this.atkR = sp.atkR;
            if('rota' in sp)this.rota = sp.rota;
            if(sp.speed)this.speed = sp.speed;
            if(sp.hurt)this.hurt = sp.hurt;
            if(sp.endTime)this.endTime = sp.endTime;
            this.scaleX = this.scaleY = 1;
            this.waitStep = 0
            this.rotation = this.rota/Math.PI*180
            //type:'move_hit',
            //atkR:60,
            //rota:rota,
            //speed:5,
            //hurt:this.getHurt(),
            //endTime:TC.actionStep + 20,
            //img:'skill22_png'
        }
    }

    public resetXY(x,y){
        this.x = x;
        this.y = y;
    }

    public onE(){
        if(this.isDie)
            return;
        if(this.waitStep > 0)
        {
            this.waitStep --;
            return;
        }
        if(this.scaleX<1)
        {
            this.scaleX = this.scaleY = this.scaleX + 0.2;
        }




        if(this.type == 'bullet')
        {
            if(this.target.isDie && !this.targetDiePos)
            {
                this.targetDiePos = this.target.getHitPos();
            }
            var targetXY = this.targetDiePos || this.target.getHitPos()
            var rota = Math.atan2(targetXY.y-this.y,targetXY.x-this.x)

            this.rotation = rota/Math.PI*180
            var addX = this.speed*Math.cos(rota)
            var addY = this.speed*Math.sin(rota)
            this.resetXY(this.x + addX,this.y+addY)

            if(MyTool.getDis(this,targetXY) <= this.speed)
            {
                this.isDie = 1;
                this.onAtk();
            }
        }
        else
        {
            var addX = this.speed*Math.cos(this.rota)
            var addY = this.speed*Math.sin(this.rota)
            this.resetXY(this.x + addX,this.y+addY)
            var mArr = PKTowerUI.getInstance().monsterArr;
            var len = mArr.length
            for(var i=0;i<len;i++)
            {
                var mItem = mArr[i];
                if(mItem.isDie)
                    continue;
                if(this.lastHurt[mItem.id])
                    continue;
                if(MyTool.getDis(mItem,this) < this.atkR)
                {
                    this.lastHurt[mItem.id] = TC.actionStep;
                    mItem.addHp(-this.hurt,2);
                }
            }

            if(this.endTime && TC.actionStep > this.endTime)
            {
                this.isDie = 1;
            }
        }

    }

    public onAtk(){
        if(this.targetDiePos)
            return;
        var hurt = -this.hurt;
        this.target.addHp(hurt,1);
    }

    public remove(){
        MyTool.removeMC(this);
    }
}