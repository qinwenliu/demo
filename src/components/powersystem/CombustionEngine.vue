<template>
  <div id="screen" :style="{'width':`${style.width}px`,'height':`${style.height}px`,'transform':`${style.transform}`}">
    <div class="diolag">
      <el-dialog
			title="提示"
			:visible.sync="dialogVisible"
			width="30%"
			>
				<el-upload class="upload-demo"
					ref="upload"
					drag 
					action="http://localhost:8080/api/v1/upload" 
					multiple
					:auto-upload="false"
					:limit="5"
					:on-success="handleFilUploadSuccess"
					:on-remove="handleRemove"
					>
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					<div class="el-upload__tip" slot="tip">只能上传 Excel 文件，且不超过500kb</div>
				</el-upload>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleUpload">确 定</el-button>
			</span>
        </el-dialog>
    </div>
  <div id="container" @mouseenter="onMouseDblclick">
    <div class="modelMask" v-if="percentageBool">
            <div class="marg">
              <p>loading 3D model</p>
              <div class="elPro">
                <el-progress :stroke-width="6" :show-text="false" :percentage="parseInt(percentage)>100?100:parseInt(percentage)"></el-progress>
              </div>
            </div>
    </div>
      <!-- 左 -->
      <div class="topLeft">
        <dv-decoration-10 class="dv-dec-10"/>
        <div class="topCenter">
          <dv-decoration-8 class="dv-dec-8"/>
          <div class="topTitle">
              <span class="title-text">模型可视化平台</span>
              <dv-decoration-6 class="dv-dec-6"/>
            </div>
          <dv-decoration-8 class="dv-dec-8-s"/>
        </div>
        <dv-decoration-10 class="dv-dec-10-s"/>
      </div>
        <div class="large-left" v-if = "innerVisible">
          <gradinfor></gradinfor>
          <pie></pie>
          <operationalstatus></operationalstatus>
          <faultinfor></faultinfor>
      </div>
      <!-- <el-dialog
			title="提示"
			:visible.sync="dialogVisible"
			width="30%"
			>
			<span>
				<el-upload class="upload-demo"
					ref="upload"
					drag 
					action="http://localhost:8080/api/v1/upload" 
					multiple
					:auto-upload="false"
					:limit="5"
					:on-success="handleFilUploadSuccess"
					:on-remove="handleRemove"
					>
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					<div class="el-upload__tip" slot="tip">只能上传 Excel 文件，且不超过500kb</div>
				</el-upload>
			</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleUpload">确 定</el-button>
			</span>
        </el-dialog> -->
    <button @click="back()" type="button" class="b-one"></button>
    <button @click="changemodel()" type="button" class="b-two">更换模型</button>
  </div>
