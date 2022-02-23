<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: sunke9
 * @Date: 2021-11-18 16:31:45
 * @LastEditors: sunke9
 * @LastEditTime: 2022-01-08 10:31:14
-->
<template>
  <div class="main-contain" id="main" ref="main">
     
  </div>
</template>

<script>
import * as THREE from 'three';
import * as GEOLIB from 'geolib'
import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js'
export default {
    name:"Home",
    data(){
        return {
           scene:null,
           camera:null,
           renderer:null,
           controls:null,
           
           stats:null,//调试组件

           center:[106.5259917,29.4576334],
           Mat_Material:new THREE.MeshPhongMaterial()
        }
    },
    computed:{
       
    },
    mounted(){  
        this.$nextTick(()=>{
            this.initThree()
        })
    },
    methods:{
        initThree(){//初始化threejs函数入口
            this.initScene()
            this.initCamera()
            this.initLight()
            // this.initMesh()
            this.initRenderer()
            this.initControls()
            this.initGeoJson()//初始化模型数据
            this.upDate()
            window.addEventListener('resize',this.onWindowResize,false)
            
        },
        onWindowResize(){//监听视口的变化
            this.camera.aspect=window.innerWidth /window.innerHeight
            this.camera.updateProjectionMatrix()  
            this.camera.setSize(window.innerWidth,window.innerHeight)
        },
        initScene(){//初始化场景
            this.scene = new THREE.Scene();
            const size = 60;
            const divisions = 160;
            const gridHelper = new THREE.GridHelper( size, divisions,new THREE.Color( 0xffff) );
            this.scene.add( gridHelper );  
        },
        initCamera(){//初始化相机
            this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
            this.camera.position.set(8,4,0)
        },
        initLight(){
            let ambientLight=new THREE.AmbientLight(0xfafafa,0.25);//环境光
            let pointLight1=new THREE.PointLight(0xfafafa,0.4);
            let pointLight2=new THREE.PointLight(0xfafafa,0.4);
            pointLight1.position.set(200,90,40)
            pointLight2.position.set(200,90,-40)
            this.scene.add(ambientLight)
            this.scene.add(pointLight1)
            this.scene.add(pointLight2)
        },
        initMesh(){//初始化物体
            const geometry = new THREE.BoxGeometry( 1, 1, 1 );
            const material = new THREE.MeshBasicMaterial( {color: 0x772056} );
            const cube = new THREE.Mesh( geometry, material );
            this.scene.add( cube );
        },
        initRenderer(){//初始化渲染器
            this.renderer=new THREE.WebGLRenderer();
            var width = window.innerWidth; //窗口宽度
            var height = window.innerHeight; //窗口高度
            this.renderer.setSize(width, height);//设置渲染区域尺寸
            this.renderer.setPixelRatio(window.devicePixelRatio)//设置像素比
            this.$refs.main.appendChild(this.renderer.domElement)
        },
        initControls(){//初始化控制器
            this.controls = new OrbitControls(this.camera,this.renderer.domElement);//创建控件对象
            this.controls.enableDamping=true
            this.controls.dampingFactor=0.25
            this.controls.screenSpacePanning=false
            this.controls.maxDistance=800
            this.stats=new Stats()//初始化调试器
            this.$refs.main.appendChild(this.stats.domElement)
        },
        upDate(){
            requestAnimationFrame(this.upDate)
            this.renderer.render(this.scene,this.camera)
            this.controls.update()
            this.stats.update()
        },
        initGeoJson(){
            fetch('../../../static/modeData/buildings.geojson').then(res=>{
                console.log("res",res)
                res.json().then(data=>{
                   this.buildBuildings(data)
                })
            })
        },
        buildBuildings(data){
            let fe=data.features
            console.log("fetures",fe)
            fe.map((item,index)=>{
                
                if(item.properties['building']){
                    this.addOneBuilding(item.geometry.coordinates,item.properties,item.properties['building:levels'])
                }
            })
        },
        addOneBuilding(data,info,height){
            let shape,gemotry
            let holes=[]//给房屋打洞使用到的数组
           for(let i=0;i<data.length;i++){
               if(i==0){
                shape=this.getShape(data[i])
                }
                else{
                    holes.push(this.getShape(data[i]))
                }
            }
            for(let i=0;i<holes.length;i++){
              
                shape.holes.push(holes[i])
                
            }

             gemotry=this.getGemotry(shape,{
                    depth: 0.07*(height||1), bevelEnabled: false,curveSegment:1
                })
                gemotry.rotateX(Math.PI/2)
                gemotry.rotateX(Math.PI)
                let mesh=new THREE.Mesh( gemotry,  this.Mat_Material);
                
                this.scene.add(mesh)
        },
        getShape(points){
            let shape=new THREE.Shape();
            for(let i=0;i<points.length;i++){
                let elp=this.GPSDistance(points[i],this.center)
                if(i==0){
                    shape.moveTo( elp[0], elp[1] );
                }
                else{
                    shape.lineTo(elp[0], elp[1])
                }
            }
            return shape
        },
        getGemotry(shape,config){
            let gemotry = new THREE.ExtrudeBufferGeometry( shape, config );
            gemotry.computeBoundingBox()
            console.log("gemotry",gemotry)
            return gemotry
        },
        GPSDistance(pos,center){
            let dis=GEOLIB.getDistance(pos,center)
            let bearing=GEOLIB.getRhumbLineBearing(pos,center)
            let x=center[0]+(dis * Math.cos(bearing * Math.PI/180))
            let y=center[1]+(dis * Math.sin(bearing * Math.PI/180))
            return [-x/100,-y/100]
        }
    }
}
</script>

<style>
.text{
    margin:0 auto;
    width: 300px;
    height: 300px;
    text-align: center;
}
</style>