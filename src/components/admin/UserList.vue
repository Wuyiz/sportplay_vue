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
            <el-row :gutter="30" class="box-row">
                <el-col :span="10">
                    <!-- 搜索添加 -->
                    <el-input @clear="getUserList" clearable placeholder="请输入搜索内容" v-model="queryInfo.query">
                        <el-button @click="getUserList" icon="el-icon-search" slot="append"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button @click="dialogAddUserFormVisible = true" type="primary">添加用户</el-button>
                </el-col>
                <el-col :span="10">
                    <!--分页组件-->
                    <div class="block">
                        <el-pagination
                                :current-page="pageInfo.pageNum"
                                :page-size="queryInfo.pageSize"
                                :page-sizes="[3, 6, 10, 20, 50, 100]"
                                :total="pageInfo.total"
                                @current-change="handleCurrentChange"
                                @size-change="handleSizeChange"
                                layout="total, sizes, prev, pager, next, jumper">
                        </el-pagination>
                    </div>
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
                        <el-switch @change="updateState(scope.row)" v-model="scope.row.state"></el-switch>
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
        <!--dialog对话框-->
        <el-dialog :visible.sync="dialogAddUserFormVisible" title="添加用户" width="50%">
            <el-form :model="addForm" :rules="addFormRole" label-width="70px" ref="addFormRef">
                <el-form-item label="用户名" prop="username">
                    <el-input autocomplete="off" v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input autocomplete="off" v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input autocomplete="off" v-model="addForm.email"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogAddUserFormVisible = false">取 消</el-button>
                <el-button :disabled="isDisabled" @click="addUser" type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "UserList",
        data() {
            let checkEmail = (rule, value, callback) => {
                const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
                if (!value) {
                    return callback(new Error('邮箱不能为空'))
                }
                setTimeout(() => {
                    if (mailReg.test(value)) {
                        callback()
                    } else {
                        callback(new Error('请输入正确的邮箱格式'))
                    }
                }, 100)
            };
            return {
                isDisabled: false,

                //查询信息实体
                queryInfo: {
                    query: "",   //查询内容
                    pageNum: 1,  //当前页
                    pageSize: 6  //页面显示数据数量
                },

                //分页后数据实体
                pageInfo: [],

                dialogAddUserFormVisible: false,    //dialog对话框状态
                //用户表单信息
                addForm: {
                    username: "",
                    password: "",
                    email: ""
                },

                //验证规则
                addFormRole: {
                    username: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
                        {min: 5, max: 12, message: '长度在 5 ~ 12 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入用户密码', trigger: 'blur'},
                        {min: 6, max: 10, message: '长度在 6 ~ 10 个字符', trigger: 'blur'}
                    ],
                    email: [
                        {validator: checkEmail, trigger: 'blur'}
                    ]
                },
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
            },
            //监听：当前页显示数量变化后查询数据
            handleSizeChange(newSize) {
                this.queryInfo.pageSize = newSize;
                this.getUserList();
            },
            //监听：当前页面是否更改
            handleCurrentChange(newPage) {
                this.queryInfo.pageNum = newPage;
                this.getUserList();
            },
            async updateState(userInfo) {
                const {data: res} = await this.$http.put(`user/state?id=${userInfo.id}&state=${userInfo.state}`);
                if (res.code !== 200) {
                    //userInfo.id = !userInfo.id;
                    return this.$message.error("修改失败！！！");
                }
                this.$message.success("修改成功！！！")
            },
            addUser() {
                this.isDisabled = true;
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.post("user/save", this.addForm);
                    if (res.code !== 200) {
                        return this.$message.error("添加新用户失败！！！");
                    }
                    this.$message.success("添加新用户成功！！！")
                    this.dialogAddUserFormVisible = false;
                    this.$refs.addFormRef.resetFields();    //清空dialog表单残留内容
                    this.getUserList();
                });
                this.isDisabled = false;
            },
        },
    }
</script>

<style lang="less" scoped>
    //面包屑样式
    .el-breadcrumb {
        margin-bottom: 15px;
        font-size: 12px;
    }

    //el-row元素调整
    .box-row {
        padding-bottom: 30px;
    }
</style>