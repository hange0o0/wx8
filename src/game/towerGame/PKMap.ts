class PKMap extends game.BaseContainer_wx4 {

    public arrowCon: eui.Group;
    public bottomCon: eui.Group;
    public roleCon: eui.Group;
    public topCon: eui.Group;





    public pos2Array = [];

    public arrowPool = [];
    public arrowItem = [];
    private arrowPos = {}//已放了箭头的位置
    private arrowLines = []

    public treePool = [];
    public treeItem = [];

    public posArr = [];
    public gunArr = [];


    public map = new Map();
    public randomSeedIn

    public ww
    public hh
    public data

    public wudiArr = []

    public roadPos = []
    public constructor() {
        super();
        this.skinName = "PKMapSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addChildAt(this.map,0)
        this.touchChildren = false;
    }

    public initMap(id){
        this.randomSeedIn = id*1000000*Math.random();
        this.map.initMap(this.randomSeedIn)
    }

    public draw(data,noPos?){
        this.data = data
        this.hh = data.length;
        this.ww = data[0].length;
        this.map.draw(data)
        this.renewTree(data);
        if(!noPos)
            this.renewPos(data);
        else
            this.renewPos2(data);


        this.roadPos.length = 0;
        for(var i=0;i<data.length;i++)
        {
            for(var j=0;j<data[i].length;j++)
            {
                var type = data[i][j]
                if(type == 1)
                {
                    this.roadPos.push(
                        {
                            x:j,
                            y:i
                        }
                    )
                }

            }
        }
    }



    public showWUDI(){
        var data = this.data
        for(var i=0;i<data.length;i++)
        {
            for(var j=0;j<data[i].length;j++)
            {
                var type = data[i][j]
                if(type == 6)
                {
                    var mv = MovieSimpleSpirMC.create();
                    mv.setData(this.getMVList('wudi',8))
                    mv.anchorOffsetX = 102/2 - 2
                    mv.anchorOffsetY = 102/2
                    this.bottomCon.addChild(mv)
                    mv.gotoAndPay()
                    mv.x =  j*64 + 32
                    mv.y =  i*64 + 32 + 10
                    this.posArr.push(mv)
                    this.wudiArr.push(mv)
                }

            }
        }
    }

    public hideWUDI(){
        for(var i=0;i<this.wudiArr.length;i++)
        {
            var mv = this.wudiArr[i];
            var index = this.posArr.indexOf(mv);
            if(index != -1)
            {
                this.posArr.splice(index,index);
            }
            mv.dispose();
        }
        this.wudiArr.length = 0;
    }

    private renewPos2(data){
        for(var i=0;i<this.pos2Array.length;i++)
        {
            MyTool.removeMC(this.pos2Array[i])
        }
        var index = 0;
        for(var i=0;i<data.length;i++)
        {
            for(var j=0;j<data[i].length;j++)
            {
                var type = data[i][j]
                if(type == 5 || type == 6 || type == 7)
                {
                    var mc = this.pos2Array[index];
                    index ++;
                    if(!mc)
                    {
                        mc = new eui.Image();
                        this.pos2Array.push(mc);
                    }
                    this.roleCon.addChild(mc);
                    if(type == 5)
                    {
                        mc.source = 'start_mc_png'
                        mc.anchorOffsetX = 39/2
                        mc.anchorOffsetY = 37/2 + 5
                    }
                    else if(type == 6)
                    {
                        mc.source = 'end_mc_png'
                        mc.anchorOffsetX = 48/2
                        mc.anchorOffsetY = 68*0.8
                    }
                    else
                    {
                        mc.source = 'hero_star_png'
                        mc.anchorOffsetX = 65/2
                        mc.anchorOffsetY = 57/2 + 5
                    }
                    mc.x =  j*64 + 32
                    mc.y =  i*64 + 32 + 10
                }

            }
        }
    }

    private renewPos(data){
        this.wudiArr.length = 0;
       while(this.posArr.length)
       {
           this.posArr.pop().dispose()
       }

        for(var i=0;i<data.length;i++)
        {
            for(var j=0;j<data[i].length;j++)
            {
                var type = data[i][j]
                if(type == 5 || type == 6)
                {
                    var mv = MovieSimpleSpirMC.create();
                    mv.setData(this.getMVList(type == 5?'start':'end',14))
                    mv.anchorOffsetX = 104/2 - 2
                    mv.anchorOffsetY = 56/2
                    this.bottomCon.addChild(mv)
                    mv.gotoAndPay()
                    mv.x =  j*64 + 32
                    mv.y =  i*64 + 32 + 10
                    this.posArr.push(mv)
                }

            }
        }
    }

    private getMVList(key,num){
        var arr = [];
        for(var i=1;i<=num;i++)
        {
            arr.push("resource/game_assets2/map/" +  key + '/mv_' + i + '.png')
        }
        return arr;
    }

    private renewTree(data){
        if(this.treeItem.length)
        {
            this.treePool = this.treePool.concat(this.treeItem)
            while(this.treeItem.length)
                MyTool.removeMC(this.treeItem.pop())
        }

        for(var i=0;i<data.length;i++)
        {
            for(var j=0;j<data[i].length;j++)
            {
                if(data[i][j] == 3)
                    this.addTree(j,i)
            }
        }
    }

    public addTree(x,y){
        var img:any = this.treePool.pop()
        if(!img)
        {
            img = new eui.Image()
        }
        this.roleCon.addChild(img);
        TC.randomSeed = this.randomSeedIn*(x*1000 + y)*123456789
        this.treeItem.push(img)
        var type = TC.random() > 0.5?1:2;
        var artID = Math.ceil(TC.random()*4)

        if(type == 1)
        {
            img.source = 'map_tree_'+artID+'_png'
            img.anchorOffsetX = 96
            img.anchorOffsetY = 96
            img.x =  x*64 +32
            img.y =  y*64 +32
        }
        else
        {
            img.source = 'map_tree2_'+artID+'_png'
            img.anchorOffsetX = 80
            img.anchorOffsetY = 80
            img.x =  x*64 + 16 + TC.random()*32// - 64
            img.y =  y*64 + 16 + TC.random()*32// - 64
        }
        return img
    }

    public getTowerByPos(x,y){
        var arr = this.gunArr;
        for(var i=0;i<arr.length;i++)
        {
            var tower = arr[i];
            if(tower.posX == x && tower.posY == y)
            {
                return tower;
            }
        }
    }

    public showTowerLight(x,y,r){
        for(var i = 0;i<this.gunArr.length;i++)
        {
            var tower = this.gunArr[i];
            if(tower.posX == x && tower.posY == y)
                tower.showBottomMC(r);
            else
                tower.showBottomMC(0);
        }
    }

    public renewTower(gunData,showDis?){
        while(this.gunArr.length)
        {
            TowerItem.freeItem(this.gunArr.pop());
        }

        for(var s in gunData)
        {
            var temp = s.split('_');
            var x = parseInt(temp[0])
            var y = parseInt(temp[1])
            var gunItem = TowerItem.createItem();
            this.gunArr.push(gunItem);
            this.roleCon.addChild(gunItem);
            gunItem.posX = x
            gunItem.posY = y
            gunItem.x = x*64 + 32
            gunItem.y = y*64 + 32
            gunItem.data = gunData[s]?HeroData.getHero(gunData[s]):0
        }
    }

    public clearArrow(){
        this.arrowLines.length = 0;
        this.arrowPos = {};
        if(this.arrowItem.length)
        {
            this.arrowPool = this.arrowPool.concat(this.arrowItem)
            this.arrowItem.length = 0;
        }
        this.arrowCon.removeChildren()
    }

    public showArrow(movePath,mapData){
        if(!movePath)
            return;
        var line = [];
        this.arrowLines.push(line);
        var len = movePath.length -1;
        for(var i=1;i<len;i++)
        {
            var oo1 = movePath[i]
            var type = mapData[oo1[1]][oo1[0]]
            if(type != 1 && type != 4)
                continue;
            var oo2 = movePath[i+1]
            line.push(this.addArrow(oo1,oo2))
        }
    }

    public addArrow(from,to){
        if(this.arrowPos[from[0] + '_' + from[1]])
            return this.arrowPos[from[0] + '_' + from[1]];
        var img:any = this.arrowPool.pop()
        if(!img)
        {
            img = new eui.Image('arrow_png')
            img.anchorOffsetX = 38/2
            img.anchorOffsetY = 44/2
        }
        this.arrowCon.addChild(img);
        this.arrowItem.push(img);
        img.x =  from[0]*64 + 32
        img.y =  from[1]*64 + 32 + 10

        img.rotation = Math.atan2(to[1]-from[1],to[0]-from[0])/Math.PI*180
        this.arrowPos[from[0] + '_' + from[1]] = img;
        return img;
    }

    public sortY(){
        var num = this.roleCon.numChildren;
        for(var i=1;i<num;i++)
        {
            var lastItem = this.roleCon.getChildAt(i-1)
            var currentItem = this.roleCon.getChildAt(i)
            if(currentItem.y < lastItem.y)//深度不对，调整
            {
                var index = 0;
                for(var j = i - 2;j>=0;j--)
                {
                    var lastItem = this.roleCon.getChildAt(j)
                    if(currentItem.y > lastItem.y)
                    {
                        index = j+1;
                        break;
                    }
                }
                this.roleCon.setChildIndex(currentItem,index)
            }
        }
    }
}