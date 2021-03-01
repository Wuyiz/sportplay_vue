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
            <el-aside width="200px">
                <el-menu active-text-color="#409eff" background-color="#333744" text-color="#fff">
                    <!--一级菜单-->
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>导航一</span>
                        </template>
                        <!--二级菜单-->
                        <el-menu-item index="1-1">
                            <template slot="title">
                                <span>选项一</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                menuList: [],
            }
        },
        //onload事件，页面加载完成之前执行
        created() {
            //查找菜单栏列表信息
            this.getMenuList();
        },
        methods: {
            logout() {
                //清除本地存储的用户session
                window.sessionStorage.clear();
                this.$router.push("/login");
            },
            getMenuList() {
                console.log("getMenuList");
            }
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
    }

    .el-main {
        background-color: #eaedf1;
    }

    .logo_img {
        width: 55px;
        height: 55px;
    }
</style>