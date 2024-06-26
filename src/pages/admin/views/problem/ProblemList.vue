<template>
  <div class="view">
    <Panel :title="contestId ? this.$i18n.t('m.Contest_Problem_List') : this.$i18n.t('m.Problem_List')">
      <div slot="header">
        <el-input v-model="keyword" prefix-icon="el-icon-search" placeholder="Keywords">
        </el-input>
      </div>
      <el-table v-loading="loading" element-loading-text="loading" ref="table" :data="problemList"
        @row-dblclick="handleDblclick" style="width: 100%">
        <el-table-column width="100" prop="id" label="ID" align="center">
        </el-table-column>
        <el-table-column width="150" label="Display ID" align="center">
          <template slot-scope="{row}">
            <span v-show="!row.isEditing">{{ row.displayId }}</span>
            <el-input v-show="row.isEditing" v-model="row.displayId" @keyup.enter.native="handleInlineEdit(row)">

            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="Title" align="center">
          <template slot-scope="{row}">
            <span v-show="!row.isEditing">{{ row.title }}</span>
            <el-input v-show="row.isEditing" v-model="row.title" @keyup.enter.native="handleInlineEdit(row)">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="Author" align="center">
        </el-table-column>
        <el-table-column width="200" prop="create_time" label="Create Time" align="center">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column width="100" prop="visible" label="Visible" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.visible" active-text="" inactive-text="" @change="updateProblem(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operation" width="250" align="center">
          <div slot-scope="scope">
            <icon-btn name="Edit" icon="edit" @click.native="goEdit(scope.row.id)"></icon-btn>
            <icon-btn v-if="contestId" name="Make Public" icon="clone"
              @click.native="makeContestProblemPublic(scope.row.id)"></icon-btn>
            <icon-btn icon="download" name="Download TestCase" @click.native="downloadTestCase(scope.row.id)"></icon-btn>
            <icon-btn icon="trash" name="Delete Problem" @click.native="deleteProblem(scope.row.id)"></icon-btn>
          </div>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-button type="primary" size="small" @click="goCreateProblem" icon="el-icon-plus">Create
        </el-button>
        <el-button v-if="contestId" type="primary" size="small" icon="el-icon-plus"
          @click="addProblemDialogVisible = true">Add From Public Problem
        </el-button>
        <el-pagination class="page" layout="prev, pager, next" @current-change="currentChange" :page-size="pageSize"
          :total="total">
        </el-pagination>
      </div>
    </Panel>
    <el-dialog title="Sure to update the problem? " width="20%" :visible.sync="InlineEditDialogVisible"
      @close-on-click-modal="false">
      <div>
        <p>DisplayID: {{ currentRow.diaplsyId }}</p>
        <p>Title: {{ currentRow.title }}</p>
      </div>
      <span slot="footer">
        <cancel @click.native="InlineEditDialogVisible = false; getProblemList(currentPage)"></cancel>
        <save @click.native="updateProblem(currentRow)"></save>
      </span>
    </el-dialog>
    <el-dialog title="Add Contest Problem" v-if="contestId" width="80%" :visible.sync="addProblemDialogVisible"
      @close-on-click-modal="false">
      <add-problem-component :contestId="contestId" @on-change="getProblemList"></add-problem-component>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api.js'
import utils from '@/utils/utils'
import AddProblemComponent from './AddPublicProblem.vue'

export default {
  name: 'ProblemList',
  components: {
    AddProblemComponent
  },
  data() {
    return {
      pageSize: 10,
      total: 0,
      problemList: [],
      keyword: '',
      loading: false,
      currentPage: 1,
      routeName: '',
      contestId: '',
      // for make public use
      currentProblemID: '',
      currentRow: {},
      InlineEditDialogVisible: false,
      makePublicDialogVisible: false,
      addProblemDialogVisible: false
    }
  },
  mounted() {
    this.routeName = this.$route.name
    this.contestId = this.$route.params.contestId
    this.getProblemList(this.currentPage)
  },
  methods: {
    handleDblclick(row) {
      row.isEditing = true
    },
    goEdit(problemId) {
      if (this.routeName === 'problem-list') {
        this.$router.push({ name: 'edit-problem', params: { problemId } })
      } else if (this.routeName === 'contest-problem-list') {
        this.$router.push({ name: 'edit-contest-problem', params: { problemId: problemId, contestId: this.contestId } })
      }
    },
    goCreateProblem() {
      if (this.routeName === 'problem-list') {
        this.$router.push({ name: 'create-problem' })
      } else if (this.routeName === 'contest-problem-list') {
        this.$router.push({ name: 'create-contest-problem', params: { contestId: this.contestId } })
      }
    },
    // 切换页码回调
    currentChange(page) {
      this.currentPage = page
      this.getProblemList(page)
    },
    getProblemList(page = 1) {
      this.loading = true
      let funcName = this.routeName === 'problem-list' ? 'getProblemList' : 'getContestProblemList'
      let params = {
        limit: this.pageSize,
        page: page,
        keyword: this.keyword,
        contestId: this.contestId
      }
      api[funcName](params).then(res => {
        this.loading = false
        this.total = res.data.data.totalRow
        for (let problem of res.data.data.records) {
          problem.isEditing = false
        }
        this.problemList = res.data.data.records
      }, res => {
        this.loading = false
      })
    },
    deleteProblem(id) {
      this.$confirm('Sure to delete this problem? The associated submissions will be deleted as well.', 'Delete Problem', {
        type: 'warning'
      }).then(() => {
        let funcName = this.routeName === 'problem-list' ? 'deleteProblem' : 'deleteContestProblem'
        api[funcName](id).then(() => {
          if (this.problemList.length === 1&&this.total!==1) {
            this.currentPage = this.currentPage - 1
          }
          this.getProblemList(this.currentPage)
        }).catch(() => {
        })
      }, () => {
      })
    },
    makeContestProblemPublic(problemId) {
      this.$prompt('Please input display id for the public problem', 'confirm').then(({ value }) => {
        api.makeContestProblemPublic({ id: problemId, displayId: value }).catch()
      }, () => {
      })
    },
    updateProblem(row) {
      let data = Object.assign({}, row)
      let funcName = ''
      if (this.contestId) {
        data.contestId = this.contestId
        funcName = 'editContestProblem'
      } else {
        funcName = 'editProblem'
      }
      api[funcName](data).then(res => {
        this.InlineEditDialogVisible = false
        this.getProblemList(this.currentPage)
      }).catch(() => {
        this.InlineEditDialogVisible = false
      })
    },
    handleInlineEdit(row) {
      this.currentRow = row
      this.InlineEditDialogVisible = true
    },
    downloadTestCase(problemId) {
      let url = '/problem/test_case?problemId=' + problemId
      utils.downloadFile(url)
    },
    getPublicProblem() {
      api.getProblemList()
    }
  },
  watch: {
    '$route'(newVal, oldVal) {
      this.contestId = newVal.params.contestId
      this.routeName = newVal.name
      this.getProblemList(this.currentPage)
    },
    'keyword'() {
      this.currentChange()
    }
  }
}
</script>

<style scoped lang="less"></style>
