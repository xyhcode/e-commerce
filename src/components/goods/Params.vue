<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item><a>分类参数</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <el-row class="shoptop">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectarray"
            :options="options"
            placeholder="请选择商品分类"
            :props="opoprops" @change="selectshopcat">
          </el-cascader>
        </el-col>
      </el-row>
      <div v-show="trendsarrtibue.length===0">
        <el-empty description="暂无数据"></el-empty>
      </div>
      <el-tabs v-show="trendsarrtibue.length!==0" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" @click="dialogVisible=true">添加参数</el-button>
          <el-table border
                    :data="trendsarrtibue">
            <el-table-column type="expand">
              <template v-slot="props">
                <el-tag v-for="(atval,index) in props.row.attr_vals" :key="index"
                        closable @close="handleClose(props.row)">{{atval}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#">
            </el-table-column>
            <el-table-column
              prop="attr_name" label="属性">
            </el-table-column>
            <el-table-column
              label="操作" width="150px">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="editpa(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="delepa(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="mini" @click="dialogVisible=true">添加属性</el-button>
          <el-table border
                    :data="staticarrtibue">
            <el-table-column type="expand">
              <template v-slot="props">
                <el-tag v-for="(atval,index) in props.row.attr_vals" :key="index"
                        closable @close="handleClose(props.row)">{{atval}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#">
            </el-table-column>
            <el-table-column
              prop="attr_name" label="属性" >
            </el-table-column>
            <el-table-column
              label="操作" width="150px">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="editpa(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger"  @click="delepa(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--//添加弹框-->
    <el-dialog
      :title="'添加'+titletext"
      :visible.sync="dialogVisible"
      width="40%" @close="diacole">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="ruleForm.attr_name"></el-input>
        </el-form-item>
       <!-- //判断是不是动态-->
        <el-form-item v-show="activeName=='many'" label="动态参数" prop="attr_vals">
          <el-input type="textarea" v-model="ruleForm.attr_vals" placeholder='请以","分隔参数'></el-input>
        </el-form-item>
        <el-form-item v-show="activeName=='only'" prop="attr_valssta" label="静态参数">
          <el-input type="textarea" v-model="ruleForm.attr_valssta" placeholder='请以","分隔参数'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="cateadd">确 定</el-button>
  </span>
    </el-dialog>

   <!--//编辑弹框-->
    <el-dialog
      :title="'编辑'+titletext"
      :visible.sync="edildia"
      width="40%" @close="ediacole">
      <el-form :model="edruleForm" :rules="edrules" ref="eruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="edruleForm.attr_name"></el-input>
        </el-form-item>
        <!-- //判断是不是动态-->
        <el-form-item v-show="activeName=='many'" label="动态参数" prop="attr_vals">
          <el-input type="textarea" v-model="edruleForm.attr_vals" placeholder='请以","分隔参数'></el-input>
        </el-form-item>
        <el-form-item v-show="activeName=='only'" prop="attr_valssta" label="静态参数">
          <el-input type="textarea" v-model="edruleForm.attr_valssta" placeholder='请以","分隔参数'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="edildia = false">取 消</el-button>
    <el-button type="primary" @click="editparamsqr">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:"Params",
  data() {
    return {
      selectarray:[],//选中的ID
      opoprops:{//指定联级下拉的属性
        expandTrigger: 'hover',//展开
        value: 'cat_id', // 选中值的属性
        label: 'cat_name', // 名称
        children: 'children'
      },
      options:[],//联级下拉数组
      activeName:'many',
      trendsarrtibue:[],//动态数组
      staticarrtibue:[],//静态数组
      cat_id:0,
      dialogVisible:false,
      edildia:false,
      ruleForm:{
        attr_name:'',
        attr_vals:'',
        attr_valssta:''
      },
      edruleForm:{
        attr_name:'',
        attr_vals:'',
        attr_valssta:'',
        attr_id: 0,
        cat_id:0
      },
      rules:{//添加规则
        attr_name:[
          { required: true, message: '参数不能为空！'}
        ],
        attr_vals:[
          { required: true, message: '标签不能为空！'}
        ]
      },
      edrules:{//编辑规则
        attr_name:[
          { required: true, message: '参数不能为空！'}
        ],
        attr_vals:[
          { required: true, message: '标签不能为空！'}
        ]
      }
    }
  },
  mounted() {
    this.getcat();
  },
  computed:{
    //返回当前弹窗的标题 知道现在是动态参数还是静态属性
    titletext:function(){
      if(this.activeName=='many'){
        return '动态参数'
      }else{
        return '静态属性'
      }
    }
  },
  methods:{
    //得到分类
    async getcat() {
      let res = await this.$http.get('categories');
      /*console.log(res);*/
      if(res.meta.status !==200){
        throw new Error(res.meta.msg);
        this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error'
        });
      }else{
        this.options=res.data;
      }
    },
    //选择商品分类时触发
    async selectshopcat () {
      //判断是不是第三级
      if (this.selectarray.length !== 3) {
        this.selectarray = [];
        this.$message({
          type: 'warning',
          message: '请选择三级分类!'
        });
        return;
      };
      console.log(this.selectarray);
      //提取分类ID
      let catid=this.selectarray[this.selectarray.length-1];
      this.cat_id=catid;
      //获取数据
      await this.getAttributelist();
      //console.log(1);
    },
    async getAttributelist () {///发送请求
      let res = await this.$http.get(`categories/${this.cat_id}/attributes`, {
        params: {
          sel: this.activeName
        }
      });
      if (res.meta.status === 200) {//成功
        //字符串弄成数组
        res.data.forEach((item) => {
          if(item.attr_vals.length===0){
            item.attr_vals=[];
          }else{
            item.attr_vals=item.attr_vals.split(',');
          };
          item.inputValue='';
          item.inputVisible=false;
        });
        //判断是静态还是动态
        if(this.activeName=='many'){
          //动态
          this.trendsarrtibue=res.data;
        }else{
          //静态
          this.staticarrtibue = res.data;
        }
        console.log(res);
      } else {
        throw new Error(res.meta.msg);
        this.$message({
          type: 'error',
          message: res.meta.msg
        });
      }
    },
    //tab选中触发 静态||动态
    handleClick(){
      //请求获取数据
      this.getAttributelist();
    },
    //关闭添加的弹框
    diacole(){
      this.$refs.ruleForm.resetFields();
    },
    //弹框添加确定
    cateadd(){
      console.log(this.ruleForm);
      if(this.activeName=='only'){
        this.ruleForm.attr_vals='1'
      }
      this.$refs.ruleForm.validate(async (ok) => {
        if (ok !== true) {
          this.$message({
            type: 'warning',
            message: '请检查添加属性的信息!'
          });
          return;
        } else {
          //调用添加参数
          await this.Addfunction();
        }
      });
    },
    async Addfunction () {//添加参数的方法
      //参数值
      let params={};
      if(this.activeName === 'many'){
        params={
          attr_name: this.ruleForm.attr_name,
          attr_sel: 'many',
          attr_vals: this.ruleForm.attr_vals
        }
      }else{
        params={
          attr_name: this.ruleForm.attr_name,
          attr_sel: 'only',
          attr_vals: this.ruleForm.attr_valssta
        }
      }
      let res = await this.$http.post(`categories/${this.cat_id}/attributes`, params);
      if(res.meta.status===201){//添加成功
        //关闭窗口
        this.dialogVisible=false;
        //提示成功
        this.$message({
          showClose: true,
          message: this.titletext+"添加成功！",
          type: 'success'
        });
        //重新加载
        await this.getAttributelist();
      }else{
        throw new Error(this.titletext+" "+res.meta.msg);
        this.$message({
          showClose: true,
          message: this.titletext+' '+res.meta.msg,
          type: 'error'
        });
      }
    },
    //编辑
    async editpa (e) {
      let res = await this.$http.get(`categories/${e.cat_id}/attributes/${e.attr_id}`);
      this.edruleForm.attr_name=res.data.attr_name;
      this.edruleForm.attr_vals=res.data.attr_vals;
      this.edruleForm.attr_id=res.data.attr_id;
      this.edruleForm.cat_id=res.data.cat_id;
      this.edruleForm.attr_valssta=res.data.attr_vals;
      this.edildia=true;
    },
    //编辑关闭 清空
    ediacole(){
      this.$refs.eruleForm.resetFields();
    },
    //编辑确认
    editparamsqr(){
      //规则外随赋 防止验证为假
      if(this.activeName=='only'){
        this.edruleForm.attr_vals='1'
      }
      //验证
      this.$refs.eruleForm.validate(async (ok) => {
        if (ok !== true) {
          this.$message({
            type: 'warning',
            message: '请检查修改属性的信息!'
          });
          return;
        } else {
          //编辑方法
          await this.Editfunction();
        }
      })
    },
    //编辑方法
    async Editfunction () {
      //设置请求的参数
      let params = {};
      if (this.activeName === 'many') {
        params = {
          attr_name: this.edruleForm.attr_name,
          attr_sel: 'many',
          attr_vals: this.edruleForm.attr_vals
        }
      } else {
        params = {
          attr_name: this.edruleForm.attr_name,
          attr_sel: 'only',
          attr_vals: this.edruleForm.attr_valssta
        }
      };
      //请求
      let res = await this.$http.put(`categories/${this.edruleForm.cat_id}/attributes/${this.edruleForm.attr_id}`, params);
      if(res.meta.status===200){
        this.edildia=false;
        this.$message({
          showClose: true,
          message: this.titletext+'编辑成功！',
          type: 'success'
        });
        //重新加载
        await this.getAttributelist();
      }else{
        throw new Error(res.meta.msg);
        this.$message({
          type: 'error',
          message: this.titletext+' '+res.meta.msg
        });
      }
    },
    //删除
    delepa(info){
      this.deleparam(info);
    },
    //删除方法
    deleparam(info){
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        let res=await this.$http.delete(`categories/${info.cat_id}/attributes/${info.attr_id}`);
        console.log(res);
        if(res.meta.status===200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //重新加载
          await this.getAttributelist();
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
    //删除标签
    handleClose(tag) {
      //调用删除方法
      this.deleparam(tag);
    },
    //显示输入框
    showInput(tag) {
      tag.inputVisible=true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //标签输入框回车
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return;
      } else {
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false;
        console.log(row);
        //请求
        let res = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        });
        if(res.meta.status===200){
          this.$message({
            showClose: true,
            message: this.titletext+'编辑成功！',
            type: 'success'
          });
          //重新加载
          await this.getAttributelist();
        }else{
          throw new Error(res.meta.msg);
          this.$message({
            type: 'error',
            message: this.titletext+' '+res.meta.msg
          });
        }
      }
    },

  }
}
</script>

<style scoped>
.shoptop{
  margin-top: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-tag{margin:7px;}
</style>
