<template>
<div class="body"> 
  <div id="app" class="contain">
    <amap 
    ref="myMap"
    :zooms="zooms" 
    :zoom="zoom" 
    :center="center"
    
    viewMode="3D"
    :pitch="pitch"
    :rotation="rotation"
    skyColor="black"
    :amapManager="amapManager"
     wallColor="#66CDAA"
     roofColor="#00FA9A"
    @complete="doWithMap"
    >
      <!-- <amap-marker
       
      /> -->
      <amap-satellite-layer ></amap-satellite-layer>
      <amap-road-net-layer ></amap-road-net-layer>
     
    </amap>
  </div>
  </div>
</template>

<script>
import { AMapManager, lazyAMapApiLoaderInstance } from "vue-amap";
let amapManager = new AMapManager();

export default {
  name: "App",
 
  data() {
    return {
      pitch: 75, // 地图俯仰角度，有效范围 0 度- 83 度
      rotation:105,//左右旋转
      viewMode: '3D', // 地图模式
      zoom: 17, //初始化地图级别
      zooms: [17, 22],
      center: [106.530084, 29.4525], //初始化地图中心点位置

      otherObj:{},
      amapManager:amapManager,
      map:{},//地图实例
      
    }
  },
  mounted(){
    
   
  },
  methods:{
    doWithMap(){
      this.map=this.$refs.myMap.$map
      console.log("myMap",this.map)
      let that=this
      let buildingLayer= that.initBuildings()
      this.map.setLayers([
                          // 高德默认标准图层
                      new AMap.TileLayer.Satellite({zIndex:0}),
                      new AMap.TileLayer.RoadNet({//路网图层
                      zIndex: 16,
                      }),
                      buildingLayer,
                    ])
   

  

 

      var layer = new AMap.LabelsLayer({
        zooms: [3, 20],
        zIndex: 1000,
        // 开启标注避让，默认为开启，v1.4.15 新增属性
        collision: true,
        // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
        animation: true,
    });

        this.map.add(layer);

      
    // 图层添加到地图
      var bounds = this.map.getBounds();
      this.map.setLimitBounds(bounds);
      console.log("图层数据",this.map.getLayers())
    },
    
    initBuildings(){
       var buildingLayer = new AMap.Buildings({
                zIndex: 18,
                zooms: [17, 22],
                heightFactor:2,
            });
        var options = {
                hideWithoutStyle: false, //是否隐藏设定区域外的楼块
                areas: [{ //围栏,
                    visible:true,//是否可见
                    rejectTexture: false, //是否屏蔽自定义地图的纹理
                    color1: 'ff99ff00', //楼顶颜色
                    color2: 'ff999900', //楼面颜色
                    path: [
                        [106.528586, 29.458799],
                        [106.53026, 29.458586],
                        [106.53101, 29.458055],
                        [106.531236, 29.457235],
                        [106.532213, 29.457083],
                        [106.533154, 29.456385],
                        [106.53305, 29.456097],
                        [106.532509, 29.455049],
                        [106.532858, 29.454305],
                        [106.533764, 29.453106],
                        [106.534375, 29.450342],
                        [106.529562, 29.44562],
                        [106.526842, 29.446228],
                        [106.527278, 29.448126],
                        [106.526877, 29.451603],
                        [106.525657, 29.453151],
                        [106.526895, 29.454745],
                        [106.525849, 29.456218],
                        [106.527592, 29.458101],
                        [106.528464, 29.458799]
                    ]
                }]
            };
            buildingLayer.setStyle(options); //此配色优先级高于自定义mapStyle
            this.addPoly(options.areas[0].path,this.map)
            return buildingLayer
    },
    addPoly(path,map){//加围栏效果
      new AMap.Polygon({
        bubble:true,
        fillOpacity:0,
        strokeColor: "FFFF00", //线颜色    
        strokeOpacity: 0.8, //线透明度    
        strokeWeight: 5, //线宽    
        fillColor:'#FF7F24',
        path:path,
        map:map
     })
    }
  }
};
</script>




<style lang="less" scoped>
.body{
  width: 100%;
  height: 100%;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 1920px;
  height: 1080px;
 
  
}
</style>
