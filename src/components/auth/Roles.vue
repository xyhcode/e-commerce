<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item><a>角色列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="adtk">添加角色</el-button>
      <div  class="text item">
        <el-table border
                  :data="rolelis" >
          <el-table-column type="expand">
            <template v-slot="props">
              <el-empty v-if="props.row.children.length==0"></el-empty>
              <el-row :class="['bom','center', one==0 ? 'botop':'']" v-for="(onechil,one) in props.row.children" :key="onechil.id">
                <el-col :span="4" style="width:140px;margin-left: 50px">
                  <el-tag @close="handleClose(props.row,onechil.id)" closable>{{onechil.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-row  :class="['center', tow == 0 ? '' : 'botop']" v-for="(towchil,tow) in onechil.children" :key="towchil.id">
                    <el-col :span="3">
                      <el-tag @close="handleClose(props.row,towchil.id)" closable type="success">{{towchil.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="21">
                      <el-tag @close="handleClose(props.row,threechil.id)" closable type="warning" v-for="threechil in towchil.children" :key="threechil.id">
                        {{threechil.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            label="#">
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名称">
          </el-table-column>
          <el-table-column
            prop="roleDesc"
            label="角色描述">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="edrl(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="de(scope.row.id)">删除</el-button>
              <el-button size="mini" type="warning" @click="fpqx(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog
      title="分配权限"
      :visible.sync="ass"
      width="40%" >
      <el-tree node-key="id"   ref="tree" :default-checked-keys="selekey" :data="qxlis" default-expand-all show-checkbox :props="defaultProps">

      </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="rxqx">取 消</el-button>
    <el-button type="primary" @click="upqx(id)">确 定</el-button>
  </span>
    </el-dialog>


    <el-dialog
      title="添加角色"
      :visible.sync="addrolues"
      width="40%" @close="adroclera">
      <el-form :model="rolseForm" :rules="rules" ref="rolseForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolseForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolseForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addrolues = false">取 消</el-button>
    <el-button type="primary" @click="addrol">确 定</el-button>
  </span>
    </el-dialog>



    <el-dialog
      title="编辑角色"
      :visible.sync="eeditroshow"
      width="40%" @close="roclera">
      <el-form :model="editrolseForm" :rules="editrules" ref="editrolseForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editrolseForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editrolseForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="eeditroshow = false">取 消</el-button>
    <el-button type="primary" @click="editrolqd(editrolseForm.id)">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data(){
    return{
      rolelis:[],//角色列表
      //树形配置属性
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      //分配权限窗口隐藏显示
      ass:false,
      qxlis:[],
      selekey:[],
      id:0,
      //添加窗口是否显示
      addrolues:false,
      //添加弹窗属性
      rolseForm:{
        roleName:'',
        roleDesc:''
      },
      //编辑弹窗属性
      editrolseForm:{
        roleName:'',
        roleDesc:'',
        id:0
      },
      //添加弹窗规则
      rules:{
        roleName:[
          {required: true, message: '请输入角色名称', trigger: 'blur'},
        ],
        roleDesc:[
          {required: true, message: '请输入角色描述', trigger: 'blur'},
        ]
      },
      //编辑弹窗规则
      editrules:{
        roleName:[
          {required: true, message: '请输入角色名称', trigger: 'blur'},
        ],
        roleDesc:[
          {required: true, message: '请输入角色描述', trigger: 'blur'},
        ]
      },
      //编辑窗口是否显示
      eeditroshow:false
    }
  },
  mounted() {
    this.getroles();
  },
  methods:{
    //查询所有角色
    async getroles() {
      let res = await this.$http.get('roles');
      if (res.meta.status !==200){
        this.$message({
          showClose:true,
          message:res.meta.msg,
          type:'error'
        });
        throw new Error(res.meta.msg);
      }else{
        this.rolelis=res.data;
      }
    },
    //隔行变色
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2=== 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    //点击分配权限
    async fpqx(chil) {
      this.id=chil.id;
      this.selekey=[];
      let chil1=chil.children;
      for(let i=0;i<chil1.length;i++){
        var chil2=chil1[i].children;
        for(let j=0;j<chil2.length;j++){
          var chil3=chil2[j].children;
          for(let g=0;g<chil3.length;g++){
            this.selekey.push(chil3[g].id);
          }
        }
      }
      this.qxlis=[];
      await this.getdgrol();
      this.ass = true;
    },
    //获取所有的权限
    async getdgrol() {
      let les = await this.$http.get('rights/tree');
      if (les.meta.status !== 200) {
        this.$message({
          showClose: true,
          message: les.meta.msg,
          type: 'error'
        });
        throw new Error(les.meta.msg);
      } else {
        this.qxlis = les.data;
      }
    },
    //修改权限确定
    async upqx(pid) {
      //则返回目前半选中的节点的 key 所组成的数组
      var f = this.$refs.tree.getHalfCheckedKeys();
      //则返回目前被选中的节点的 key 所组成的数组
      var g = this.$refs.tree.getCheckedKeys();
      var key = [...f, ...g];
      var rids = key.join(",");
      console.log(rids);
      let res=await this.$http.post(`roles/${pid}/rights`,{rids:rids});
      if(res.meta.status!==200){
        this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error'
        });
        throw new Error(res.meta.msg);
      }else{
        this.ass=false;
        this.$message({
          showClose: true,
          message:'更新成功！',
          type: 'success'
        });
        this.id=0;
        this.selekey=[];
        this.qxlis=[];
        await this.getroles();
      }
    },
    //取消
    rxqx(){
      this.ass=false;
      this.id=0;
    },
    //删除
    de(zgid) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        let res=await this.$http.delete('roles/' + zgid);
        if(res.meta.status===200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          await this.getroles();
        }else{
          this.$message({
            type: 'error',
            message: res.meta.msg
          });
          throw new Error(res.meta.msg);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //点击添加角色
    adtk(){
      this.addrolues=true;
    },
    //添加角色确定
    addrol(){
      this.$refs.rolseForm.validate(async ok => {
        if (ok !== true) {
          this.$message({
            type: 'warning',
            message: '请检查角色的信息!'
          });
        } else {
          let res=await this.$http.post('roles', this.rolseForm);
          if(res.meta.status===201){
            this.$message({
              type: 'success',
              message: '角色添加成功!'
            });
            this.addrolues=false;
            await this.getroles();
          }else{
            this.$message({
              type: 'error',
              message: res.meta.msg
            });
            throw new Error(res.meta.msg);
          }
        }
      })
    },
    //关闭添加弹框清空内容
    adroclera(){
      this.$refs.rolseForm.resetFields();
    },
    //改变编辑清空内容
    roclera(){
      this.$refs.editrolseForm.resetFields();
    },
    //点击编辑 弹框
    edrl(rowcont){
      this.editrolseForm.roleDesc=rowcont.roleDesc;
      this.editrolseForm.roleName=rowcont.roleName;
      this.editrolseForm.id=rowcont.id;
      this.eeditroshow=true;
    },
    //编辑确定
    editrolqd(){
      this.$refs.editrolseForm.validate(async ok => {
        if (ok !== true) {
          this.$message({
            type: 'warning',
            message: '请检查角色的信息!'
          });
        } else {
          let res=await this.$http.put('roles/' + this.editrolseForm.id, this.editrolseForm);
          if(res.meta.status===200){
            this.$message({
              type: 'success',
              message: '角色编辑成功!'
            });
            this.eeditroshow=false;
            /* this.editrolseForm.roleDesc='';
            this.editrolseForm.roleName='';
             */
            this.editrolseForm.id=0;
            await this.getroles();
          }else{
            this.$message({
              type: 'error',
              message: res.meta.msg
            });
            throw new Error(res.meta.msg);
          }
        }
      })
    },
    //关闭标签按钮
    handleClose(rorow,rid) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        let res=await this.$http.delete(`roles/${rorow.id}/rights/${rid}`);
        if(res.meta.status===200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          rorow.children=res.data;
        }else{
          this.$message({
            type: 'error',
            message: res.meta.msg
          });
          throw new Error(res.meta.msg);
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
<style scoped>
.el-tag{margin:7px;}
.botop{border-top:1px solid #eee}
.bom{border-bottom:1px solid #eee}

.center{
  display: flex;
  align-items: center;
}
</style>
