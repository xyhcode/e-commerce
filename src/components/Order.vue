<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item><a>订单列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="seavl" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="sea"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <div  class="text item">
        <el-table border
                  :data="ordelis" :row-class-name="tableRowClassName">
          <el-table-column
            type="index"
            label="#">
          </el-table-column>
          <el-table-column
            prop="order_number"
            label="订单编号">
          </el-table-column>
          <el-table-column
            prop="order_price"
            label="订单价格">
          </el-table-column>
          <el-table-column
            prop="order_pay"
            label="是否付款">
          </el-table-column>
          <el-table-column
            prop="is_send"
            label="是否发货">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="下单时间">
            <template v-slot:="scope">
              {{scope.row.create_time | create_time}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="button" >编辑</el-button>
              <el-button size="mini" type="danger" >删除</el-button>
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
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Order",
  data(){
    return{
      queryinfo:{
        query:'',
        pagenum:1,
        pagesize:2
      },
      ordelis:[],
      total:0,
    }
  },
  mounted() {
    this.getorder();
  },
  methods:{
    //获取所有的订单
    async getorder(){
      let res=await this.$http.get('orders',{params:this.queryinfo});
      if(res.meta.status !=200){
        this.$message({
          showClose:true,
          message:res.meta.msg,
          type:'error'
        });
      }else{
        this.ordelis=res.data.goods;
        this.total=res.data.total;
      }
    },
    //每页改变时
    handleSizeChange(size){
      this.queryinfo.pagesize=size;
      this.getorder();
    },
    //点击页面数字时
    handleCurrentChange(page){
      this.queryinfo.pagenum=page;
      this.getorder();
    },
    //隔行变色
    tableRowClassName({row, rowIndex}) {
      if (rowIndex %2==0) {
        return 'warning-row';
      } else{
        return 'success-row';
      }
    },
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