</div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gradinfor from '../big_screen/GradInfor.vue'
import pie from '../big_screen/Pie.vue'
import operationalstatus from '../big_screen/OperationalStatus.vue'
import faultinfor from '../big_screen/FaultInfor.vue'


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
      percentage:0,
      percentageBool:true,
      highlightedObject: null,
      style: {
        width: "1920",
        height: "1080",
        transform: "scaleY(1) scaleX(1) translate(-50%, -50%)"
      },

      imfor:{
        name:'',
        uuid:'',
        x:'',
        y:'',
      },
      dragTop:-100,
      dragLeft:-200,
      innerVisible: true,
      dialogVisible: false,
      fileList: [],
      // vehicleGroup : new THREE.Group(),
      // selVehicleGroup : new THREE.Group(),
    }
  },
  components: {
    gradinfor,
    pie,
    operationalstatus,
    faultinfor
  },

  mounted() {
    this.init()
    // window.addEventListener('click', this.onMouseDblclick,true)

      let that = this;
      that.setScale();
      /*窗口改变事件*/
      $(window).resize(()=> {
        that.setScale();
      });
  },
  
  methods: {
    // 初始化
    init() {
      this.createScene() // 创建场景
      this.loadGLTF() // 加载GLTF模型
      this.createLight() // 创建光源
      this.createCamera() // 创建相机
      this.createRender() // 创建渲染器
      this.createControls() // 创建控件对象
      // this.initStats()
      this.animation()
      this.render()
    },
    handleAdd() {
      this.$refs.fileUploadDialog.show()
    },
    back(){
      this.$router.push('/Dashboard')
      console.log(2222);
    },
    changemodel(){
      this.dialogVisible = true;
    },
    getAttachList() {
      this.loading = true
      this.attachQuery.billId = this.form.noticeId
      this.attachQuery.billType = 10
      listAttachment(this.attachQuery).then(response => {
        this.attachList = response.rows
        this.attachList.forEach(el => {
          // 转为kb，取小数点后2位
          el.fileSize = parseFloat(el.fileSize / 1024).toFixed(2)
        })
        this.attachTotal = response.total
        this.loading = false
      }).catch(() => {})
    },


    handlePreview(file) {
            console.log(file)
        },
    handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
    beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        // 选取完文件触发事件
    onChange(a, fileList) {
            this.fileList = fileList;
        },
    importFile() {
  		var inputObj=document.createElement('input')
        inputObj.setAttribute('id','_ef');
        inputObj.setAttribute('type','file');
        inputObj.setAttribute("style",'visibility:hidden');
        document.body.appendChild(inputObj);
        inputObj.click();
        inputObj.value ;
   },
    setUpload() {
            //确认上传
        debugger
        var _this = this;
            //如果没有选择文件则不允许点击,并给出提示选择文件后点击上传按钮
        if(_this.fileList==''){
            this.$notify.info({
                title: '消息',
                message: '请先选择 [浏览文件] 后在点击上传!'
            });
          }else{
            //创建formData对象
            var param = new FormData();
            //将文件append到formData对象
            param.append("file", _this.fileList[0].raw);
              $.ajax({
                //填写导入接口
                url: '/file/fileUpload',
                processData: false, // 默认不处理数据
                contentType: false, // 默认不设置内容类型
                type: "post",
                data: param,
                success: function (res) {
                      console.log(res.msg)
                      if(res.msg=='上传成功!'){
                          _this.succeed();
                        }
                    }
                })
            }
          },
            //上传成功后关闭弹窗并调用查询方法刷新页面数据
          guanbi(){
            this.dialogVisible = false;
        	},

        // },
    getScale() {
      const w = window.innerWidth / this.style.width;
      const h = window.innerHeight / this.style.height;
      return {x:w,y:h};
    },
    setScale() {
      let scale = this.getScale();
      this.style.transform = "scaleY(" + scale.y + ") scaleX(" + scale.x + ") translate(-50%, -50%)";
    },


    // 创建场景
    createScene() {
      window.THREE = THREE
      this.scene = new THREE.Scene()
      Window.Scene = this.scene
      // this.scene.background = new THREE.Color( 0x000000 );
    },
    // 加载GLTF模型
    loadGLTF() {
      const THIS = this
      const loader = new GLTFLoader()
      this.model = {}
      this.box = {}

      loader.load(`${THIS.publicPath}modelTest3.glb`, model => {
        model.scene.scale.set(5, 5, 5)
        this.scene.add(model.scene)
        console.log(this.scene)
        this.mixer = new THREE.AnimationMixer(model.scene)
        // const clip = model.animations[0]
        // var action = this.mixer.clipAction(model)
        // this.action.paused = true;
        this.mixer.timeScale = 0.5
        // action.setDuration(2).play()
        // action.play()
        for (var i=0;i<model.animations.length;i++){
          this.mixer.clipAction(model.animations[i]).play();
        }
        // document.querySelector('.large-left').innerHTML = 'sssssssssssss'
        // console.log(this.scene)
        this.model.geometry = this.scene.children[3].children[0].geometry;
        this.percentageBool = false;

        // console.log(this.scene.children[0].geometry)
        this.vehicleGroup = new THREE.Group();
        this.selVehicleGroup = new THREE.Group();

        this.model.geometry.computeBoundingBox();
        const box3 = new THREE.Box3().copy(this.model.geometry.boundingBox);
        // console.log(box3)
        const boxSize = box3.getSize(new THREE.Vector3());
        const boxCenter = box3.getCenter(new THREE.Vector3());
        const boxGeometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z);

        boxGeometry.translate(boxCenter.x, boxCenter.y, boxCenter.z);
        const boxMaterial = new THREE.MeshBasicMaterial();
        this.box = new THREE.Mesh(boxGeometry, boxMaterial);
        // console.log(this.box)
      },
        function(xhr){
        THIS.percentage = xhr.loaded / xhr.total * 100;
        // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        // console.log(xhr.total)
      },
        function(err){
          console.error( 'An error happened' );
        }
      )
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
      const modelwidth = element.clientWidth // 窗口宽度
      const modelheight = element.clientHeight // 窗口高度
      const k = modelwidth / modelheight // 窗口宽高比
      // PerspectiveCamera( fov, aspect, near, far )
      this.camera = new THREE.PerspectiveCamera(45, k, 0.1, 2000)
      this.camera.position.set(150, 150, 150) // 设置相机位置

      this.camera.lookAt(new THREE.Vector3(20, 40, 0)) // 设置相机方向
      this.scene.add(this.camera)
    },
    // 创建渲染器
    createRender() {
      const element = document.getElementById('container')
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setClearAlpha(0.2);
      this.renderer.setSize(element.clientWidth, element.clientHeight) // 设置渲染区域尺寸
      this.renderer.shadowMap.enabled = true // 显示阴影
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      // this.renderer.setClearColor(0xffffff, 1) // 设置背景颜色
      element.appendChild(this.renderer.domElement)
    },

    // initStats() {
    //           this.stats = new this.ThreeStats.Stats();
    //           //这里说一下所有这种放到dom的对象都可以进行样式操作
    //           document.body.appendChild(this.stats.dom)
    //       },

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
    var intersects = raycaster.intersectObjects(this.scene.children, true);
  

    //返回选中的对象
    // console.log(intersects)
    return intersects;
  },

  // showObject (obj,event) {
  //   // console.log(obj.name)
  //   // console.log("event.clientX:" + event.clientX)
  //   this.dragTop = event.clientY - 50
  //   this.dragLeft = event.clientX - 50
  //   this.imfor.name = obj.name
  //   this.imfor.uuid = obj.uuid
  //   this.imfor.x = event.clientX
  //   this.imfor.y = event.clientY
  //   },

  onMouseDblclick(event) {
      // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
      let intersects = this.getIntersects(event);
      if (intersects.length != 0 && intersects[0].object instanceof THREE.Mesh) {
        const selectedObject = intersects[0].object;

        if(this.highlightedObject){
          this.highlightedObject.material.emissive.setHex(0x000000);
          this.innerVisible = false
        }
        if(selectedObject.userData.modelnum === 'model1'){
            this.innerVisible = true
          }
        // this.showObject (selectObject,event)
        selectedObject.material.emissive.setHex(0xD6CCCC);
        this.highlightedObject = selectedObject;
      }
      else{
        this.innerVisible = false
        if (this.highlightedObject){
          this.highlightedObject.material.emissive.setHex(0x000000);
          this.highlightedObject = null;
        }
      }
    },

    // changeMaterial(object) {
    //   let material = new THREE.MeshLambertMaterial({
    //     color: 0xfff5f2,
    //     transparent: object.material.transparent ? false : true,
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
      // this.stats.update()
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
  overflow: hidden;
  background-image: url("../../assets/pageBg.png");
  background-size: cover;
  background-position: center center;
}
.diolag{
  position: absolute;
}
#screen{
    z-index: 100;
    transform-origin: 0 0;
    position: fixed;
    left: 50%;
    top: 50%;
    transition: 0.3s;
}
.topLeft{
  width: 500px;
  height: 50px;
  position: absolute;
  top: 10px;
}
.topCenter{
  width:200px;
  height: 50px;
  position: absolute;
  /* top: 10px; */
}
.topTitle{
  position: relative;
  width: 300px;
  height: 10px;
  top: 80px;
  left:800px;
  text-align: center;
  background-size: cover;
  background-repeat: no-repeat;
}
.title-text {
  font-size: 24px;
  position: absolute;
  left: 70px;
  top: -40px;
  color:#fff
  /* transform: translate(-50%); */
}
.dv-dec-6{
  width: 300px;
  height: 5px;
  text-align: center;
  position: absolute;
}
.dv-dec-10{
  /* width: 50px; */
  width: 700px;
  height: 5px;
  top:25px;
  position: absolute;
}
.dv-dec-8{
  height: 5px;
  top:50px;
  left:600px;
  position: absolute;
  color: decorationColor
}
.dv-dec-10-s{
  /* transform: rotateY(180deg); */
  height: 5px;
  top:25px;
  position: absolute;
  left: 1400px;
}
.dv-dec-8-s{
  transform: rotateY(180deg);
  top:50px;
  height: 5px;
  position: absolute;
  left: 1100px;
}
.large-left {
  position: absolute;
  width: 50%;
  height: calc(100% - 80px);
}

