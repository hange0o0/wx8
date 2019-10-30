class DragHeroItem extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "DragHeroItemSkin";
    }


    public monsterMV:HeroMVItem = new HeroMVItem();
    private arrowMC: eui.Image;


    private tw
    public overTower
    public stateFireMV

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
        if(this.stateFireMV) {
            this.stateFireMV.stop()
            MyTool.removeMC(this.stateFireMV)
        }


        this.monsterMV.load(this.data)
        this.monsterMV.stand();
        this.setOKState(false)
    }

    public setOKState(b,overTower?){
        this.overTower = overTower;



        var heroData = HeroData.getHero(this.data)
        if(heroData.isEnergyFull())
        {
            if(!this.stateFireMV)
            {
                this.stateFireMV = new MovieSimpleSpirMC2()
                this.stateFireMV.anchorOffsetX = 531/3/2
                this.stateFireMV.anchorOffsetY = 532/2*0.8
                this.stateFireMV.x = 50
                this.stateFireMV.y = 140
                this.stateFireMV.setData('effect18_png',531/3,532/2,5,84)
                this.stateFireMV.widthNum = 3
                this.stateFireMV.stop()
            }

            if(!this.stateFireMV.stage)
            {
                this.addChildAt(this.stateFireMV,0)
                this.stateFireMV.play()
            }
        }
        else if(this.stateFireMV && this.stateFireMV.stage) {
            this.stateFireMV.stop()
            MyTool.removeMC(this.stateFireMV)
        }



        if(b)
        {
            if(!this.arrowMC.visible)
            {
                this.arrowMC.visible = true
                //this.monsterMV.atk();
                this.tw.setPaused(false);
                this.monsterMV.scaleX = this.monsterMV.scaleY = 1.2
                if(this.stateFireMV)
                    this.stateFireMV.scaleX = this.stateFireMV.scaleY = 1.2
            }
        }
        else
        {
            this.arrowMC.visible = false
            this.tw.setPaused(true);
            this.monsterMV.scaleX = this.monsterMV.scaleY = 0.8
            if(this.stateFireMV)
                this.stateFireMV.scaleX = this.stateFireMV.scaleY = 0.8
        }



    }

}