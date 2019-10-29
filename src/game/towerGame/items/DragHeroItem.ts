class DragHeroItem extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "DragHeroItemSkin";
    }


    public monsterMV:HeroMVItem = new HeroMVItem();
    private arrowMC: eui.Image;


    private tw
    public overTower

    public childrenCreated() {
        super.childrenCreated();

        this.anchorOffsetX = 50;
        this.anchorOffsetY = 180;

        this.addChildAt(this.monsterMV,0)
        this.monsterMV.x = 50;
        this.monsterMV.y = 140;

        this.tw = egret.Tween.get(this.arrowMC,{loop:true}).to({y:135},300).to({y:125},300);
        this.tw.setPaused(true);
        this.arrowMC.visible = false
    }

    public dataChanged(){
        this.monsterMV.load(this.data)
        this.monsterMV.stand();
        this.setOKState(false)
    }

    public setOKState(b,overTower?){
        this.overTower = overTower;
        if(b)
        {
            if(!this.arrowMC.visible)
            {
                this.arrowMC.visible = true
                this.monsterMV.atk();
                this.tw.setPaused(false);
                this.monsterMV.scaleX = this.monsterMV.scaleY = 1.2
            }
        }
        else
        {
            this.arrowMC.visible = false
            this.tw.setPaused(true);
            this.monsterMV.scaleX = this.monsterMV.scaleY = 1
        }
    }

}