.modelMask {
    position: absolute;
    left: 0;
    top: 0;
    padding: 16px 16px 0 16px;
    width: 100%;
    height: 100%;
    background: url('../../assets/pageBg.png') no-repeat center center;
    background-size: 100% 100%;
    z-index: 9;
    display: flex
  }

  .modelMask .marg {
      width: 300px;
      height: 60px;
      margin: auto;
      text-align: center;
  }


.moveText {
  position: absolute;
  padding: 20px;
  background: rgba(30, 111, 155, 0.8);

}

.modelMask .elPro {
        width: 100%;
        margin-top: 10px;
      }
.modelMask p{
  color: #e2e2e2;
  font-size: 13px;
}

.p{
    font-size: 20px;
    text-align: left;
    color: #fff;
  }

  .b-one{
    height: 30px;
    width: 60px;
    position: absolute;
    background-color:transparent;
    border-style:none;
    left: 1850px;
    background-image: url('../../assets/close.png');
    background-size: 30px;
    background-repeat: no-repeat;
    background-position: 28px, 6px;
  }
  .b-two{
    height: 30px;
    width: 60px;
    position: absolute;
    left: 750px;
    top: 200px;
  }
  .btn{
    margin-top: 60px;
  }
  
/* .stats {
width: 100%;
height: 50px;
position: relative;
} */
</style>