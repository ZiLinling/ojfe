<template>
  <div>
    <component :is="currentView"></component>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { types } from '../../../../../store'
  import ACMContestRank from './ACMContestRank.vue'
  import OIContestRank from './OIContestRank.vue'


  export default {
    name: 'contest-rank',
    components: {
      ACMContestRank,
      OIContestRank,
    },
    computed: {
      ...mapGetters(['contestRuleType']),
      currentView () {
        return this.contestRuleType === 'ACM' ? 'ACMContestRank' : 'OIContestRank'
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.commit(types.CHANGE_CONTEST_ITEM_VISIBLE, {menu: true})
      next()
    }
  }
</script>
<style lang="less" scoped>
</style>
