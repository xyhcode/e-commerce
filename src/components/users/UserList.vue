<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item><a>用户列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryinfo.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">重置</el-button>
          <el-button type="primary" @click="tktj">添加</el-button>
        </el-col>
      </el-row>
      <div  class="text item">
        <el-table border
          :data="uslist" >
          <el-table-column
            type="index"
            label="#">
          </el-table-column>
          <el-table-column
            prop="username"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="email"
            label="电子邮件">
          </el-table-column>
          <el-table-column
            prop="mg_state"
            label="当前状态" width="77px">
            <template v-slot="scope">
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949" @change="stutschang(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="role_name"
            label="权限名字">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间">
            <template v-slot:="scope">
              {{scope.row.create_time | create_time}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="235px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="editus(scope.row)">编辑</el-button>
              <el-button size="mini" type="warning" @click="disrol(scope.row)">分配权限</el-button>
              <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
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
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%" @close="addclera">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="adduser">确 定</el-button>
  </span>
    </el-dialog>


    <el-dialog
      title="编辑用户"
      :visible.sync="edituser"
      width="40%" >
      <el-form :model="editform" :rules="editroles" ref="editruleForm" label-width="100px" class="demo-ruleForm">
        <el-input v-model=" editform.id" type="hidden"></el-input>
        <el-form-item label="电子邮件" prop="email">
          <el-input v-model=" editform.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="edituser = false">取 消</el-button>
    <el-button type="primary" @click="editusqr">确 定</el-button>
  </span>
    </el-dialog>


    <el-dialog
      title="分配角色"
      :visible.sync="distr"
      width="40%" @close="rolwin">
      <el-form :model="disf" :rules="distroles" ref="distruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="当前的用户" prop="username">
          <el-input :disabled="true" v-model="disf.username"></el-input>
        </el-form-item>
        <el-form-item label="当前的角色" prop="rolname">
          <el-input :disabled="true" v-model="disf.rolname"></el-input>
        </el-form-item>
        <el-form-item label="分配新角色" prop="role">
          <el-select v-model="disf.role" placeholder="请选择角色">
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="distr = false">取 消</el-button>
    <el-button type="primary" @click="disroleqr">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "UserList",
  data(){
    return{
      queryinfo:{//查询参数
        query:'',
        pagenum:1,
        pagesize:2
      },
      uslist:[],//用户列表
      total:0,
      seavl:'',
      dialogVisible:false,
      ruleForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      editform:{
        id:0,
        email:'',
        mobile:''
      },
      editroles:{//编辑规则1
        email:[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile:[
          { required: true, message: '请输入电话'},
        ]
      },
      //添加用户规则
      rules:{
        username:[
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        password:[
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
        email:[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile:[
          { required: true, message: '请输入电话'},
        ]
      },
      edituser:false,
      distr:false,
      disf:{
        role:'',
        username:'',
        rolname:'',
        id:0
      },
      distroles:{//分配权限规则
        role:[
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      rolelist:[]
    }
  },
  async mounted() {
    await this.getlist();
    await this.getroles();
  },
  methods:{
    //获取所有的List
    async getlist(){
      let res=await this.$http.get('users',{params:this.queryinfo});
      if(res.meta.status!==200){
        this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error'
        });
        throw new Error(res.meta.msg);
      }else{
        this.uslist=res.data.users;
        this.total=res.data.total;
      }
    },
    //获取角色列表
    async getroles () {
      let res = await this.$http.get('roles');
      if(res.meta.status!==200){
        this.$message({
          type: 'error',
          message: res.meta.msg
        });
        throw new Error(res.meta.msg);
      }else{
        this.rolelist=res.data;
      }
    },
    //隔行变色
    tableRowClassName({row, rowIndex}) {
      if (rowIndex %2===0) {
        return 'warning-row';
      } else{
        return 'success-row';
      }
    },
    //每页条数改变
    handleSizeChange(size){
      //size最新的size
      this.queryinfo.pagesize=size;
      this.getlist();
    },
    //监听你点的页码
    handleCurrentChange(p){
      this.queryinfo.pagenum=p;
      this.getlist();
    },
    //删除用户
    del(id){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        let res = await this.$http.delete('users/' + id);
        if(res.meta.status===200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          await this.getlist();
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
    //搜索
    sea(){
      var list;
      if (this.seavl=='') {
        list=this.uslist;
      } else {
        list = this.uslist.filter((item) => {
          return item.username.includes(this.seavl) || item.email.includes(this.seavl);
        });
        this.total=list.length;
      }
      return list;
    },
    //修改状态
    async stutschang(uslis) {
      let res=await this.$http.put(`users/${uslis.id}/state/${uslis.mg_state}`);
      if(res.meta.status===200){
        this.$message({
          type: 'success',
          message: '状态修改成功!'
        });
      }else{
        uslis.mg_state=!uslis.mg_state;
        this.$message({
          type: 'error',
          message: res.meta.msg
        });
        throw new Error(res.meta.msg);
      }
      console.log(uslis);
    },
    //添加打开弹窗
    tktj(){
      this.dialogVisible=true;
    },
    //对话框关闭清空表单
    addclera(){
      this.$refs.ruleForm.resetFields();
    },
    //添加框确定
    adduser(){
      this.$refs.ruleForm.validate(async ok => {
        if (ok !== true) {
          this.$message({
            type: 'warning',
            message: '请检查用户的信息!'
          });
          return;
        } else {
          //请求添加用户
          let res = await this.$http.post('users', this.ruleForm);
          if(res.meta.status===201){
            //关闭窗口 添加成功
            this.dialogVisible=false;
            this.$message({
              showClose: true,
              message: '用户添加成功！',
              type: 'success'
            });
            //重新查询
            await this.getlist();
          }else{
            //添加失败
            this.$message({
              showClose: true,
              message: res.meta.msg,
              type: 'error'
            });
            throw new Error(res.meta.msg);
          }
        }
      });
    },
    //编辑弹框
    editus(edituser){
      console.log(edituser);
      this.editform.email=edituser.email;
      this.editform.mobile=edituser.mobile;
      this.editform.id=edituser.id;
      this.edituser=true;
    },
    //用户编辑确定
    editusqr(){
      this.$refs.editruleForm.validate(async ok => {
        if (ok !==true) {
          this.$message({
            type: 'warning',
            message: '请检查编辑的信息!'
          });
          return;
        } else {
          let res = await this.$http.put('users/'+this.editform.id,this.editform);
          console.log(res);
          if(res.meta.status===200){
            this. edituser=false;
            this.$message({
              showClose: true,
              message: '用户编辑成功！',
              type: 'success'
            });
            await this.getlist();
          }else{
            this.$message({
              showClose: true,
              message: '用户编辑失败！',
              type: 'error'
            });
            throw new Error(res.meta.msg);
          }
        }
      })
    },
    //分配权限列表
    disrol(row){
      console.log(row);
      this.disf.username=row.username;
      this.disf.rolname=row.role_name;
      this.disf.id=row.id;
      this.distr=true;
    },
    //分配角色关闭
    rolwin(){
      this.$refs.distruleForm.resetFields();
    },
    //分配角色确定
    disroleqr () {
      this.$refs.distruleForm.validate(async (ok) => {
        if (ok !== true) {
          this.$message({
            type: 'warning',
            message: '请检查分配信息!'
          });
          return;
        } else {
          let res = await this.$http.put(`users/${this.disf.id}/role`, {
            rid: this.disf.role
          });
          if(res.meta.status===200){
            this.distr=false;
            this.$message({
              showClose: true,
              message: '授权成功！',
              type: 'success'
            });
            await this.getlist();
          }else{
            this.$message({
              showClose: true,
              message: res.meta.msg,
              type: 'error'
            });
            throw new Error(res.meta.msg);
          }
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
