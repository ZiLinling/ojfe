import utils from '@/utils/utils'

export default {
  data () {
    return {
      statusColumn: false
    }
  },
  methods: {
    getACRate (ACCount, TotalCount) {
      return utils.getACRate(ACCount, TotalCount)
    },
    addStatusColumn (tableColumns, dataProblems) {
      // 已添加过直接返回
      if (this.statusColumn) return
      // 只在有做题记录时才添加column
      let needAdd = dataProblems.some((item, index) => {
        if (item.myStatus !== null && item.myStatus !== undefined) {
          return true
        }
      })
      if (!needAdd) {
        return
      }
      tableColumns.splice(0, 0, {
        width: 60,
        title: ' ',
        render: (h, params) => {
          let status = params.row.myStatus
          if (status === null || status === undefined) {
            return undefined
          }
          return h('Icon', {
            props: {
              type: status === 0 ? 'md-checkmark' : 'md-remove',
              size: '16'
            },
            style: {
              color: status === 0 ? '#19be6b' : '#ed3f14'
            }
          })
        }
      })
      this.statusColumn = true
    }
  }
}
