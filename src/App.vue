<template>
  <div id="app">
    <!-- <div id="screen" :style="{'width':`${style.width}px`,'height':`${style.height}px`,'transform':`${style.transform}`}"> -->
      <router-view/>
    </div>
  <!-- </div> -->
</template>

<script>
export default {
  data() {
      return {
        // style: {
        //   width: "1920",
        //   height: "1080",
        //   transform: "scaleY(1) scaleX(1) translate(-50%, -50%)"
        // }
      };
  },
  mounted() {
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
  },
}
</script>

<style>
  @import "./assets/css/main.css";
  @import "./assets/css/color-dark.css";
  /* #screen{
    z-index: 100;
    transform-origin: 0 0;
    position: fixed;
    left: 50%;
    top: 50%;
    transition: 0.3s;
}   */
</style>

