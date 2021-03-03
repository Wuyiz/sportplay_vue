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
                    <el-button @click="showAddDialog" type="primary">添加用户
                    </el-button>
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
                        <el-button @click="showEditDialog(scope.row)" icon="el-icon-edit" size="mini"
                                   type="primary"></el-button>
                        <!-- 删除 -->
                        <el-button @click="deleteUser(scope.row.id,scope.row.username)" icon="el-icon-delete"
                                   size="mini"
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
        <el-dialog :title="dialogInfo.action?'添加用户':'编辑用户'" :visible.sync="dialogInfo.dialogFormVisible" width="50%">
            <el-form :model="dialogForm" :rules="dialogFormRole" label-width="70px" ref="dialogFormRef">
                <el-form-item label="用户名" prop="username">
                    <el-input autocomplete="off" v-model="dialogForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input autocomplete="off" v-model="dialogForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input autocomplete="off" v-model="dialogForm.email"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogInfo.dialogFormVisible = false">取 消</el-button>
                <template v-if="dialogInfo.action">
                    <el-button :disabled="dialogInfo.isDisabled" @click="addUser" type="primary">确 定</el-button>
                </template>
                <template v-else>
                    <el-button :disabled="dialogInfo.isDisabled" @click="editUser" type="primary">确 定</el-button>
                </template>
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
                //查询信息实体
                queryInfo: {
                    query: "",   //查询内容
                    pageNum: 1,  //当前页
                    pageSize: 6  //页面显示数据数量
                },

                //分页后数据实体
                pageInfo: [],

                //dialog对话框状态信息
                dialogInfo: {
                    action: true,        //当前请求动作 true:add, false:edit
                    isDisabled: false,      //btn提交时禁用
                    dialogFormVisible: false,    //dialog对话框状态
                },
                //dialog用户表单信息
                dialogForm: {
                    id: "",
                    username: "",
                    password: "",
                    email: "",
                    role: "",
                    state: ""
                },

                //验证规则
                dialogFormRole: {
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
            //更新用户状态
            async updateState(userInfo) {
                const {data: res} = await this.$http.put(`user/state?id=${userInfo.id}&state=${userInfo.state}`);
                if (res.code !== 200) {
                    //userInfo.id = !userInfo.id;
                    return this.$message.error("修改失败！！！");
                }
                this.$message.success("修改成功！！！")
            },
            showAddDialog() {
                this.dialogInfo.action = true;
                this.dialogInfo.dialogFormVisible = true;
                this.dialogForm = {};
            },
            //添加新用户
            addUser() {
                this.dialogInfo.isDisabled = true;      //提交时禁用按钮，放置重复提交
                this.$refs.dialogFormRef.validate(async valid => {
                    if (!valid) return;     //校验输入框数据，校验失败则禁止提交
                    const {data: res} = await this.$http.post("user/save", this.dialogForm);
                    if (res.code !== 200) {
                        return this.$message.error("添加新用户失败！！！");
                    }
                    this.$message.success("添加新用户成功！！！")
                    this.dialogInfo.dialogFormVisible = false;
                    this.$refs.dialogFormRef.resetFields();    //清空dialog表单残留内容
                    this.getUserList();     //刷新列表
                });
                this.dialogInfo.isDisabled = false;
            },
            async deleteUser(id, username) {
                const confirmResult = await this.$confirm('此操作将永久删除 ' + username + ' 用户，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    showConfirmButton: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') return this.$message.info("已取消");
                const {data: res} = await this.$http.delete(`user/delete/${id}`);
                if (res.code !== 200) return this.$message.error("删除失败！！！");
                this.getUserList();
            },
            //切换编辑的dialog对话框
            showEditDialog(user) {
                this.dialogInfo.action = false;     //设置操作动作为edit，主要用于显示title
                this.dialogInfo.dialogFormVisible = true;   //设置对话框是否显示
                this.dialogForm = user;     //回写要编辑的用户信息到对话框中
            },
            editUser() {
                this.dialogInfo.isDisabled = true;      //提交时禁用按钮，放置重复提交
                this.$refs.dialogFormRef.validate(async valid => {
                    if (!valid) return;     //校验输入框数据，校验失败则禁止提交
                    const {data: res} = await this.$http.put("user/edit", this.dialogForm);
                    if (res.code !== 200) {
                        return this.$message.error("编辑失败！！！");
                    }
                    this.$message.success("编辑成功！！！")
                    this.dialogInfo.dialogFormVisible = false;
                    this.$refs.dialogFormRef.resetFields();    //清空dialog表单残留内容
                    this.getUserList();     //刷新列表
                });
                this.dialogInfo.isDisabled = false;
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