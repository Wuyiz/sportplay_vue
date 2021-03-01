<template>
    <div class="login_container">
        <!--登录块-->
        <div class="login_box">
            <div class="avatar_box">
                <img alt="头像" src="../assets/logo.png">
            </div>
            <!--表单区域-->
            <el-form :model="loginForm" :rules="loginRules" class="login_form" label-width="0" ref="loginFormRef">
                <!--用户名-->
                <el-form-item prop="username">
                    <el-input placeholder="请输入用户名" prefix-icon="iconfont icondenglu"
                              v-model="loginForm.username"></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" prefix-icon="iconfont iconmima" type="password"
                              v-model="loginForm.password"></el-input>
                </el-form-item>
                <!--按钮-->
                <el-form-item class="btns">
                    <el-button @click="login" type="primary">登录</el-button>
                    <el-button @click="resetLoginForm" type="info">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                //表单数据
                loginForm: {
                    username: "admin",
                    password: "123456"
                },
                //校验规则
                loginRules: {
                    username: [
                        {required: true, message: '用户名为必填项', trigger: 'blur'},
                        {min: 5, max: 12, message: '长度在 5 ~ 12 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '用户名密码为必填项', trigger: 'blur'},
                        {min: 6, max: 10, message: '长度在 6 ~ 10 个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            //登录
            login() {
                //1.验证校验规则
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.post("user/login", this.loginForm);
                    console.log(res)
                    if (res.code === 1) {
                        this.$message.success("登录成功！跳转到主页中...");
                        //存储user对象到本地存储器
                        window.sessionStorage.setItem("user", res.data);
                        await this.$router.push({path: '/home'});
                    } else {
                        this.$message.error("登录失败！" + res.msg)
                    }
                });
            },
            //重置表单内容
            resetLoginForm() {
                this.$refs.loginFormRef.resetFields();
            }
        }
    }
</script>

<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .avatar_box {
            width: 130px;
            height: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 5px;
            box-shadow: 0 0 5px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #0ee;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }

    .login_form {
        position: absolute;
        bottom: 0%;
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
    }
</style>
