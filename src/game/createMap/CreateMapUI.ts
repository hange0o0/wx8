class CreateMapUI extends game.BaseUI_wx4 {

    private static _instance: CreateMapUI;
    public static getInstance(): CreateMapUI {
        if(!this._instance)
            this._instance = new CreateMapUI();
        return this._instance;
    }

    private list: eui.List;
    private widthText: eui.EditableText;
    private heightText: eui.EditableText;
    private roadBtn: eui.Button;
    private resetRoadBtn: eui.Button;
    private cancelRoadStepBtn: eui.Button;
    private saveBtn: eui.Button;
    private resetBtn: eui.Button;
    private beforeBtn: eui.Button;
    private levelText: eui.Label;
    private nextBtn: eui.Button;
    private wDecBtn: eui.Button;
    private wAddBtn: eui.Button;
    private hDecBtn: eui.Button;
    private hAddBtn: eui.Button;
    private backBtn: eui.Button;






    public map = new Map();
    public lineShap = new egret.Shape();


    public ww;
    public hh;
    public mapData;

    public data;
    public isChange;
    public level
    public scale = 1

    public roadArr = [];
    public roadItems = [];

    public isAddRoad = false
    public constructor() {
        super();
        this.skinName = "CreateMapUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addChild(this.map);
        this.map.initMap(1)
        this.map.isGame = false;
        this.map.addChild(this.lineShap);

        this.list.itemRenderer = CreateMapItem
        this.list.selectedIndex = 0;
        this.list.dataProvider = new eui.ArrayCollection([0,1,2,3])


        this.addBtnEvent(this.wDecBtn,()=>{
            this.ww --;
            this.widthText.text = this.ww + ''
            this.setHeight()
        })
        this.addBtnEvent(this.wAddBtn,()=>{
            this.ww ++;
            this.widthText.text = this.ww + ''
            this.setHeight()
        })
        this.addBtnEvent(this.hDecBtn,()=>{
            this.hh --;
            this.heightText.text = this.hh + ''
            this.setHeight()
        })
        this.addBtnEvent(this.hAddBtn,()=>{
            this.hh ++;
            this.heightText.text = this.hh + ''
            this.setHeight()
        })


        this.addBtnEvent(this.saveBtn,()=>{
            if(!DebugUI.getInstance().getOtherData)
            {
                MyWindow.Confirm('使用的默认数据，确定要保存吗？',(b)=>{
                    if(b==1)
                    {
                        this.onSave();
                    }
                },['取消','确定']);
                return;
            }
            this.onSave();


        })

        this.addBtnEvent(this.roadBtn,()=>{
            this.isAddRoad = !this.isAddRoad
            this.renewRoad();
        })

        this.addBtnEvent(this.resetRoadBtn,()=>{
            this.roadArr.length = 0;
            this.renewRoad();
        })
        this.addBtnEvent(this.cancelRoadStepBtn,()=>{
            this.roadArr.pop();
            this.renewRoad();
        })

        this.addBtnEvent(this.resetBtn,()=>{
            this.resetMapData();
            this.isChange = true;
            this.renewMap();
        })


        this.addBtnEvent(this.backBtn,()=>{
            if(this.isChange)
            {
                MyWindow.Confirm('还没保存，确定退出吗？',(b)=>{
                    if(b==1)
                    {
                        this.hide();
                    }
                },['取消','确定']);
                return
            }
            this.hide();
        })
        this.addBtnEvent(this.beforeBtn,()=>{
            if(this.isChange)
            {
                MyWindow.Confirm('还没保存，确定退出吗？',(b)=>{
                    if(b==1)
                    {
                        this.gotoLevel(-1);
                    }
                },['取消','确定']);
                return
            }
            this.gotoLevel(-1);
        })
        this.addBtnEvent(this.nextBtn,()=>{
            if(this.isChange)
            {
                MyWindow.Confirm('还没保存，确定退出吗？',(b)=>{
                    if(b==1)
                    {
                        this.gotoLevel(1);
                    }
                },['取消','确定']);
                return
            }
            this.gotoLevel(1);
        })

        this.map.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this)
        this.map.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouch,this)
        this.map.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchClick,this)
    }

    private onSave(){
        if(!this.data)
        {
            this.data = new LevelVO();
            this.data.id = this.level
            LevelVO.list.push(this.data)
            LevelVO.data[this.data.id] = this.data;
        }
        this.data.width = this.ww;
        this.data.height = this.hh;
        this.data.data = this.getSaveData();
        this.data.roadArr = this.getRoadSaveData();
        this.isChange = false;
        this.data.reset();
        CreateMapManager.getInstance().save();
    }

    private renewRoad(){
        this.resetRoadBtn.visible = this.isAddRoad
        this.cancelRoadStepBtn.visible = this.isAddRoad
        this.roadBtn.skinName = this.isAddRoad?'Btn1Skin':'Btn2Skin'

        while(this.roadItems.length)
        {
            CreateMapRoadItem.freeItem(this.roadItems.pop())
        }
        this.map.addChild(this.lineShap);
        this.lineShap.graphics.clear();

        var b = false

        for(var i=0;i<this.roadArr.length;i++)
        {
            this.lineShap.graphics.beginFill(0x000000);
            this.lineShap.graphics.lineStyle(8,0xFF0000);


            var item = CreateMapRoadItem.createItem();
            this.roadItems.push(item);
            this.map.addChild(item);
            item.data = this.roadArr[i];

            if(!b)
            {
                b = true;
                this.lineShap.graphics.moveTo(item.x,item.y)
            }
            else
            {
                this.lineShap.graphics.lineTo(item.x,item.y)
            }

            this.lineShap.graphics.endFill();
        }


    }


    private renewLevelText(){
        this.levelText.text = this.level;
    }

    private gotoLevel(add){
        if(this.data)
            var lv = this.data.id
        else
            var lv = LevelVO.list.length + 1;
        lv += add;
        if(lv < 1)
            return;
        this.show(LevelVO.getObject(lv));
    }

    private getSaveData(){
        var arr = []
        for(var i=0;i<this.mapData.length;i++)
        {
            var temp = this.mapData[i].concat();
            arr.push(temp.join(''))
        }
        return arr.join('')
    }

    private getRoadSaveData(){
        var arr = []
        for(var i=0;i<this.roadArr.length;i++)
        {
            var oo = this.roadArr[i];
            arr.push(oo.x+'_' + oo.y);
        }
        return arr.join(',')
    }

    private onTouch(e){
        if(this.isAddRoad)
            return;

        var itemSize = 64*this.scale;
        var x = Math.floor((e.stageX - this.map.x)/itemSize)
        var y = Math.floor((e.stageY - this.y - this.map.y)/itemSize)
        if(y >= this.hh || y < 0 || x >= this.ww || x < 0)
            return;

        var type = this.list.selectedItem || 0;
        if(this.mapData[y][x] != type)
        {
            this.mapData[y][x] = type;
            this.isChange = true;
            this.renewMap();

            //显示路的数量，比例

        }


    }

    private onTouchClick(e){
        if(!this.isAddRoad)
            return;
        var itemSize = 64*this.scale;
        var x = Math.floor((e.stageX - this.map.x)/itemSize)
        var y = Math.floor((e.stageY - this.y - this.map.y)/itemSize)
        if(y >= this.hh || y < 0 || x >= this.ww || x < 0)
            return;
        this.roadArr.push({
            id:this.roadArr.length+1,
            x:x,
            y:y
        })
        this.renewRoad();
    }

    private setHeight(){
        this.ww = Math.min(10,parseInt(this.widthText.text))
        this.hh = Math.min(15,parseInt(this.heightText.text))
        this.mapData.length = this.hh;
        for(var i=0;i<this.hh;i++)
        {
            if(!this.mapData[i])
                this.mapData[i] = [];
            this.mapData[i].length = this.ww
            for(var j=0;j<this.ww;j++)
            {
                if(!this.mapData[i][j])
                    this.mapData[i][j] = 0;
            }
        }

        this.isChange = true;
        this.renewMap();
    }

    private resetMapData(){
        this.mapData = [];
        for(var i=0;i<this.hh;i++)
        {
            this.mapData.push([]);
            for(var j=0;j<this.ww;j++)
            {
                this.mapData[i].push(0);
            }
        }
    }

    public show(data?){
        this.data = data;
        this.mapData = [];
        if(!data)
        {
            var level = this.level = LevelVO.list.length + 1;
            this.ww = Math.min(10,6 + Math.floor(level/5))
            this.hh = Math.min(15,8 + Math.floor(level/5))

            this.resetMapData();

        }
        else
        {
            this.level = data.id;

            this.ww = data.width
            this.hh = data.height
            var roadArr = data.roadPos
            this.roadArr = [];
            for(var i=0;i<roadArr.length;i++)
            {
                this.roadArr.push({
                    id:i+1,
                    x:roadArr[i][0],
                    y:roadArr[i][1],
                })
            }

            var arr1 = data.getRoadData();
            for(var i=0;i<this.hh;i++)
            {
                this.mapData.push([]);
                for(var j=0;j<this.ww;j++)
                {
                    var id = Math.floor(arr1[i][j]) || 0
                    this.mapData[i].push(id);
                }
            }
        }
        super.show();
    }

    public hide() {
        super.hide();
    }

    public onShow(){

        this.renew()
        this.renewRoad();
    }

    private renewMap(){
        this.scale = TowerManager.getInstance().getScale(this.ww,this.hh,400)
        this.map.scaleX = this.map.scaleY = this.scale;


        this.map.horizontalCenter = 0
        this.map.verticalCenter = -150
        this.map.draw(this.mapData);

        this.renewLevelText();
    }

    private renew(){
        this.isChange = false;
        this.renewMap();
        this.widthText.text = this.ww + ''
        this.heightText.text = this.hh + ''
    }

}