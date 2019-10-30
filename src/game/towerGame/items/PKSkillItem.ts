class PKSkillItem extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "PKSkillItemSkin";
    }

    private selectMC: eui.Image;
    private energyBar: HPBar;
    private mpBar: HPBar;
    private infoBtn: eui.Button;



    public monsterMV:HeroMVItem = new HeroMVItem();
    public stopMove = true;
    public id;
    public stateFireMV

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
        this.addBtnEvent(this.infoBtn,this.onInfoClick)

        this.addChildAt(this.monsterMV,0)
        this.monsterMV.x = 60;
        this.monsterMV.y = 130;

        DragManager.getInstance().setDrag(this)

    }

    private onClick(e){
        PKTowerUI.getInstance().setSelect(this.data);
    }

    private onInfoClick(e){
        e.stopImmediatePropagation();
        console.log('showInfo',this.data.id)
    }



    public dataChanged(){
        this.selectMC.visible = false;
        this.infoBtn.visible = false;

        this.id = this.data.id;
        this.monsterMV.load(this.data.id)
        this.monsterMV.stand();
        this.renewInfo();
        this.renewSelect();
    }

    public renewSelect(){
        this.selectMC.visible = false
        this.infoBtn.visible = this.data == PKTowerUI.getInstance().selectItem;
    }

    public onE(){
        this.renewInfo();
    }

    public renewInfo(){
        this.energyBar.data = {hp:this.data.energy,maxHp:this.data.maxEnergy};
        this.mpBar.data = {hp:this.data.mp,maxHp:this.data.maxMp};


        var heroData = this.data
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
    }

}