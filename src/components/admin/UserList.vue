<template>
    <div>
        用户列表
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <el-row :gutter="25">
                <el-col :span="10">
                    <!-- 搜索添加 -->
                    <el-input placeholder="请输入搜索内容">
                        <el-button @click="getUserList" icon="el-icon-search" slot="append"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表  border 边框 stripe 隔行变色 -->
            <el-table :data="pageInfo.list" border stripe>
                <el-table-column type="index"></el-table-column><!--索引列-->
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="密码" prop="password"></el-table-column>
                <el-table-column label="角色" prop="role"></el-table-column>
                <el-table-column label="状态" prop="state">
                    <!--作用域插槽 scope.row 存储了当前行的信息 -->
                    <template slot-scope="scope"><!--数据模板-->
                        <el-switch v-model="scope.row.state"></el-switch>
                    </template>
                </el-table-column>
                <!--自定义插槽-->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button @click="showEditDialog(scope.row.id)" icon="el-icon-edit" size="mini"
                                   type="primary"></el-button>
                        <!-- 删除 -->
                        <el-button @click="deleteUser(scope.row.id)" icon="el-icon-delete" size="mini"
                                   type="danger"></el-button>
                        <!-- 权限 -->
                        <el-tooltip :enterable="false" content="分配权限" effect="dark" placement="top-start">
                            <!--文字提示 enterable 隐藏-->
                            <el-button icon="el-icon-setting" size="mini" type="warning"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "UserList",
        data() {
            return {
                //查询信息实体
                queryInfo: {
                    query: "",   //查询内容
                    pageNum: 1,  //当前页
                    pageSize: 10  //页面显示数据数量
                },
                //分页后数据实体
                pageInfo: [],
            }
        },
        created() {
            this.getUserList();
        },
        methods: {
            //获取所有用户列表
            async getUserList() {
                const {data: res} = await this.$http.get("user/list", {params: this.queryInfo});
                this.pageInfo = res.data;
            }
        },
    }
</script>

<style lang="less" scoped>
    /* 面包屑样式 */
    .el-breadcrumb {
        margin-bottom: 15px;
        font-size: 12px;
    }
</style>