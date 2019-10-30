class BuffListItem extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "BuffListItemSkin";
    }

    private mc: eui.Image;


    public childrenCreated() {
        super.childrenCreated();
    }


    public dataChanged(){
        this.mc.source = 'buff_' + this.data + '_png'
    }

}