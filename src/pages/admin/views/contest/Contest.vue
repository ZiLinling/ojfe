<template>
  <div class="view">
    <Panel :title="title">
      <el-form label-position="top" ref="form" :model="contest">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="$t('m.ContestTitle')" required>
              <el-input v-model="contest.title" :placeholder="$t('m.ContestTitle')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.ContestDescription')" required>
              <Simditor v-model="contest.description"></Simditor>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_Start_Time')" required>
              <el-date-picker v-model="contest.startTime" type="datetime" :placeholder="$t('m.Contest_Start_Time')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_End_Time')" required>
              <el-date-picker v-model="contest.endTime" type="datetime" :placeholder="$t('m.Contest_End_Time')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_Password')">
              <el-input v-model="contest.password" :placeholder="$t('m.Contest_Password')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_Rule_Type')">
              <el-radio class="radio" v-model="contest.ruleType" label="ACM" :disabled="disableRuleType">ACM</el-radio>
              <el-radio class="radio" v-model="contest.ruleType" label="OI" :disabled="disableRuleType">OI</el-radio>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item :label="$t('m.Real_Time_Rank')">
              <el-switch v-model="contest.realTimeRank" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_Status')">
              <el-switch v-model="contest.visible" active-text="" inactive-text="">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.Allowed_IP_Ranges')">
              <div v-for="(range, index) in contest.allowedIpRanges" :key="index">
                <el-row :gutter="20" style="margin-bottom: 15px">
                  <el-col :span="8">
                    <el-input v-model="range.value" :placeholder="$t('m.CIDR_Network')"></el-input>
                  </el-col>
                  <el-col :span="10">
                    <el-button plain icon="el-icon-fa-plus" @click="addIPRange"></el-button>
                    <el-button plain icon="el-icon-fa-trash" @click="removeIPRange(range)"></el-button>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <save @click.native="saveContest"></save>
    </Panel>
  </div>
</template>

<script>
import api from '../../api.js'
import Simditor from '../../components/Simditor.vue'
import moment from 'moment';

export default {
  name: 'CreateContest',
  components: {
    Simditor
  },
  data() {
    return {
      title: 'Create Contest',
      disableRuleType: false,
      contest: {
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        ruleType: 'ACM',
        password: '',
        realTimeRank: true,
        visible: true,
        allowedIpRanges: [{
          value: ''
        }]
      },
      reContest:{
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        ruleType: 'ACM',
        password: '',
        realTimeRank: true,
        visible: true,
        allowedIpRanges: [{
          value: ''
        }]
      }
    }
  },
  methods: {
    saveContest() {
      let funcName = this.$route.name === 'edit-contest' ? 'editContest' : 'createContest'
      let data = Object.assign({}, this.contest)
      let ranges = []
      for (let v of data.allowedIpRanges) {
        if (v.value !== '') {
          ranges.push(v.value)
        }
      }
      data.allowedIpRanges = ranges
      //将时间格式化'YYYY-MM-DD HH24:MI:SS'
      data.startTime = moment(data.startTime).format('YYYY-MM-DD HH:mm:ss')
      data.endTime = moment(data.endTime).format('YYYY-MM-DD HH:mm:ss')
      api[funcName](data).then(res => {
        this.$router.push({ name: 'contest-list', query: { refresh: 'true' } })
      }).catch(() => {
      })
    },
    addIPRange() {
      this.contest.allowedIpRanges.push({ value: '' })
    },
    removeIPRange(range) {
      let index = this.contest.allowedIpRanges.indexOf(range)
      if (index !== -1) {
        this.contest.allowedIpRanges.splice(index, 1)
      }
    }
  },
  mounted() {
    if (this.$route.name === 'edit-contest') {
      this.title = 'Edit Contest'
      this.disableRuleType = true
      api.getContest(this.$route.params.contestId).then(res => {
        let data = res.data.data
        let ranges = []
        for (let v of data.allowedIpRanges) {
          ranges.push({ value: v })
        }
        if (ranges.length === 0) {
          ranges.push({ value: '' })
        }
        data.allowedIpRanges = ranges
        this.contest = data
      }).catch(() => {
      })
    }
  },
  watch: {
    '$route'() {
      this.$refs.form.resetFields()
      this.contest = this.reContest
      this.disableRuleType=false
    },
  }
}
</script>
