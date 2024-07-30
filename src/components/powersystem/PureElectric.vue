<template>
  <div id="container" @mouseenter="onMouseDblclick">
    <div v-if='innerVisible' class="moveText"
       :style="{top:dragTop+'px',left:dragLeft+'px'}">
       <p align="center">运行信息</p>
      <p>名称: {{imfor.name}}</p>
      <p>ID: {{imfor.uuid}}</p>
      <p>x: {{imfor.x}}</p>
      <p>y: {{imfor.y}}</p>
    </div>
    <!-- <button @click="pause()" type="button" style="position: absolute;padding: 10px;">暂停/继续</button> -->
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

export default {
  data() {
    return {
      clock: new THREE.Clock(),
      publicPath: process.env.BASE_URL,
      mesh: null,
      currentTime:0,
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
      animations: [],
      stats:{},
      vehicles:{},

      imfor:{
        name:'',
        uuid:'',
        x:'',
        y:'',
      },
      dragTop:-100,
      dragLeft:-200,
      innerVisible: false,
      // vehicleGroup : new THREE.Group(),
      // selVehicleGroup : new THREE.Group(),
    }
  },

  mounted() {
    this.init()
    window.addEventListener('mousemove', this.onMouseDblclick)
  },
  
  methods: {
    // 初始化
    init() {
      this.createScene() // 创建场景
      this.loadFBX() // 加载GLTF模型
      this.createLight() // 创建光源
      this.createCamera() // 创建相机
      this.createRender() // 创建渲染器
      this.createControls() // 创建控件对象
      // this.initStats()
      this.animation()
      this.render()
    },
    // 创建场景
    createScene() {
      this.scene = new THREE.Scene()
    },
    // 加载GLTF模型
    loadFBX() {
      const THIS = this
      const loader = new FBXLoader()
      this.model = {}
      this.box = {}

      loader.load(`${THIS.publicPath}model2222.fbx`, model => {
        model.scale.multiplyScalar(.0003)
        // model.material.color.setStyle('#ca14cb');
        model.children[2].material.color.setStyle('#808080')
        this.scene.add(model)
        console.log(this.scene)
        console.log(model.children[2]);
        this.mixer = new THREE.AnimationMixer(model.scene)
        this.mixer.timeScale = 0.5
        for (var i=0;i<model.animations.length;i++){
          this.mixer.clipAction(model.animations[i]).play();
        }


      })

    },
    // 创建光源
    createLight() {
      // 环境光
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1) // 创建环境光
      this.scene.add(ambientLight) // 将环境光添加到场景

      const spotLight = new THREE.SpotLight(0xffffff) // 创建聚光灯
      spotLight.position.set(100, 200, 100)
      spotLight.castShadow = true
      this.scene.add(spotLight)
    },

    pause() {
      if (this.action.paused) {
        // 如果是播放状态，设置为暂停状态
        this.action.paused = false;
      } else {
        // 如果是暂停状态，设置为播放状态
        this.action.paused = true;
      }
    },
    
    // 创建相机
    createCamera() {
      const element = document.getElementById('container')
      const width = element.clientWidth // 窗口宽度
      const height = element.clientHeight // 窗口高度
      const k = width / height // 窗口宽高比
      // PerspectiveCamera( fov, aspect, near, far )
      this.camera = new THREE.PerspectiveCamera(45, k, 0.1, 2000)
      this.camera.position.set(150, 150, 150) // 设置相机位置

      this.camera.lookAt(new THREE.Vector3(20, 40, 0)) // 设置相机方向
      this.scene.add(this.camera)
    },
    // 创建渲染器
    createRender() {
      const element = document.getElementById('container')
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      this.renderer.setSize(element.clientWidth, element.clientHeight) // 设置渲染区域尺寸
      this.renderer.shadowMap.enabled = true // 显示阴影
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      this.renderer.setClearColor(0xffffff, 1) // 设置背景颜色
      element.appendChild(this.renderer.domElement)
    },
    initStats() {
              this.stats = new this.ThreeStats.Stats();
              //这里说一下所有这种放到dom的对象都可以进行样式操作
              document.body.appendChild(this.stats.dom)
          },

       /**
   * 将屏幕坐标转换为3d 坐标
   */
  getIntersects (event) {
    event.preventDefault();
    // console.log("event.clientX:" + event.clientX)
    // console.log("event.clientY:" + event.clientY)
    // const selBoxMesh = this.box.clone();
    // console.log(selBoxMesh);
    // this.vehicles.selBoxMesh = selBoxMesh;
    // this.selVehicleGroup.add(this.vehicles.selBoxMesh);

    // console.log(this.selVehicleGroup)
    // 声明 raycaster 和 mouse 变量
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
    raycaster.setFromCamera(mouse, this.camera);

    // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
    var intersects = raycaster.intersectObjects(this.scene.children, false);
  

    //返回选中的对象
          
    return intersects;
  },

  showObject (obj,event) {
    // console.log(obj.name)
    // console.log("event.clientX:" + event.clientX)
    this.dragTop = event.clientY - 50
    this.dragLeft = event.clientX - 50
    this.imfor.name = obj.name
    this.imfor.uuid = obj.uuid
    this.imfor.x = event.clientX
    this.imfor.y = event.clientY
    },

  onMouseDblclick(event) {
      // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
      let intersects = this.getIntersects(event);
      // let timeNow = Date.now()
      // console.log(timeNow)
      // if(timeNow - this.currentTime > 30){
      //   if (intersects.length != 0 && intersects[0].object instanceof THREE.Mesh) {
      //     let selectObject = intersects[0].object;
      //     // console.log(selectObject)
      //     // this.changeMaterial(selectObject);
      //     this.innerVisible = true
      //     this.showObject (selectObject,event)}else{
      //       this.innerVisible = false
      //     }
      //   this.currentTime = timeNow
      //   console.log(this.currentTime)
      // }
      // console.log(intersects)
      // 获取选中最近的 Mesh 对象
      if (intersects.length != 0 && intersects[0].object instanceof THREE.Mesh) {
        let selectObject = intersects[0].object;
        // console.log(selectObject)
        // this.changeMaterial(selectObject);
        this.innerVisible = true
        this.showObject (selectObject,event)

      }else{
        this.innerVisible = false
      }
    },

    // changeMaterial(object) {
    //   let material = new THREE.MeshLambertMaterial({
    //     // color: 0xff0000,
    //     // transparent: object.material.transparent ? false : true,
    //     // opacity: 0.8
    //   });
    //   object.material = material;
    //   },

    render() {
      if (this.mixer) {
      const delta = this.clock.getDelta() // 获取自上次调用的时间差
      this.mixer.update(delta)
    }
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(this.render)
    },
    animation () {
      this.controls.update()
      requestAnimationFrame(this.animation)
      this.renderer.render(this.scene, this.camera)
  },
    // 创建控件对象
    createControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    }
  }
}
</script>
<style scoped>
#container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.moveText {
  position: absolute;
  padding: 20px;
  background: rgba(154, 200, 225, 0.8);

}
.p{
    font-size: 20px;
    text-align: left;
    color: #fff;
  }
</style>