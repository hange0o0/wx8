class HPBar2 extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "HPBar2Skin";
    }

    public barMC: eui.Image;

    public childrenCreated() {
        super.childrenCreated();
    }


    public dataChanged(){
        var hp = this.data.hp;
        if(hp < 0)
            hp = 0
        var rate = hp/this.data.maxHp
        this.barMC.width = 50 * rate
    }

}