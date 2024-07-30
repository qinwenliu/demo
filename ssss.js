
import { videoList } from "@/api/mainpage";
import * as THREE from "three"; //引入Threejs
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
// import rtsp2webrtc from '@/components/rtsp2webrtc'
export default {
  name: "MainPage",
  components: {
    // rtsp2webrtc,
  },
  mounted() {
    if(!localStorage.getItem('Admin-Token')){
      this.$router.push('/');
      return;
    }
    // 测试地址
    // this.$refs.video.connentStream(true, 'rtsp://admin:leinao123@192.168.8.220')
    // this.init();
    this.clock = new THREE.Clock();
    this.init();
    // this.animate();
    window.onpointerdown = this.selectObject;
  },
  data() {
    return {
      videoList: [],
      curIndex: 0,
      url: "https://realsee.com/ke/BEy832qG8mQDNnOe/1mlg5kWnP4kTkhxh1TaxzDMUG8wYBe4V/#lianjia",
      // 模型信息
      scene: "",
      light: "",
      camera: "",
      controls: "",
      renderer: "",
      load: "",
      clock: "",
      mixer: "",
      percentage:0,//进度条数据
      percentageBool:true,
      meshChildren:[],
    };
  },
  methods: {
    // 模型函数开始
    init() {
      var that = this;
      // 加缓存，避免模型再次请求
      // THREE.Cache.enabled = true;
      var container = document.getElementById("threeContained");
      // 创建场景
      that.scene = new THREE.Scene();
      // that.scene.background = new THREE.Color(0x8cc7de);
      that.scene.background = new THREE.Color("#080e30");
      // 创建相机
      that.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      );
      // that.camera.position.set( -70, 25, 90 );
      // 定位相机，并且指向场景中心(这里设置的值我是根据模型尺寸来写的，其实应该是动态获取模型长宽高后设置相机位置，根据自己模型大小来写)
      that.camera.position.x = 800;
      that.camera.position.y = 520;
      that.camera.position.z = 3000;
      //设置z轴朝上
      // that.camera.up.x = 0;
      // that.camera.up.y = 0;
      // that.camera.up.z = 1;
      that.camera.lookAt(that.scene.position);
 
      // 显示三维坐标系
      // var axes = new THREE.AxesHelper(100);
      // // 添加坐标系到场景中：红色是X轴绿色是y轴蓝色是z轴
      // that.scene.add(axes);
 
      // // 创建地面的几何体
      // var planeGeometry = new THREE.PlaneGeometry(800, 1000);
      // // 给地面物体上色
      // var planeMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
      // // 创建地面
      // var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      // plane.material.opacity = 0.6;
      // plane.material.transparent = true;
      // plane.rotation.x = -0.5 * Math.PI;
      // plane.position.x = 0;
      // plane.position.y = 0;
      // plane.position.z = 0;
      // plane.castShadow = true;
      // // 接收阴影
      // plane.receiveShadow = true;
      // that.scene.add(plane);
 
      // 灯光
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
      hemiLight.position.set(0, 1, 0);
      that.scene.add(hemiLight);
 
      const directionalLight1 = new THREE.DirectionalLight(0xffeeff, 0.8);
      directionalLight1.position.set(1, 1, 1);
      that.scene.add(directionalLight1);
 
      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight2.position.set(-1, 0.5, -1);
      that.scene.add(directionalLight2);
 
      const ambientLight = new THREE.AmbientLight(0xffffee, 0.25);
      that.scene.add(ambientLight);
 
      // stats消耗资源展示
      // that.stats = new Stats();
      // container.appendChild(that.stats.dom);
 
      // 材质
      //   const normal = new THREE.TextureLoader().load(
      //     "models/shanghai/textures/shanghai.jpg"
      //   );
      // model
      that.loader = new FBXLoader();
      // that.loader.load("/models/SHIWAI.FBX",function (geometry) {
      // that.loader.load("https://img.cnbita.com/meshes.fbx",function (geometry) {
      // that.loader.load("https://img.cnbita.com/fbx/BDZ.FBX", function (geometry) {
      that.loader.load("/models/fbx/BDZ.FBX", function (geometry) {
        // that.loader.load("https://img.cnbita.com/fbx/newMeshes.fbx", function (geometry) {
         that.percentageBool = false;
          // geometry.scale.set(0.04, 0.04, 0.04);
          geometry.scale.set(0.1,0.1,0.1);
          geometry.position.set(0, 36, 0);
          that.scene.add(geometry);
          that.animate();
        },
        // onProgress回调
        function ( xhr ) {
          that.percentage = Math.floor(xhr.loaded / xhr.total * 100);
          that.$forceUpdate();
          // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        // onError回调
        function ( err ) {
          console.error( 'An error happened' );
        }
      );
      // 创建渲染器
      that.renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true,
      });
      that.renderer.setPixelRatio(window.devicePixelRatio);
      // 设置渲染器的初始颜色
      that.renderer.setClearColor(new THREE.Color(0xeeeeee));
      // 设置输出canvas画面的大小
      // that.renderer.setSize(window.innerWidth, window.innerHeight);
      that.renderer.setSize(container.clientWidth,container.clientHeight);
      container.appendChild(that.renderer.domElement);
      // 控制模型的旋转
      const controls = new OrbitControls(that.camera, that.renderer.domElement);
      controls.target.set(0, 12, 0);
      controls.update();
      window.addEventListener("resize", that.onWindowResize);
    },
    // 窗口缩放
    onWindowResize() {
      var container = document.getElementById("threeContained");
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth,container.clientHeight);
    },
    // 动画
    animate() {
      // requestAnimationFrame(this.animate);
 
      // this.renderer.render(this.scene, this.camera);
 
      // this.stats.update();
 
      requestAnimationFrame(this.animate);
      const delta = this.clock.getDelta();
      if (this.mixer) this.mixer.update(delta);
      this.renderer.render(this.scene, this.camera);
      // this.stats.update();
    },
    // 鼠标点击事件
    selectObject(event){
      if(this.percentageBool){
        return;
      }
      let container = document.getElementById('threeContained');
      if(!container){
        return;
      }
        var mouse = new THREE.Vector2();
        var raycaster = new THREE.Raycaster();
        let getBoundingClientRect = container.getBoundingClientRect()
        let x = ((event.clientX - getBoundingClientRect.left) / container.offsetWidth) * 2 - 1;// 标准设备横坐标
        let y = -((event.clientY - getBoundingClientRect.top) / container.offsetHeight) * 2 + 1;// 标准设备纵坐标
        let standardVector = new THREE.Vector3(x, y, 1);// 标准设备坐标
        // 标准设备坐标转世界坐标
        let worldVector = standardVector.unproject(this.camera);
        // 射线投射方向单位向量(worldVector坐标减相机位置坐标)
        let ray = worldVector.sub(this.camera.position).normalize();
        // 创建射线投射器对象
        let rayCaster = new THREE.Raycaster(this.camera.position, ray);
        // 返回射线选中的对象 第二个参数如果不填 默认是false
        let intersected = rayCaster.intersectObjects(this.scene.children, true);
        if (intersected.length) {
          const found = intersected[0];
          if(found.object.name == "354713923249152"){
              this.$router.push({
                path:'/home/monitoring/monitoringVideo',
                query:{
                  id:found.object.name
                }
              })
          } 
      }
    }
  },
};
</script>
 
<style scoped lang="scss">
@import "style/index.scss";
#threeContained {
  width: 100%;
  height: 100%;
}
.iframehtml {
  width: 100%;
  height: 100%;
}
.mx {
  width: 97.5%;
  height: 96%;
  margin: 0 auto;
  border-radius: 6.5% 6% 6% 6%;
  position: absolute;
  left: 1.25%;
  top: 2%;
  overflow: hidden;
  // bottom: 5%;
  // right: 4%;
  .modelMask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    // background: #080e30;
    // background: rgba($color: #080e30, $alpha: 0.85);
    background: url('~@/assets/images/modelBg.png') no-repeat center center;
    background-size: 100% 100%;
    z-index: 9;
    display: flex;
    .marg {
      width: 300px;
      height: 60px;
      margin: auto;
      text-align: center;
      p {
        color: #e2e2e2;
        font-size: 13px;
      }
      .elPro {
        width: 100%;
        margin-top: 10px;
      }
    }
     
  }
}
</style>