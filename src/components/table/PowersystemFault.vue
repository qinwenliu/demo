<template>
    <div style="padding: 5px 20px;">
      <br>
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="故障信息">
          <el-input v-model="selectdata.dataone" placeholder="faultInformation"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitSelect" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="TJCollectionForm" icon="el-icon-edit">添加</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格-->
      <el-table :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="故障信息" prop="faultInformation">
        </el-table-column>
        <el-table-column label="重要性" prop="importance">
        </el-table-column>
        <el-table-column label="对应模块名称" prop="psmName">
        </el-table-column>
        <!-- <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改">
              <el-button type="primary" icon="el-icon-edit" circle @click="BJCollectionForm(scope.$index)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除">
              <el-button type="danger" icon="el-icon-delete-solid" circle @click="deleteVisible(scope)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column> -->
      </el-table>
   
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"
        :background="true">
      </el-pagination>
   
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="collectionform" :rules="rules" :model="ruleForm" label-width="120px" label-position="left">
          <el-form-item label="故障信息" prop="faultInformation">
            <el-input placeholder="请输入故障信息" v-model="ruleForm.faultInformation"></el-input>
          </el-form-item>
          <el-form-item label="重要性" prop="importance">
            <el-input placeholder="请输入重要性" v-model="ruleForm.importance"></el-input>
          </el-form-item>
          <el-form-item label="对应模块名称" prop="psmName">
            <el-input placeholder="请输入对应模块名称" v-model="ruleForm.psmName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" v-if="dialogStatus=='create'" @click="submitCollectionForm('collectionform')">添 加</el-button>
          <el-button type="warning" v-else @click="updateCollectionForm('collectionform')">修 改</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
   
  <script>
   
    export default {
      name: 'InterFace',
      data() {
        return {
   
          'list': null,
          'total': 0,
          listQuery: {
            page: 1,
            limit: 10,
            // ShipType_id: ''
          },
          selectdata: {
            dataone:'',
            datatwo:''
          },
          dialogFormVisible: false,
          dialogStatus: 'create',
          textMap: {
            update: '修改信息',
            create: '添加信息'
          },
   
          ruleForm: {
            // ShipType_id: '',
            "faultInformation": '',
            "importance": '',
            "psmName":'',
          },
   
          rules: {
            Faultlnformation: [{
              required: true,
              message: '请输入故障信息',
              trigger: 'blur'
            }],
            Importance: [{
              required: true,
              message: '请输入重要性',
              trigger: 'blur'
            }],
            psmName: [{
              required: true,
              message: '请输入对应模块名称',
              trigger: 'blur'
            }]
          }
        }
      },
      created() {
        this.axiosdata()
        console.log(this.listQuery)
      },
      
      methods: {
        handleSizeChange(val) {
          this.listQuery.limit = val;
          this.axiosdata();
        },
        handleCurrentChange(val) {
          this.listQuery.page = val;
          this.axiosdata();
        },
        onSubmitSelect() {
          // this.axiosdata()
          this.$axios({
            url: '/api/server/powerSystemFault/getScope',
            method: 'get',
                params:{
                    Faultlnformation: this.selectdata.dataone,
                }
          }).then((response) => {
            console.log(response.data)
            this.list = response.data.data.list;
            this.total = response.data.data.total;
          })
        },
  
        axiosdata() {
          this.$axios({
            url: '/api/server/powerSystemFault/page',
            method: 'get',
                params:{
                    pageNumber: this.listQuery.page,
                    pageSize: this.listQuery.limit
                }
          }).then((response) => {
            console.log(response.data)
            // this.list = response.data.list;
            this.list = response.data.data.list;
            this.total = response.data.data.total;
          })
        },
   
        /* 添加表单*/
        TJCollectionForm() {
          /* 表单重置*/
          Object.assign(this.$data.ruleForm, this.$options.data().ruleForm);
   
          this.dialogStatus = "create"
          this.dialogFormVisible = true
        },
  
        /* 编辑表单*/
        BJCollectionForm($index) {
          //显示修改对话框
          this.ruleForm = JSON.parse(JSON.stringify(this.list[$index]))
          //以下效果和上面的不一样
          //this.ruleForm=this.list[$index]
          this.dialogStatus = "update"
          this.dialogFormVisible = true
   
        },
   
        /* 添加按钮*/
        submitCollectionForm(formname) {
          this.$refs[formname].validate((valid) => {
            if (valid) {
              this.$axios({
                method: 'post',
                url: '/api/server/powerLevel',
                data: this.ruleForm
              }).then((response) => {
                if (response.data.code == 0) {
                  this.axiosdata();
                  this.dialogFormVisible = false;
                  this.$message.success('添加数据成功！');
                } else {
                  this.$message.error('添加数据失败！');
                }
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
  
        /* 修改按钮*/
        updateCollectionForm(formname) {
          this.$refs[formname].validate((valid) => {
            if (valid) {
              this.$axios({
                method: 'post',
                url: '/api/server/reflush',
                data: this.ruleForm
              }).then((response) => {
                if (response.data.code == 0) {
                  this.axiosdata();
                  this.dialogFormVisible = false;
                  this.$message.success('修改数据成功！');
                } else {
                  this.$message.error('修改数据失败！');
                }
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
  
        /* 删除按钮*/
        deleteVisible(scope) {
          console.log(scope.row)
          this.$confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios({
              method: 'post',
              url: '/wwa/reflush',
              data: scope.row,//scope相当于一行的数据， scope.row相当于当前行的数据对象
            }).then((response) => {
              if (response.data.resStatus.resCode == 0) {
                this.axiosdata();
                this.dialogFormVisible = false;
                this.$message.error('删除完毕')
              } else {
                this.$message.error('删除数据失败！');
              }
            })
          });
        },
      },
    }
  
  </script>
   
  <style>
  </style>