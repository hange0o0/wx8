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

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.infoBtn,this.onClick)

        this.addChildAt(this.monsterMV,0)
        this.monsterMV.x = 60;
        this.monsterMV.y = 130;

        DragManager.getInstance().setDrag(this)

    }

    private onClick(e){

    }



    public dataChanged(){
        this.selectMC.visible = false;
        this.infoBtn.visible = false;

        this.id = this.data.id;
        this.monsterMV.load(this.data.id)
        this.monsterMV.stand();
        this.renewInfo();
    }

    public setSelect(data){
        this.selectMC.visible = this.data == data;
        this.infoBtn.visible = this.selectMC.visible;
    }

    public onE(){
        this.renewInfo();
    }

    public renewInfo(){
        this.energyBar.data = {hp:this.data.energy,maxHp:this.data.maxEnergy};
        this.mpBar.data = {hp:this.data.mp,maxHp:this.data.maxMp};
    }

}