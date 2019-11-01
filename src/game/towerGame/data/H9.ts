class H9 extends HeroData{
    public constructor() {
        super();
    }

    public fireList = []
    public reset(){
        super.reset();
        while(this.fireList.length)
        {
            this.fireList.pop().dispose();
        }
    }

    public onStep(){
        if(!this.relateTower)
            return;
        if(TC.actionStep - this.lastSkillTime < 15)
            return;

        var hurt = this.vo.getSkillValue(1);
        this.lastSkillTime = TC.actionStep;

        var monsterArr = [];

        if(this.mp >= this.skillCost)//用魔法
        {
            monsterArr = this.getNearEnemys()
            this.addMp(-this.skillCost)
        }

        //地图上的火
        var len = this.fireList.length
        for(var i=0;i<len;i++)
        {
             var fireItem = this.fireList[i];
            if(fireItem.endTime < TC.actionStep)//过时
            {
                fireItem.dispose();
                this.fireList.splice(i,1);
                i--;
                len--;
                continue;
            }


            var monsterArr2 = PKTowerUI.getInstance().monsterArr;
            var len2 = monsterArr2.length;
            var atkDis = 40;

            for(var j=0;j<len2;j++)
            {
                var mItem:PKMonsterItem = monsterArr2[j]
                if(mItem.isDie)
                    continue
                if(monsterArr.indexOf(mItem) != -1)
                    continue;
                if(MyTool.getDis(mItem,fireItem) > atkDis)
                    continue
                monsterArr.push(mItem)
            }
        }

        var len = monsterArr.length;
        for(var i=0;i<len;i++)
        {
            monsterArr[i].addHp(-hurt,2);
        }
    }

    public energySkillAction(){
        if(!this.relateTower)
            return false;

        var arr = PKTowerUI.getInstance().pkMap.roadPos.concat();
        var num = this.vo.getSkillValue(3)
        var endTime = TC.actionStep + PKTool.getStepByTime(this.vo.getSkillValue(4)*1000)
        while(num > 0)
        {
            num --;
            var oo = ArrayUtil_wx4.randomOne(arr,true)
            this.addOneFire(oo.x,oo.y,endTime)
        }
        return true
    }

    public addOneFire(x,y,endTime){
        var stateFireMV = new MovieSimpleSpirMC2()
        PKTowerUI.getInstance().addToRoleCon(stateFireMV);
        stateFireMV['endTime'] = endTime
        stateFireMV.anchorOffsetX = 531/3/2
        stateFireMV.anchorOffsetY = 532/2*0.8
        stateFireMV.x = x*64 + 32
        stateFireMV.y = y*64 + 32
        stateFireMV.setData('effect18_png',531/3,532/2,5,84)
        stateFireMV.widthNum = 3
        stateFireMV.play()
        this.fireList.push(stateFireMV)
    }


}