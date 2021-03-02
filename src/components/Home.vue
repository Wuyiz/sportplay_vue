<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img alt class="logo_img" src="../assets/logo.jpg"/>
                <span>运动管理平台</span>
            </div>
            <el-button @click="logout" type="info">安全退出</el-button>
        </el-header>
        <!--主体-->
        <el-container>
            <!--侧边栏-->
            <el-aside :width="isCollapse?'64px':'200px'">
                <div @click="toggleCollapase" class="toggle-button">|||</div>
                <el-menu :collapse="isCollapse" :collapse-transition="false" active-text-color="#409eff"
                         :default-active="activePath" :router="true" background-color="#333744" text-color="#fff"
                         unique-opened>
                    <!--一级菜单-->
                    <el-submenu :index="items.path" :key="items.id" v-for="items in menuList">
                        <template slot="title">
                            <i :class="items.icon"></i>
                            <span>{{items.title}}</span>
                        </template>
                        <!--二级菜单-->
                        <el-menu-item :index="item.path" :key="item.id" @click="saveNavState(item.path)"
                                      v-for="item in items.subMenuVOS">
                            <template slot="title">
                                <i :class="item.subIcon"></i>
                                <span>{{item.title}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                menuList: [],
                isCollapse: false,
                activePath: '/welcome',
            }
        },
        //onload事件，页面加载完成之前执行
        created() {
            //查找菜单栏列表信息
            this.getMenuList();
            //页面刷新后，取出本地session中存储的导航路径信息
            this.activePath = window.sessionStorage.getItem("activePath");
        },
        methods: {
            logout() {
                //清除本地存储的用户session
                window.sessionStorage.clear();
                this.$router.push("/login");
            },
            async getMenuList() {
                const {data: res} = await this.$http.get("menu/get");
                console.log(res.data);
                if (res.code !== 200) return this.$message.error("列表获取失败！！！");
                this.menuList = res.data;
            },
            //切换侧边栏伸缩
            toggleCollapase() {
                this.isCollapse = !this.isCollapse;
            },
            //保存当前点击的导航路径信息
            saveNavState(activePath) {
                //保存路径信息到本地session中，保证页面刷新后还可以自动定位
                window.sessionStorage.setItem("activePath", activePath);
                this.activePath = activePath;
            },
        }
    }
</script>

<style lang="less" scoped>
    //布局充满
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between; // 左右贴边
        padding-left: 0%; // 左边界
        align-items: center; // 水平
        color: #fff;
        font-size: 20px;

        > div { //左侧div加布局
            display: flex;
            align-items: center;

            span {
                margin-left: 15px;
            }
        }
    }

    .el-aside {
        background-color: #333744;

        .el-menu {
            border-right: none; //消除菜单栏右边框不齐
        }
    }

    .el-main {
        background-color: #eaedf1;
    }

    .logo_img {
        width: 55px;
        height: 55px;
    }

    .toggle-button {
        background-color: #4A5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer; // 显示鼠标指针为：小手
    }
</style>