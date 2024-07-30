<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="defaultActive"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index" >
                        <template slot="title">
                            <div @click="handleSelectMenu(item.index)">
                                <i :class="item.icon"></i>
                                <span slot="title">{{ item.title }}</span>
                            </div>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                                @click.native.stop="handleSelectMenu(index)"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                                @click.native.stop="handleSelectMenu(index)"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-pie-chart',
                    index: 'dashboard',
                    title: '系统首页'
                },

                {
                    icon: 'el-icon-pie-chart',
                    index: 'Er',
                    title: '数据库信息',
                    subs: [
                        {
                            index: 'PowersystemFault',
                            title: '动力系统故障表'
                        },
                        {
                            index: 'PowersystemModule',
                            title: '船舶动力系统模块'
                        },
                        {
                            index: 'PowersystemParameter',
                            title: '动力系统参数表'
                        }
                    ]
                },
                {
                    icon: 'el-icon-pie-chart',
                    index: 'PowerSystem',
                    title: '动力系统',
                    subs: [
                        {
                            index: 'LC8250',
                            title: 'LC8250样机动力系统'
                        },
                        {
                            index: 'Hybrid',
                            title: '混合动力系统样机'
                        },
                        {
                            index: 'FuelCell',
                            title: '氢燃料电池动力系统样机'
                        },
                        {
                            index: 'Elec',
                            title: '纯电动动力系统样机'
                        },
                        // {
                        //     index: 'CombustionEngine',
                        //     title: '试验1'
                        // }
                    ]
                },
                {
                    icon: 'el-icon-pie-chart',
                    index: 'SystemInfo',
                    title: '系统信息'
                },
            ]
        };
    },
    methods: {
        handleSelectMenu(path) {
        this.$router.push(path)
        console.log(path);
      },
    },
    computed: {
        defaultActive() {
        return this.$route.path
      }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
