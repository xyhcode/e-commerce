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
          <el-input placeholder="请输入内容" v-model="queryinfo.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getorder"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <div  class="text item">
        <el-table border
                  :data="ordelis" >
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
            <template v-slot="scope">
              <el-tag v-if="scope.row.order_pay==0" type="danger">未付款</el-tag>
              <el-tag v-else type="success">已付款</el-tag>
            </template>
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
              <el-button size="mini" type="primary"  @click="clieditorder(scope.row)">编辑</el-button>
              <el-button size="mini" type="success" @click="getlogisticsinfo">物流</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryinfo.pagenum"
          :page-sizes="[10, 300, 400]"
          :page-size="queryinfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!--//编辑地址-->
    <el-dialog
      title="编辑订单"
      :visible.sync="editorder"
      width="40%" >
      <el-form :model="editorderfor" :rules="rulorder" ref="editruleForm" label-width="100px" class="demo-ruleForm">
        <el-input v-model=" editorderfor.id" type="hidden"></el-input>
        <el-form-item label="省市区/县" prop="city">
          <el-cascader :options="city" v-model="editorderfor.city" @change="handcity"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="editorderfor.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editorder=false">取 消</el-button>
    <el-button @click="changorder">确 定</el-button>
  </span>
    </el-dialog>

<!--    //物流-->
    <el-dialog title="物流信息"
               :visible.sync="logist"
               width="40%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in log"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import city from "@/assets/js/city_data2017_element";
export default {
  name: "Order",
  data(){
    return{
      city:city,
      queryinfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      ordelis:[],
      total:0,
      editorder:false,
      logist:false,
      editorderfor:{
        id:0,
        city:['湖南省','湘潭市','雨湖区'],
        address:'九华创新创业中心3栋',
      },
      rulorder:{
        address:[ { required: true, message: '详细地址不能为空！'},]
      },
      log:[
        {
          "time": "2018-05-10 09:39:00",
          "ftime": "2018-05-10 09:39:00",
          "context": "已签收,感谢使用顺丰,期待再次为您服务",
          "location": ""
        },
        {
          "time": "2018-05-10 08:23:00",
          "ftime": "2018-05-10 08:23:00",
          "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          "location": ""
        },
        {
          "time": "2018-05-10 07:32:00",
          "ftime": "2018-05-10 07:32:00",
          "context": "快件到达 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-10 02:03:00",
          "ftime": "2018-05-10 02:03:00",
          "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-09 23:05:00",
          "ftime": "2018-05-09 23:05:00",
          "context": "快件到达 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 21:21:00",
          "ftime": "2018-05-09 21:21:00",
          "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 13:07:00",
          "ftime": "2018-05-09 13:07:00",
          "context": "顺丰速运 已收取快件",
          "location": ""
        },
        {
          "time": "2018-05-09 12:25:03",
          "ftime": "2018-05-09 12:25:03",
          "context": "卖家发货",
          "location": ""
        },
        {
          "time": "2018-05-09 12:22:24",
          "ftime": "2018-05-09 12:22:24",
          "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          "location": ""
        },
        {
          "time": "2018-05-08 21:36:04",
          "ftime": "2018-05-08 21:36:04",
          "context": "商品已经下单",
          "location": ""
        }
      ]
    }
  },
  mounted() {
    this.getorder();
  },
  methods:{
    //获取所有的订单
    async getorder(){
      //console.log(1);
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
    handcity(value){
      this.editorderfor.city=value;
    },
    //编辑订单
    clieditorder(orderinfo){
      //给弹出层设置数据
      console.log(orderinfo);
      //console.log(this.editorderfor);
      this.editorderfor.id=orderinfo.order_id;
      this.editorder=true
    },
    //确认修改
    changorder(){
      this.$refs.editruleForm.validate(async (ok) => {
        if (ok != true) {
          //添加失败
          this.$message({
            type: 'warning',
            message: '请检查编辑的地址的信息!'
          });
          return;
        } else {
          this.editorder = false;
          this.$message({
            showClose: true,
            message: '地址编辑成功！',
            type: 'success'
          });
          //重新加载
          await this.getorder();
        }
      })
    },
    //获取物流信息
    async getlogisticsinfo() {
      this.logist=true
    }
  },
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
