<template>
  <Row type="flex">
    <Col :span="24">
    <Panel id="contest-card" shadow>
      <div slot="title">{{ query.ruleType === '' ? this.$i18n.t('m.All') : query.ruleType }} {{ $t('m.Contests') }}
      </div>
      <div slot="extra">
        <ul class="filter">
          <li>
            <Dropdown @on-click="onRuleChange">
              <span>{{ query.ruleType === '' ? this.$i18n.t('m.Rule') : this.$i18n.t('m.' + query.ruleType) }}
                <Icon type="md-arrow-dropdown"></Icon>
              </span>
              <Dropdown-menu slot="list">
                <Dropdown-item name="">{{ $t('m.All') }}</Dropdown-item>
                <Dropdown-item name="OI">{{ $t('m.OI') }}</Dropdown-item>
                <Dropdown-item name="ACM">{{ $t('m.ACM') }}</Dropdown-item>
              </Dropdown-menu>
            </Dropdown>
          </li>
          <li>
            <Dropdown @on-click="onStatusChange">
              <span>{{ query.status === '' ? this.$i18n.t('m.Status') : this.$i18n.t('m.' +
                CONTEST_STATUS_REVERSE[query.status].name.replace(/ /g, "_")) }}
                <Icon type="md-arrow-dropdown"></Icon>
              </span>
              <Dropdown-menu slot="list">
                <Dropdown-item name="">{{ $t('m.All') }}</Dropdown-item>
                <Dropdown-item name="0">{{ $t('m.Underway') }}</Dropdown-item>
                <Dropdown-item name="1">{{ $t('m.Not_Started') }}</Dropdown-item>
                <Dropdown-item name="-1">{{ $t('m.Ended') }}</Dropdown-item>
              </Dropdown-menu>
            </Dropdown>
          </li>
          <li>
            <Input id="keyword" @on-enter="changeRoute" @on-click="changeRoute" v-model="query.keyword"
              placeholder="Keyword" />
          </li>
        </ul>
      </div>
      <p id="no-contest" v-if="contests.length == 0">{{ $t('m.No_contest') }}</p>
      <ol id="contest-list">
        <li v-for="contest in contests" :key="contest.title">
          <Row type="flex" justify="space-between" align="middle">
            <img class="trophy" src="../../../../assets/Cup.png" />
            <Col :span="18" class="contest-main">
            <p class="title">
              <a class="entry" @click.stop="goContest(contest)">
                {{ contest.title }}
              </a>
              <template v-if="contest.contestType != 'Public'">
                <Icon type="ios-lock-outline" size="20"></Icon>
              </template>
            </p>
            <ul class="detail">
              <li>
                <Icon type="md-calendar" color="#3091f2"></Icon>
                {{ contest.startTime }}
              </li>
              <li>
                <Icon type="md-time" color="#3091f2"></Icon>
                {{ getDuration(contest.startTime, contest.endTime) }}
              </li>
              <li>
                <Button size="small" shape="circle" @click="onRuleChange(contest.ruleType)">
                  {{ contest.ruleType }}
                </Button>
              </li>
            </ul>
            </Col>
            <Col :span="4" style="text-align: center">
            <Tag type="dot" :color="CONTEST_STATUS_REVERSE[contest.status].color">{{ $t('m.' +
              CONTEST_STATUS_REVERSE[contest.status].name.replace(/ /g, "_")) }}</Tag>
            </Col>
          </Row>
        </li>
      </ol>
    </Panel>
    <Pagination :total="total" :page-size.sync="limit" @on-change="changeRoute" :current.sync="page" :show-sizer="true"
      @on-page-size-change="changeRoute"></Pagination>
    </Col>
  </Row>
</template>

<script>
import api from '@oj/api'
import { mapGetters } from 'vuex'
import utils from '@/utils/utils'
import Pagination from '@/pages/oj/components/Pagination'
import time from '@/utils/time'
import { CONTEST_STATUS_REVERSE, CONTEST_TYPE } from '@/utils/constants'

const limit = 10

export default {
  name: 'contest-list',
  components: {
    Pagination
  },
  data() {
    return {
      page: 1,
      query: {
        status: '',
        keyword: '',
        ruleType: ''
      },
      limit: limit,
      total: 0,
      rows: '',
      contests: [],
      CONTEST_STATUS_REVERSE: CONTEST_STATUS_REVERSE,
      //      for password modal use
      curContestId: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    api.getContestList(1, limit).then((res) => {
      next((vm) => {
        vm.contests = res.data.data.records
        vm.total = res.data.data.totalRow
      })
    }, (res) => {
      next()
    })
  },
  methods: {
    init() {
      let route = this.$route.query
      this.query.status = route.status || ''
      this.query.ruleType = route.ruleType || ''
      this.query.keyword = route.keyword || ''
      this.page = parseInt(route.page) || 1
      this.limit = parseInt(route.limit) || 10
      this.getContestList(this.page)
    },
    getContestList(page = 1) {
      api.getContestList(page, this.limit, this.query).then((res) => {
        this.contests = res.data.data.records
        this.total = res.data.data.totalRow
      })
    },
    changeRoute() {
      let query = Object.assign({}, this.query)
      query.page = this.page
      query.limit = this.limit

      this.$router.push({
        name: 'contest-list',
        query: utils.filterEmptyValue(query)
      })
    },
    onRuleChange(rule) {
      this.query.ruleType = rule
      this.page = 1
      this.changeRoute()
    },
    onStatusChange(status) {
      this.query.status = status
      this.page = 1
      this.changeRoute()
    },
    goContest(contest) {
      this.curContestId = contest.id
      if (contest.contestType !== CONTEST_TYPE.PUBLIC && !this.isAuthenticated) {
        this.$error(this.$i18n.t('m.Please_login_first'))
        this.$store.dispatch('changeModalStatus', { visible: true })
      } else {
        this.$router.push({ name: 'contest-details', params: { contestId: contest.id } })
      }
    },

    getDuration(startTime, endTime) {
      return time.duration(startTime, endTime)
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'user'])
  },
  watch: {
    '$route'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.init()
      }
    }
  }

}
</script>
<style lang="less" scoped>
#contest-card {
  #keyword {
    width: 80%;
    margin-right: 30px;
  }

  #no-contest {
    text-align: center;
    font-size: 16px;
    padding: 20px;
  }

  #contest-list {
    >li {
      padding: 20px;
      border-bottom: 1px solid rgba(187, 187, 187, 0.5);
      list-style: none;

      .trophy {
        height: 40px;
        margin-left: 10px;
        margin-right: -20px;
      }

      .contest-main {
        .title {
          font-size: 18px;

          a.entry {
            color: #495060;

            &:hover {
              color: #2d8cf0;
              border-bottom: 1px solid #2d8cf0;
            }
          }
        }

        li {
          display: inline-block;
          padding: 10px 0 0 10px;

          &:first-child {
            padding: 10px 0 0 0;
          }
        }
      }
    }
  }
}
</style>
