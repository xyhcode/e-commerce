<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item><a>权限列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-tree :data="rouls" default-expand-all show-checkbox :props="defaultProps"></el-tree>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data(){
    return{
      rouls:[],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods:{
    async getright() {
      let les = await this.$http.get('rights/tree');
      if(les.meta.status !=200){
        this.$message({
          showClose:true,
          message:les.meta.msg,
          type:'error'
        });
      }else {
        this.rouls=les.data;
      }
    }
  },
  mounted() {
    this.getright();
  }
}
</script>

<style >
</style>
