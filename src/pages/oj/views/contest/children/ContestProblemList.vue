<template>
  <div>
    <Panel>
      <div slot="title">{{ $t('m.Problems_List') }}</div>
      <Table v-if="contestRuleType == 'ACM' || OIContestRealTimePermission" :columns="ACMTableColumns" :data="problems"
        @on-row-click="goContestProblem" :no-data-text="$t('m.No_Problems')"></Table>
      <Table v-else :data="problems" :columns="OITableColumns" @on-row-click="goContestProblem"
        no-data-text="$t('m.No_Problems')"></Table>
    </Panel>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { ProblemMixin } from '@oj/components/mixins'

export default {
  name: 'ContestProblemList',
  mixins: [ProblemMixin],
  data() {
    return {
      ACMTableColumns: [
        {
          title: '#',
          key: 'displayId',
          sortType: 'asc',
          width: 150
        },
        {
          title: this.$i18n.t('m.Title'),
          key: 'title'
        },
        {
          title: this.$i18n.t('m.Total'),
          key: 'submissionNumber'
        },
        {
          title: this.$i18n.t('m.AC_Rate'),
          render: (h, params) => {
            return h('span', this.getACRate(params.row.acceptedNumber, params.row.submissionNumber))
          }
        }
      ],
      OITableColumns: [
        {
          title: '#',
          key: 'displayId',
          width: 150
        },
        {
          title: this.$i18n.t('m.Title'),
          key: 'title'
        }
      ]
    }
  },
  mounted() {
    this.getContestProblems()
  },
  methods: {
    getContestProblems() {
      this.$store.dispatch('getContestProblems').then(res => {
        if (this.isAuthenticated) {
          if (this.contestRuleType === 'ACM') {
            this.addStatusColumn(this.ACMTableColumns, res.data.data)
          } else if (this.OIContestRealTimePermission) {
            this.addStatusColumn(this.ACMTableColumns, res.data.data)
          }
        }
      })
    },
    goContestProblem(row) {
      let routeUrl = this.$router.resolve({
        name: 'contest-problem-details',
        params: {
          contestId: this.$route.params.contestId,
          problemId: row.displayId
        }
      });
      window.open(routeUrl.href, '_blank');
    }
  },
  computed: {
    ...mapState({
      problems: state => state.contest.contestProblems
    }),
    ...mapGetters(['isAuthenticated', 'contestRuleType', 'OIContestRealTimePermission'])
  }
}
</script>

<style scoped lang="less"></style>
