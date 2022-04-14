<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item><a>商品分类</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addfwin">添加分类</el-button>
      <div class="text item">
        <tree-table class="treeTable" :data="calis" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
          <!-- 是否有效 -->
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
            <i class="el-icon-error" v-else style="color: red;"></i>
          </template>
          <!-- 排序 -->
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
          </template>
          <!-- 操作 -->
          <template slot="opt" slot-scope="scope">
            <el-button type="primary"  size="mini" @click="editcate(scope.row.cat_id)">编辑</el-button>
            <el-button type="danger"  size="mini" @click="decate(scope.row.cat_id)">删除</el-button>
          </template>
        </tree-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="ctparam.pagenum"
          :page-sizes="[10, 300, 400]"
          :page-size="ctparam.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>

   <!--添加-->
    <el-dialog
      title="添加分类"
      :visible.sync="addcata"
      width="40%" @close="addclose">
      <el-form :model="addform" :rules="addrul" ref="addruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model=" addform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectarray"
            :options="options"
            placeholder="请选择父级分类"
            :props="opoprops" @change="getkey">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addcatqx">取 消</el-button>
    <el-button type="primary" @click="addcarqr">确 定</el-button>
  </span>
    </el-dialog>

    <!--编辑-->
    <el-dialog
      title="编辑分类"
      :visible.sync="editcata"
      width="40%">
      <el-form :model="editform" :rules="editrul" ref="editruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editform.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editcata=false">取 消</el-button>
    <el-button type="primary" @click="editcateqr">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Categorie",
  data(){
    return{
      calis:[],//所有分类
      total:0,//总数
      options:[],//父分类数组
      addcata:false,
      editcata:false,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      ctparam:{//请求参数
        type:3,
        pagenum:1,
        pagesize:10
      },
      addform:{
        cat_name:'',
        cat_pid:0,
        cat_level:0
      },
      selectarray:[],//选中的ID
      opoprops:{//指定联级下拉的属性
        expandTrigger: 'hover',//展开
        value: 'cat_id', // 选中值的属性
        label: 'cat_name', // 名称
        children: 'children'
      },
      addrul:{//添加的规则
        cat_name:[
          {required: true, message: '分类名称不能为空！', trigger: 'blur'},
        ]
      },
      editform:{//编辑输入框
        cat_name:'',
        id:0
      },
      editrul:{//编辑规则
        cat_name:[
          {required: true, message: '分类名称不能为空！', trigger: 'blur'},
        ]
      }
    }
  },
  mounted() {
    this.getcat();
  },
  methods:{
    //隔行变色
    tableRowClassName({row, rowIndex}) {
      if (rowIndex %2===0) {
        return 'warning-row';
      } else{
        return 'success-row';
      }
    },
    //得到分类
    async getcat() {
      let res = await this.$http.get('categories',{params:this.ctparam});
      /*console.log(res);*/
      if(res.meta.status !==200){
        throw new Error(res.meta.msg);
        this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error'
        });
      }else{
        this.calis=res.data.result;
        //设置总数
        this.total=res.data.total;
      }
    },
    //改变分页size
    handleSizeChange(size){
      //size最新的size
      this.ctparam.pagesize=size;
      this.getcat();
    },
    //监听你点的页码
    handleCurrentChange(p){
      this.ctparam.pagenum=p;
      this.getcat();
    },
    addfwin(){//点击添加分类
      this.getmancata();
      this.addcata=true;
    },
    //获取父分类
    async getmancata() {
      let res = await this.$http.get('categories', {
        params: {
          type: 2
        }
      });
      if(res.meta.status===200){
        this.options=res.data;
      }else{
        throw new Error(res.meta.msg);
        this.$message({
          type: 'error',
          message: res.meta.msg
        });
      }
    },
    getkey(){//联级发生变化时
      console.log(this.selectarray);
      if(this.selectarray.length<=0){
        this.addform.cat_pid=0
        this.addform.cat_level=0
      }else{
        this.addform.cat_pid=this.selectarray[this.selectarray.length-1];//数组最后一个位数组ID
        this.addform.cat_level=this.selectarray.length;//0:一级分类 1：二级分类 2：三级分类
      }
    },
    addcatqx(){//添加点取消 清空内容
      this.$refs.addruleForm.resetFields();
      this.selectarray=[];
      this.addcata=false;
    },
    addclose(){//添加点关闭 清空内容
      this.$refs.addruleForm.resetFields();
      this.selectarray=[];
    },
    addcarqr() {//添加确认
      this.$refs.addruleForm.validate(async (ok) => {
        if (ok !== true) {
          this.$message({
            type: 'warning',
            message: '请检查添加的信息!'
          });
          return;
        } else {
          let res = await this.$http.post('categories', this.addform);
          if(res.meta.status===201){
            this.addcata=false;
            this.$message({
              showClose: true,
              message: '商品类别添加成功！',
              type: 'success'
            });
          }else{
            //添加失败
            throw new Error(res.meta.msg);
            this.$message({
              showClose: true,
              message: res.meta.msg,
              type: 'error'
            });
          };
          //重新加载数据
          await this.getcat();
        }
      });
    },
    //删除
    decate(e){
      console.log(e);
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        let res=await this.$http.delete('categories/' +e);
        if(res.meta.status===200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          await this.getcat();
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
    async editcate(id) {
      let res = await this.$http.get('categories/' + id);
      if(res.meta.status===200){
        //赋值name
        this.editform.cat_name=res.data.cat_name;
        //赋值ID
        this.editform.id=res.data.cat_id;
      }else {
        throw new Error(res.meta.msg);
        this.$message({
          type: 'error',
          message: res.meta.msg
        });
      };
      this.editcata=true;
    },
    //编辑确认
    editcateqr(){
      this.$refs.editruleForm.validate(async (ok) => {
        if (ok !== true) {
          this.$message({
            type: 'warning',
            message: '请检查编辑的信息!'
          });
          return;
        } else {
          let res = await this.$http.put('categories/' + this.editform.id, this.editform);
          //console.log(res);
          if(res.meta.status===200){
            this.editcata=false;
            this.$message({
              type: 'success',
              message: '编辑成功!'
            });
            await this.getcat();
          }else{
            throw new Error(res.meta.msg);
            this.$message({
              type: 'error',
              message: res.meta.msg
            });
          }
        }
      })
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
.treeTable{
  margin-top:20px;
}
</style>
