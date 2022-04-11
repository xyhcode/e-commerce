<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item><a>商品列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryinfo.query"  class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="res">重置</el-button>
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table border
                :data="goodslis" :row-class-name="tableRowClassName">
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量">
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间">
          <template v-slot="scope">
            {{scope.row.add_time | add_time}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="button" >编辑</el-button>
            <el-button size="mini" type="danger" @click="delgoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[2, 10, 300, 400]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Goods",
  data(){
    return{
      goodslis:[],
      queryinfo:{
        query:'',
        pagenum:1,
        pagesize:2
      },
      total:0
    }
  },
  mounted() {
    this.getGoods();
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
    //获取所有的商品
    async getGoods() {
      let res = await this.$http.get('goods',{params:this.queryinfo});
      if(res.meta.status !=200){
        this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error'
        });
      }else{
        this.goodslis=res.data.goods;
        this.total=res.data.total;
      }
    },
    //指定每页多少数据 改变
    handleSizeChange(size){
      this.queryinfo.pagesize=size;
      this.getGoods();
    },
    //当前页改变
    handleCurrentChange(curr){
      this.queryinfo.pagenum=curr;
      this.getGoods();
    },
    //重置按钮
    res(){
      this.queryinfo.query='';
    },
    //删除 goods/:id
    delgoods(rowconfig){
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        let res=await this.$http.delete('goods/' + rowconfig.goods_id);
        if(res.meta.status==200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          await this.getGoods();
        }else{
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
