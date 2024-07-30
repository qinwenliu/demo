<template>
    <div class="map" id="mapId">
    </div>
    
</template>

<script>
export default {
	  data: function() {
		return {
      style: {
        width: "1920",
        height: "1080",
        transform: "scaleY(1) scaleX(1) translate(-50%, -50%)"
      }
		}
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

	mounted() {
      let that = this;
      that.setScale();
      /*窗口改变事件*/
      $(window).resize(()=> {
        that.setScale();
      });
	},
}
</script>
<style scoped>
  .map{
      position: relative;
      width: 100%;
      height: 100%;
      background-color: white;
      background-image: url(../assets/systemifo.png);
      /* top:200px; */
      background-repeat: no-repeat;
      /* background-position: c; */
      background-size: 100%;
  }
</style>


