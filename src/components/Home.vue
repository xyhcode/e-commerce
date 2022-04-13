<template>
    <el-container class="hompa">
      <el-aside width="200px" style="overflow:hidden">
        <div @click="gohome" style="height: 60px" class="tb">
          <img src="../assets/logo.png" width="50px" height="100%"/>
          <span>后台管理系统</span>
        </div>
        <el-menu unique-opened router
                 default-active="2"
                 class="el-menu-vertical-demo"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b">
          <el-submenu :index="me.id+''" v-for="me in menulist" :key="me.id">
            <template slot="title">
              <i :class="icons[me.id]"></i>
              <span>{{me.authName}}</span>
            </template>
            <el-menu-item-group v-for="it2 in me.children" :key="it2.id">
              <el-menu-item :index="'/'+it2.path">  <i class="el-icon-menu"></i>{{it2.authName}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
          <!--头部-->
          <el-header>
            <div class="d1">
              <el-menu class="el-menu-demo" mode="horizontal" >
                <el-submenu index="2">
                  <template slot="title">羡羡</template>
                  <el-menu-item index="2-1">个人中心</el-menu-item>
                  <el-menu-item index="2-2" @click="logout">退出</el-menu-item>
                </el-submenu>
              </el-menu>
              <el-avatar :size="50" :src="circleUrl"></el-avatar>
            </div>
          </el-header>
        <el-main>

          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

</template>

<script>
export default {
  name: "Home",
  data(){
    return{
      menulist:[],
      icons:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-3702mima',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      circleUrl:"https://sls-study-cloud-1301165591.cos.ap-guangzhou.myqcloud.com/commimg/18.jpg",
    }
  },
  methods:{
    logout(){
      sessionStorage.clear();
      this.$router.push("/login");
    },
    gohome(){
      this.$router.push("/home");
    }
  },
  async mounted(){
    let res=await this.$http.get('menus');
    if(res.meta.status!=200){
      this.$message({
        showClose: true,
        message: res.meta.msg,
        type: 'error'
      });
    }else{
      this.menulist=res.data;
    }
  }
}
</script>

<style scoped>
.el-menu.el-menu--horizontal{
  border-bottom: none;
}
</style>
<style lang="less">

.el-menu-demo{
  float:left;
}
.el-menu-vertical-demo{
  height: 100%;
}
.hompa{
  width: 100%;
  height: 100%;
}
.el-header{

}
.d1{
  float:right;
}
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  /*text-align: center;
  line-height: 60px;*/
}

.el-header{
  background-color: white;
}
.el-aside {
  background-color: #2b2f3a;
  color: white;
  .el-menu {
    border-right: none;
  }
  .tb{
    display:flex;
    align-items: center;
  }
/*  text-align: center;
  line-height: 200px;*/
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  /*text-align: center;
  line-height: 160px;*/
}

body > .el-container {
  margin-bottom: 40px;
  height: 100%;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}
.iconfont{
  margin-right: 10px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-avatar{
  margin-top: 5px;
}

/*.block{
  height: 55px;
  width: 160px;
}*/
</style>
