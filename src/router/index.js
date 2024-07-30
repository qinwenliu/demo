import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login";
import Home from "@/components/common/Home";
import PowersystemParameter from '../components/table/PowersystemParameter';
import EngineMotor from '../components/EngineMotor';
import CombustionEngine from '../components/powersystem/CombustionEngine'
import PureElectric from '../components/powersystem/PureElectric'
import LC8250 from '../components/powersystem/LC8250'
import Dashboard from '../components/Dashboard'
import PowersystemFault from '../components/table/PowersystemFault';
import PowersystemModule from '../components/table/PowersystemModule';
import SystemInfo from '../components/SystemInfo';
import Elec from '../components/powersystem/Elec';
import Hybrid from '../components/powersystem/Hybrid';
import FuelCell from '../components/powersystem/FuelCell';
import PowerSystem from '../components/powersystem/PowerSystem';
import Er from '../components/table/Er';



Vue.use(VueRouter)

const routes = [
    {
		path: "/",
		redirect: "/Login"
	  },
    {
        path: '/Login',
        name: 'Login',
        component: Login
    },

    {
      path: '/CombustionEngine',
      name: 'CombustionEngine',
      component: CombustionEngine,
    },

    {
      path: '/LC8250',
      name: 'LC8250',
      component: LC8250
    },
    {
        path: '/Home',
        name: 'Home',
        component: Home,
        children:[
          {
            path: '/Dashboard',
            name: 'Dashboard',
            component: Dashboard
        },
        {
          path: '/SystemInfo',
          name: 'SystemInfo',
          component: SystemInfo
        },
          // {
          //   path: '/CombustionEngine',
          //   name: 'CombustionEngine',
          //   component: CombustionEngine
          // },
          // {
          //   path: '/FuelCell',
          //   name: 'FuelCell',
          //   component: FuelCell
          // },
          {
            path: '/PureElectric',
            name: 'PureElectric',
            component: PureElectric
          },
          {
            path: '/Elec',
            name: 'Elec',
            component: Elec
          },
          {
            path: '/Hybrid',
            name: 'Hybrid',
            component: Hybrid
          },
          {
            path: '/FuelCell',
            name: 'FuelCell',
            component: FuelCell
          },
          {
            path: '/PowerSystem',
            name: 'PowerSystem',
            component: PowerSystem
          },
          {
            path: '/PowersystemFault',
            name: 'PowersystemFault',
            component: PowersystemFault
          },
          {
            path: '/PowersystemModule',
            name: 'PowersystemModule',
            component: PowersystemModule
          },
          {
            path: '/PowersystemParameter',
            name: 'PowersystemParameter',
            component: PowersystemParameter
          },
          {
            path: '/Er',
            name: 'Er',
            component: Er
          },
        ]
    },

  {
    path: '/EngineMotor',
    name: 'EngineMotor',
    component: EngineMotor
  }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})


// router.beforeEach((to, from, next) => {
//   let token = '000';

//   if (to.path != '/Login' && token == '000' ){
//     next()
//   } 
//   else {
//     if (to.path != '/Login' && token != '000') {
//       console.log(to)
//       next('/Login')
//     } else {  
//       if(to.path == '/Login' && token == '000')
//       {
//         console.log(to)
//         // next('/home')
//         next()
//       }
//     }
//   }
// })


router.beforeEach((to, from, next) => {
  let token = window.sessionStorage.getItem('token');
  if (to.path != '/Login' && !token) {
    next({
      path: '/Login'
    })
  } 
  else {
    if (to.path == '/Login' && token) {
      next('/Home')
    } else {     
      next()
    }
  }
})


export default router

