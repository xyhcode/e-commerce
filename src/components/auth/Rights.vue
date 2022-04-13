<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item><a>权限列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table border :data="rouls">
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称">
        </el-table-column>
        <el-table-column
          prop="path"
          label="权限路径">
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-if="scope.row.level == 1" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data(){
    return{
      rouls:[],
    }
  },
  methods:{
    async getright() {
      let les = await this.$http.get('rights/list');
      console.log(les);
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
