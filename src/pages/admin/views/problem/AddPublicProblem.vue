<template>
  <div>
    <el-input v-model="keyword" placeholder="Keywords" prefix-icon="el-icon-search">
    </el-input>
    <el-table :data="problems" v-loading="loading">
      <el-table-column label="ID" width="100" prop="id" align="center">
      </el-table-column>
      <el-table-column label="DisplayID" width="200" prop="displayId" align="center">
      </el-table-column>
      <el-table-column label="Title" prop="title" align="center">
      </el-table-column>
      <el-table-column label="option" align="center" width="100" fixed="right">
        <template slot-scope="{row}">
          <icon-btn icon="plus" name="Add the problem" @click.native="handleAddProblem(row.id)"></icon-btn>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="page" layout="prev, pager, next" @current-change="getPublicProblem" :page-size="limit"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import api from '@admin/api'

  export default {
    name: 'add-problem-from-public',
    props: ['contestId'],
    data () {
      return {
        page: 1,
        limit: 10,
        total: 0,
        loading: false,
        problems: [],
        contest: {},
        keyword: ''
      }
    },
    mounted () {
      api.getContest(this.contestId).then(res => {
        this.contest = res.data.data
        this.getPublicProblem(1)
      }).catch(() => {
      })
    },
    methods: {
      getPublicProblem (page) {
        this.loading = true
        let params = {
          keyword: this.keyword,
          page:page,
          limit: this.limit,
          ruleType: this.contest.ruleType
        }
        api.getProblemList(params).then(res => {
          this.loading = false
          this.total = res.data.data.totalRow
          this.problems = res.data.data.records
        }).catch(() => {
        })
      },
      handleAddProblem (problemId) {
        this.$prompt('Please input display id for the contest problem', 'confirm').then(({value}) => {
          let data = {
            problemId: problemId,
            contestId: this.contestId,
            displayId: value
          }
          api.addProblemFromPublic(data).then(() => {
            this.$emit('on-change')
          }, () => {
          })
        }, () => {
        })
      }
    },
    watch: {
      'keyword' () {
        this.getPublicProblem(this.page)
      }
    }
  }
</script>
<style scoped>
.page {
  margin-top: 20px;
  text-align: right
}
</style>
