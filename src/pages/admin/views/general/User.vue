<template>
  <div class="view">
    <Panel :title="$t('m.User_User')">
      <div slot="header">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-button v-show="selectedUsers.length" type="warning" icon="el-icon-fa-trash"
              @click="deleteUsers(selectedUserIDs)">Delete
            </el-button>
          </el-col>
          <el-col :span="selectedUsers.length ? 16 : 24">
            <el-input v-model="keyword" prefix-icon="el-icon-search" placeholder="Keywords"></el-input>
          </el-col>
        </el-row>
      </div>
      <el-table v-loading="loadingTable" element-loading-text="loading" @selection-change="handleSelectionChange"
        ref="table" :data="userList" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>

        <el-table-column prop="username" :label="$t('m.Username')" align="center"></el-table-column>

        <el-table-column prop="create_time" :label="$t('m.Create_Time')" width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>

        <el-table-column prop="last_login" :label="$t('m.Last_Login')" width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.lastLogin }}
          </template>
        </el-table-column>
        <el-table-column prop="email" :label="$t('m.Email')" align="center"></el-table-column>

        <el-table-column prop="admin_type" :label="$t('m.User_Type')" align="center">
          <template slot-scope="scope">
            {{ scope.row.adminType }}
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="Option" width="200" align="center">
          <template slot-scope="{row}">
            <icon-btn name="Edit" icon="edit" @click.native="openUserDialog(row.id)"></icon-btn>
            <icon-btn name="Delete" icon="trash" @click.native="deleteUsers([row.id])"></icon-btn>
          </template>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-pagination class="page" layout="prev, pager, next" @current-change="currentChange" :page-size="pageSize"
          :total="total">
        </el-pagination>
      </div>
    </Panel>

    <Panel>
      <span slot="title">{{ $t('m.Import_User') }}
        <el-popover placement="right" trigger="hover">
          <p>Only support csv file without headers, check the <a
              href="http://docs.onlinejudge.me/#/onlinejudge/guide/import_users">link</a> for details</p>
          <i slot="reference" class="el-icon-fa-question-circle import-user-icon"></i>
        </el-popover>
      </span>
      <el-upload v-if="!uploadUsers.length" action="" :show-file-list="false" accept=".csv"
        :before-upload="handleUsersCSV">
        <el-button size="small" icon="el-icon-fa-upload" type="primary">Choose File</el-button>
      </el-upload>
      <template v-else>
        <el-table :data="uploadUsersPage">
          <el-table-column :label="$t('m.username')">
            <template slot-scope="{row}">
              {{ row[0] }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('m.password')">
            <template slot-scope="{row}">
              {{ row[1] }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('m.Email')">
            <template slot-scope="{row}">
              {{ row[2] }}
            </template>
          </el-table-column>
        </el-table>
        <div class="panel-options">
          <el-button type="primary" size="small" icon="el-icon-fa-upload" @click="handleUsersUpload">Import All
          </el-button>
          <el-button type="warning" size="small" icon="el-icon-fa-undo" @click="handleResetData">Reset Data
          </el-button>
          <el-pagination class="page" layout="prev, pager, next" :page-size="uploadUsersPageSize"
            :current-page.sync="uploadUsersCurrentPage" :total="uploadUsers.length">
          </el-pagination>
        </div>
      </template>
    </Panel>

    <Panel :title="$t('m.Generate_User')">
      <el-form :model="formGenerateUser" ref="formGenerateUser">
        <el-row type="flex" justify="space-between">
          <el-col :span="4">
            <el-form-item label="Prefix" prop="prefix">
              <el-input v-model="formGenerateUser.prefix" placeholder="Prefix"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="Suffix" prop="suffix">
              <el-input v-model="formGenerateUser.suffix" placeholder="Suffix"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="Start Number" prop="number_from" required>
              <el-input-number v-model="formGenerateUser.number_from" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="End Number" prop="number_to" required>
              <el-input-number v-model="formGenerateUser.number_to" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="Password Length" prop="password_length" required>
              <el-input v-model="formGenerateUser.password_length" placeholder="Password Length"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="generateUser" icon="el-icon-fa-users" :loading="loadingGenerate">Generate &
            Export
          </el-button>
          <span class="userPreview" v-if="formGenerateUser.number_from && formGenerateUser.number_to &&
            formGenerateUser.number_from <= formGenerateUser.number_to">
            The usernames will be {{ formGenerateUser.prefix + formGenerateUser.number_from + formGenerateUser.suffix }},
            <span v-if="formGenerateUser.number_from + 1 < formGenerateUser.number_to">
              {{ formGenerateUser.prefix + (formGenerateUser.number_from + 1) + formGenerateUser.suffix + '...' }}
            </span>
            <span v-if="formGenerateUser.number_from + 1 <= formGenerateUser.number_to">
              {{ formGenerateUser.prefix + formGenerateUser.number_to + formGenerateUser.suffix }}
            </span>
          </span>
        </el-form-item>
      </el-form>
    </Panel>
    <!--对话框-->
    <el-dialog :title="$t('m.User_Info')" :visible.sync="showUserDialog" :close-on-click-modal="false">
      <el-form :model="user" label-width="120px" label-position="left" :rules="ruleForm" ref="ruleForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('m.User_Username')" required prop="username">
              <el-input v-model="user.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('m.User_Email')" required prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('m.User_New_Password')" prop="password">
              <el-input v-model="user.password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('m.User_Type')">
              <el-select v-model="user.adminType">
                <el-option label="Regular User" value="Regular User"></el-option>
                <el-option label="Admin" value="Admin"></el-option>
                <el-option label="Super Admin" value="Super Admin"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('m.Problem_Permission')">
              <el-select v-model="user.problemPermission" :disabled="user.adminType !== 'Admin'">
                <el-option label="None" value="None"></el-option>
                <el-option label="Own" value="Own"></el-option>
                <el-option label="All" value="All"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Is_Disabled')">
              <el-switch v-model="user.isDisabled">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <cancel @click.native="showUserDialog = false">Cancel</cancel>
        <save @click.native="saveUser()"></save>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import papa from 'papaparse'
import api from '../../api.js'
import utils from '@/utils/utils'

export default {
  name: 'User',
  data() {
    return {
      // 一页显示的用户数
      pageSize: 10,
      // 用户总数
      total: 0,
      // 用户列表
      userList: [],
      uploadUsers: [],
      uploadUsersPage: [],
      uploadUsersCurrentPage: 1,
      uploadUsersPageSize: 15,
      // 搜索关键字
      keyword: '',
      // 是否显示用户对话框
      showUserDialog: false,
      // 当前用户model
      user: {},
      loadingTable: false,
      loadingGenerate: false,
      // 当前页码
      currentPage: 1,
      selectedUsers: [],
      formGenerateUser: {
        prefix: '',
        suffix: '',
        number_from: 0,
        number_to: 0,
        password_length: 8
      },
      ruleForm: {
        username: [
          { required: true, trigger: 'blur' },
        ],
        email: [
          { required: true, type: 'email', trigger: 'blur' },
        ],
        password: [
          { trigger: 'blur', min: 6, max: 20 },
        ],
      }
    }
  },
  mounted() {
    this.getUserList(1)
  },
  methods: {
    // 切换页码回调
    currentChange(page) {
      this.currentPage = page
      this.getUserList(page)
    },
    // 提交修改用户的信息
    saveUser() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let formData = Object.assign({}, this.user)
          if (formData.password === '')
            formData.password = null
          else
            formData.password = this.$md5(this.$md5(formData.password))
          api.editUser(formData).then(res => {
            // 更新列表
            this.getUserList(this.currentPage)
          }).then(() => {
            this.showUserDialog = false
          }).catch(() => {
          })
        }
      })
    },
    // 打开用户对话框
    openUserDialog(id) {
      formData.password = this.$md5(this.$md5(formData.password))

      api.editUser(formData).then(res => {
        // 更新列表
        this.getUserList(this.currentPage)
      }).then(() => {
        this.showUserDialog = false
      }).catch(() => {
      })
    },
    // 打开用户对话框
    openUserDialog(id) {
      this.showUserDialog = true
      api.getUser(id).then(res => {
        this.user = res.data.data
        this.user.password = ''
      })
    },
    // 获取用户列表
    getUserList(page) {
      this.loadingTable = true
      api.getUserList(page, this.pageSize, this.keyword).then(res => {
        this.loadingTable = false
        this.total = res.data.data.totalRow
        this.userList = res.data.data.records
      }, res => {
        this.loadingTable = false
      })
    },
    deleteUsers(ids) {
      this.$confirm('Sure to delete the user? The associated resources created by this user will be deleted as well, like problem, contest, announcement, etc.', 'confirm', {
        type: 'warning'
      }).then(() => {
        api.deleteUsers(ids.join(',')).then(res => {
          this.getUserList(this.currentPage)
        }).catch(() => {
          this.getUserList(this.currentPage)
        })
      }, () => {
      })
    },
    handleSelectionChange(val) {
      this.selectedUsers = val
    },
    generateUser() {
      this.$refs['formGenerateUser'].validate((valid) => {
        if (!valid) {
          this.$error('Please validate the error fields')
          return
        }
        this.loadingGenerate = true
        let data = Object.assign({}, this.formGenerateUser)
        api.generateUser(data).then(res => {
          this.loadingGenerate = false
          let url = '/user/generate_user?fileId=' + res.data.data
          utils.downloadFile(url).then(() => {
            this.$alert('All users created successfully, the users sheets have downloaded to your disk.', 'Notice')
          })
          this.getUserList(1)
        }).catch(() => {
          this.loadingGenerate = false
        })
      })
    },
    handleUsersCSV(file) {
      papa.parse(file, {
        complete: (results) => {
          let data = results.data.filter(user => {
            return user[0] && user[1] && user[2]
          })
          this.uploadUsersCurrentPage = 1
          this.uploadUsers = data
          this.uploadUsersPage = data.slice(0, this.uploadUsersPageSize)
        },
        error: (error) => {
          this.$error(error)
        }
      })
    },
    handleUsersUpload() {
      let userList=[]
      //遍历 this.uploadUsers,将数据按照username,password,email的顺序存入userList
      this.uploadUsers.forEach(user => {
        let tempUser={
          username:user[0],
          password:this.$md5(this.$md5(user[1])),
          email:user[2]
        }
        userList.push(tempUser)
      })
      api.importUsers(userList).then(res => {
        this.getUserList(1)
        this.handleResetData()
      }).catch(() => {
      })
    },
    handleResetData() {
      this.uploadUsers = []
    }
  },
  computed: {
    selectedUserIDs() {
      let ids = []
      for (let user of this.selectedUsers) {
        ids.push(user.id)
      }
      return ids
    }
  },
  watch: {
    'keyword'() {
      this.currentChange(1)
    },
    'user.adminType'() {
      if (this.user.adminType === 'Super Admin') {
        this.user.problemPermission = 'All'
      } else if (this.user.adminType === 'Regular User') {
        this.user.problemPermission = 'None'
      }
    },
    'uploadUsersCurrentPage'(page) {
      this.uploadUsersPage = this.uploadUsers.slice((page - 1) * this.uploadUsersPageSize, page * this.uploadUsersPageSize)
    }
  }
}
</script>

<style scoped lang="less">
.import-user-icon {
  color: #555555;
  margin-left: 4px;
}

.userPreview {
  padding-left: 10px;
}
</style>
