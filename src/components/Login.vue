<template>
	<div class="login-wrap">
	  <el-form class="login-container">
		<h1 class="title">船舶动力系统数字化综合运维平台</h1>
		<el-form-item label="账号">
		  <el-input type="text" v-model="username" placeholder="登录账号">
			<!-- <el-button slot="prepend" icon="el-icon-lx-people"></el-button> -->
		  </el-input>
		</el-form-item>
		<el-form-item label="登录密码">
		  <el-input type="password" v-model="password" placeholder="登录密码"></el-input>
		</el-form-item>
   
		<el-form-item>
		  <el-button type="primary" style="width: 100%;" @click="tiaoZhuan" @keyup.enter="keyDown">登录</el-button>
		</el-form-item>
	  </el-form>
	</div>
  </template>
   
  <script>
	export default {
	  data: function() {
		return {
		  username: "",
		  password: "",
		}
	  },
	//   watch:{
	// 	username(t){
	// 		this.$emit('usernameShow', t)
	// 	}
	// },
    methods: {
    // 	tiaoZhuan(){
	// 		if (this.username === "admin" && this.password === "123"){
	// 			this.$router.push('/Dashboard')
	// 			this.$message({
    //     		showClose: true,
    //     		message: 'Welcome',
    //     		type: 'success'
    //   			});
	// 		}
	// 		else{
	// 			alert("用户名密码错误！")
	// 		}
    // 	},
	// 	keyDown(e){
	// 		if(e.keyCode == 13){
	// 			this.tiaoZhuan();
	// 		}
	// 	}
	// },

	tiaoZhuan(){
		this.$axios({
          url: "/api/auth/user/login",
          method: "post",
          data: {
            username: this.username,
            password: this.password,
          },
        })
          .then((res) => {
			console.log(res.data)
         if(res.data.code=="200"){
				sessionStorage.setItem("token",res.data.data.access_token)
				sessionStorage.setItem('username', this.username)
				// this.$router.push('/Dashboard')
				this.$router.push('/Dashboard')
 			}
			else{
				alert("账号密码错误！")
			}
          })
          .catch((err) => {
            console.log(err);
          });
	},

	keyDown(e){
			if(e.keyCode == 13){
				this.tiaoZhuan();
			}
		}
	},

	mounted() {
		window.addEventListener("keydown", this.keyDown);
	},
	destroyed(){	
		window.removeEventListener("keydown", this.keyDown, false);

	}
}
  </script>
   
  <style scoped>

	.login-wrap {
	  /* box-sizing: border-box; */
	  position: relative;
	  width: 100%;
	  height: 100%;
	  background-image: url(../assets/chuan.jpg);

	  background-repeat: no-repeat;
	  background-position: center right;
	  background-size: 100%;
	}
   
	.login-container {
	  position: absolute;
	  left: 38%;
	  top: 25%;
	  border-radius: 10px;
	  margin: 0px auto;
	  width: 380px;
	  padding: 30px 35px 15px 35px;
	  background: #fff;
	  border: 1px solid #eaeaea;
	  text-align: left;
	  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
	}
   
	.title {
	  margin: 0px auto 40px auto;
	  text-align: center;
	  color: #505458;
	}
  </style>