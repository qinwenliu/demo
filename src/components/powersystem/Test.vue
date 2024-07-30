<template>
  <div id="screen" :style="{'width':`${style.width}px`,'height':`${style.height}px`,'transform':`${style.transform}`}">
    <div id="container">
    </div>
    <div class="model1">
        <CombustionEngine></CombustionEngine>
        <p> adasdasdasdasdasdasd </p>
      </div>
  </div>
</template>

<script>
import CombustionEngine from '../powersystem/CombustionEngine.vue'

export default {
  data() {
    return {
      style: {
        width: "1920",
        height: "1080",
        transform: "scaleY(1) scaleX(1) translate(-50%, -50%)"
      },

    }
  },
  components: {
    CombustionEngine
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
    getScale() {
      const w = window.innerWidth / this.style.width;
      const h = window.innerHeight / this.style.height;
      return {x:w,y:h};
    },
    setScale() {
      let scale = this.getScale();
      this.style.transform = "scaleY(" + scale.y + ") scaleX(" + scale.x + ") translate(-50%, -50%)";
    },
  }
    
}
</script>
<style scoped>

#container {
  /* position: absolute; */
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url("../../assets/pageBg.png");
  background-size: cover;
  background-position: center center;
}

#screen{
    z-index: 100;
    transform-origin: 0 0;
    position: fixed;
    left: 50%;
    top: 50%;
    transition: 0.3s;
}
.model1{
  position: absolute;
  width:30%;
  height: 30%;
}

</style>