<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-col>
        <el-input
          @clear="loadUserList()"
          clearable
          class="inputSearch"
          placeholder="请输入内容"
          v-model="query"
        >
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="showAddUserDia()" type="success">添加按钮</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
    height="300px"
     :data="data" style="width: 100%">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="username" label="姓名" width="80"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <!-- 如果单元格内显示的内容不是字符串(文本),需要给被显示的内容外层包裹一个template -->
          {{scope.row.create_time | fmtdate}}
        </template>
        <!-- template内部如果要用数据,设置slot-scope属性,该属性的值是要用数据creat_time的数据userlist -->
        <!-- slot-scope的值userlist的值其实就是el-table绑定的数据userlist -->
        <!-- userlist.row->数组中的每个对象 -->
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button
              size="mini"
              plain
              type="primary"
              @click="showEditUserdia()"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
            <el-button
              size="mini"
              plain
              type="danger"
              @click="showDeleUserMsgBox(scope.row.id)"
              icon="el-icon-delete"
              circle
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!--添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密 码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电 话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button @click="addUser()" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑用户弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电 话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button @click="dialogFormVisibleEdit = false" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 3,
      total: 32,
      data: [],
      //添加对话框的属性
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit:false,
      //添加用户的表单
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //编辑用户----显示对话框
    showEditUserdia() {
      this.dialogFormVisibleEdit = true
    },
    //删除用户---弹出框(打开消息盒子)
    showDeleUserMsgBox(userId) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //发送删除请求:id ----->用户id
          //data中找userId(不可以)
          //把userId以参数形式传进来
          const res = await this.$http.delete(`user/${userId}`);
          console.log(res);
          if (res.data.meta.status === 200) {
            //回到第一页
            thsi.pagenum = 1;
            this.getUserList();
            this.$message({
              type: "success",
              message: res.data.meta.msg
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //添加用户---发送请求
    async addUser() {
      //关闭对话框
      this.dialogFormVisibleAdd = false;

      const res = await this.$http.post(`users`, this.form);
      console.log(res);

      const {
        meta: { status, msg },
        data
      } = res.data;
      if (status === 201) {
        //提示成功
        this.$message.success(msg);
        this.getUserList();
        //清空文本框
        this.form = {};
      } else {
        //提示
        this.$message.warning(msg);
      }
    },
    //添加用户----显示对话框
    showAddUserDia() {
      (this.dialogFormVisibleAdd = true), this.getUserList();
    },
    //清空搜索框重新获取数据
    loadUserList() {
      this.getUserList();
    },
    //搜索用户
    searchUser() {
      //按照input绑定绑定的query参数  发请求
      this.getUserList();
    },
    // 分页相关的方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.getUserList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getUserList();
    },
    //获取用户列表的请求

    async getUserList() {
      const token = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = token;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      console.log(res);
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        //给表格赋值
        this.data = res.data.data.users;
        //总数
        this.total = res.data.data.total;
        //提示
        // this.$message.success(msg);
      } else {
        //提示
        // this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}
.inputSearch {
  width: 350px;
}
.searchRow {
  margin-top: 20px;
}
</style>
