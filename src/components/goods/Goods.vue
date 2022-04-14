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
            <el-button slot="append" icon="el-icon-search" @click="getGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="res">重置</el-button>
          <el-button type="primary" @click="addgoodsf=true">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table border
                :data="goodslis" >
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称" width="680px">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格" width="79px">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量" width="82px">
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
            <el-button size="mini" type="primary" @click="editgoods(scope.row.goods_id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="delgoods(scope.row)">删除</el-button>
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
    </el-card>

    <!--编辑商品-->
    <el-dialog
      title="编辑商品"
      :visible.sync="dialogVisible"
      width="40%" @close="addclera">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input type="textarea" v-model="ruleForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model.number="ruleForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model.number="ruleForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model.number="ruleForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editgoodsqr">确 定</el-button>
  </span>
    </el-dialog>

   <!--添加商品-->
    <el-dialog
      title="添加商品"
      :visible.sync="addgoodsf"
      width="40%" @close="addg">
      <el-form :model="addrom" :rules="addruls" ref="addrulsForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input type="textarea" v-model="addrom.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader placeholder="请选择商品类别"
            v-model="addrom.goods_cat"
            :options="options" :props="cateprops" ></el-cascader>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model.number="addrom.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model.number="addrom.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model.number="addrom.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍">
          <quillEditor v-model="addrom.goods_introduce" :options="editorOption"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addcancel">取 消</el-button>
    <el-button type="primary" @click="addconfirm">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor"; // 导入quillEditor组件
export default {
  name: "Goods",
  data(){
    return{
      dialogVisible:false,
      addgoodsf:false,
      //富文本工具栏
      editorOption:{
        placeholder:'请输入商品介绍',
        modules: {
          toolbar:  [
            ['bold', 'italic', 'underline', 'strike'],        // 加粗，斜体，下划线，删除线
            [{ 'header': 1 }, { 'header': 2 }],               // 几级标题
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],     // 有序列表，无序列表
            [{ 'script': 'sub'}, { 'script': 'super' }],      // 下角标，上角标
            [{ 'align': [] }], // 居中
            ['clean']                                         // 清除样式
          ]
        }
      },
      goodslis:[],//商品列表
      queryinfo:{//查询参数
        query:'',
        pagenum:1,
        pagesize:10
      },
      options:[],//商品类别数组
      addrom:{
        goods_name:'',
        goods_price:null,
        goods_number:null,
        goods_weight:null,
        goods_cat:[],
        goods_introduce:''
      },
      addruls:{//添加规则
        goods_name:[
          { required: true, message: '商品名称不能为空！'}
        ],
        goods_cat:[
          //验证联级选择器
          {type: 'array',required: true, trigger: 'blur', message: '请选择商品类别'}
        ],
        goods_price:[
          { required: true, message: '商品价格不能为空！'},
          { type: 'number', message: '商品价格必须为数字值'}
        ],
        goods_number:[
          { required: true, message: '商品数量不能为空！'},
          { type: 'number', message: '商品数量必须为数字值'}
        ],
        goods_weight:[
          { required: true, message: '商品重量不能为空！'},
          { type: 'number', message: '商品重量必须为数字值'}
        ]
      },
      //联即的配置
      cateprops:{
        expandTrigger: 'hover',
        value: 'cat_id',//值
        label: 'cat_name',//显示的内容
        children: 'children' //节点
      },
      total:0,
      ruleForm:{
        goods_id:0,
        goods_name:'',
        goods_price:0,
        goods_number:0,
        goods_weight:0,
        goods_cat:[]
      },
      rules:{//编辑规则
        goods_name:[
          { required: true, message: '商品名称不能为空！'}
        ],
        goods_price:[
          { required: true, message: '商品价格不能为空！'},
          { type: 'number', message: '商品价格必须为数字值'}
        ],
        goods_number:[
          { required: true, message: '商品数量不能为空！'},
          { type: 'number', message: '商品数量必须为数字值'}
        ],
        goods_weight:[
          { required: true, message: '商品重量不能为空！'},
          { type: 'number', message: '商品重量必须为数字值'}
        ]
      }
    }
  },components: {
    quillEditor//使用富文本组件
  },
  mounted() {
    this.getGoods();
    this.getcatalogue();
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
      if(res.meta.status !==200){
        throw new Error(res.meta.msg);
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
    //获取所有的分类
    async getcatalogue() {
      let res = await this.$http.get('categories');
      if(res.meta.status !==200){
        throw new Error(res.meta.msg);
        this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error'
        });
      }else{
        this.options=res.data;
       /* console.log(this.addrom.options);*/
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
        if(res.meta.status===200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          await this.getGoods();
        }else{
          throw new Error(res.meta.msg);
          this.$message({
            type: 'error',
            message: res.meta.msg
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //编辑
    async editgoods(e) {
      /*console.log(e);
      this.ruleForm.id=e.goods_id;
      this.ruleForm.goods_name=e.goods_name;
      this.ruleForm.goods_price=e.goods_price;
      this.ruleForm.goods_number=e.goods_number;
      this.ruleForm.goods_weight=e.goods_weight;
      this.ruleForm.goods_introduce=e.goods_introduce;
      */
      let res = await this.$http.get('goods/' + e);
      this.ruleForm=res.data;
      console.log(this.ruleForm);
      this.dialogVisible=true;
    },
    //编辑确认
     editgoodsqr() {
      //验证是否满足条件
      this.$refs.ruleForm.validate(async (ok) => {
        if (ok !== true) {
          this.$message({
            type: 'warning',
            message: '请检查商品信息!'
          });
          return;
        } else {
          //请求修改的接口
          let res = await this.$http.put('goods/' + this.ruleForm.goods_id, this.ruleForm);
          if (res.meta.status === 200) {
            this.dialogVisible = false;
            this.$message({
              showClose: true,
              message: '商品编辑成功！',
              type: 'success'
            });
            await this.getGoods();
          } else {
            //添加失败
            throw new Error(res.meta.msg);
            this.$message({
              showClose: true,
              message: res.meta.msg,
              type: 'error'
            });
          }
        }
      });
    },
    //对话框关闭清空表单
    addclera(){
      this.$refs.ruleForm.resetFields();
    },
    //添加窗口重置
    addg(){
      this.addrom.goods_introduce='';
      this.$refs.addrulsForm.resetFields();
    },
    //添加商品取消
    addcancel(){
      this.addgoodsf=false;
      //富文本内容清空
      this.addrom.goods_introduce='';
    },
    //添加商品确认
    addconfirm(){
      this.$refs.addrulsForm.validate(async (ok) => {
        if (ok !== true) {
          this.$message({
            type: 'warning',
            message: '请检查添加商品信息!'
          });
          return;
        } else {
          //处理选中的类别变成字符串
          this.addrom.goods_cat=this.addrom.goods_cat.join(',');
          //发送请求
          let res = await this.$http.post('goods',this.addrom);
          if(res.meta.status===201){
            this.addgoodsf=false;
            this.$message({
              showClose: true,
              message: '商品添加成功！',
              type: 'success'
            });
            await this.getGoods();
            await this.getcatalogue();
          }else{
            //添加失败
            throw new Error(res.meta.msg);
            this.$message({
              showClose: true,
              message: res.meta.msg,
              type: 'error'
            });
          }
        }
      })
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
