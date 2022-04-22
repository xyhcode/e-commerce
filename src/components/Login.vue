<template>
  <div class="login_co">
    <div class="content">
      <div class="content_input">
        <div class="title">
          <p>管理员登录</p>
        </div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForms">
          <el-form-item prop="username">
            <el-input type="text" clearable v-model="ruleForm.username" autocomplete="off" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item  prop="password">
            <el-input type="password" clearable show-password v-model="ruleForm.password"  autocomplete="off" placeholder="密码"></el-input>
          </el-form-item>
          <div class="content_button">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button @click="replace">重置</el-button>
            </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import '@/assets/css/style.css'
import '@/assets/js/ribbon.js'
export default {
  name: "Login",
  data(){
    return{
      ruleForm: {
        username: '',
        password:'',
      },
      rules: {
        //用户名验证
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        //密码
        password:[
          {required: true, message: '请输入密码', trigger: 'blur'},
        ]
      }
    }
  },
  methods:{
    //登入
    login(){
      //验证是否满足规则 true：满足  false:不满足 ruleForm是上面定义的：model
      this.$refs.ruleForms.validate(async (valid) => {
        if(valid!==true){
          this.$message({
            showClose: true,
            message: '请检查账号密码！',
            type: 'warning'
          });
          return;
        }else{
          //axios请求
          let ret=await this.$http.post('login',this.ruleForm);
          //console.log(ret);
          //登入成功
          if(ret.meta.status===200){
            this.$message({
              showClose: true,
              message: '登入成功！',
              type: 'success'
            });
            //保存token sessionStorage
            sessionStorage.setItem('token',ret.data.token);
            await this.$router.push('/home');
          }else{
            //登入失败
            this.$message({
              showClose: true,
              message: '登入失败,请检查账号密码！',
              type: 'error'
            });
            throw new Error(ret.meta.msg);
          }
        }
      })
    },
    //重置
    replace(){
      this.$refs.ruleForm.resetFields();
    }
  }
}
</script>


<style lang="less" scoped>
.login_co{
  //background-color:#2b4b6b;
  height:100%;
}
.el-button--primary {
  width: 45%;
}
.el-button--default{
  width: 45%;
  float:right;
}
</style>
