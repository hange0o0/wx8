class CreateMapRoadItem extends game.BaseItem{
    private static pool = [];
    public static createItem():CreateMapRoadItem {
        var item:CreateMapRoadItem = this.pool.pop();
        if (!item) {
            item = new CreateMapRoadItem();
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



    public constructor() {
        super();
        this.skinName = "CreateMapRoadItemSkin";
    }

    private txt: eui.Label;



    public childrenCreated() {
        super.childrenCreated();
        this.anchorOffsetX = 20
        this.anchorOffsetY = 20
    }

    public dataChanged():void {
        this.txt.text = this.data.id;
        this.x = (this.data.x + 0.5)*64;
        this.y = (this.data.y + 0.5)*64;
    }

    public remove(){
        MyTool.removeMC(this);
    }
}