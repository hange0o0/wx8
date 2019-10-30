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
        this.mc.rotation = 90
    }

    public dataChanged(){
        this.owner = this.data.owner;
        this.target = this.data.target;
        this.waitStep = this.owner.atkSpeed/2

        this.mc.source = 'bullet9_png';

        this.isDie = 0
        this.targetDiePos = null

        this.scaleX = this.scaleY = 0;
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

    public onAtk(){
        if(this.targetDiePos)
            return;
        var hurt = -this.owner.atk;
        this.target.addHp(hurt);
    }

    public remove(){
        MyTool.removeMC(this);
    }
}