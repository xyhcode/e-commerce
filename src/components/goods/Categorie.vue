<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item><a>商品分类</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div  class="text item">
        <el-table border
                  :data="calis" :row-class-name="tableRowClassName">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-tree :data="props.row.children" default-expand-all show-checkbox :props="defaultProps"></el-tree>
            </template>
          </el-table-column>
          <el-table-column
            prop="cat_id"
            label="类别ID">
          </el-table-column>
          <el-table-column
            prop="cat_name"
            label="类别名称">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="button" >编辑</el-button>
              <el-button size="mini" type="danger" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Categorie",
  data(){
    return{
      calis:[],
      defaultProps: {
        children: 'children',
        label: 'cat_name'
      }
    }
  },
  mounted() {
    this.getcat();
  },
  methods:{
    //隔行变色
    tableRowClassName({row, rowIndex}) {
      if (rowIndex %2==0) {
        return 'warning-row';
      } else{
        return 'success-row';
      }
    },
    async getcat() {
      let res = await this.$http.get('categories');
      if(res.meta.status !=200){
        this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error'
        });
      }else{
        this.calis=res.data;
      }
    }
  }
}
</script>

<style >
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
