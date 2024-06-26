<template>
  <div class="announcement view">
    <Panel :title="$t('m.General_Announcement')">
      <div class="list">
        <el-table v-loading="loading" element-loading-text="loading" ref="table" :data="announcementList"
          style="width: 100%">
          <el-table-column width="100" prop="id" label="ID" align="center">
          </el-table-column>
          <el-table-column prop="title" label="Title" align="center">
          </el-table-column>
          <el-table-column prop="createTime" label="CreateTime">
          </el-table-column>
          <el-table-column prop="lastUpdateTime" label="LastUpdateTime" align="center">
          </el-table-column>
          <el-table-column prop="creator" label="Creator" align="center">
          </el-table-column>
          <el-table-column width="100" prop="visible" label="Visible" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.visible" active-text="" inactive-text=""
                @change="handleVisibleSwitch(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Option" width="200" align="center">
            <div slot-scope="scope">
              <icon-btn name="Edit" icon="edit" @click.native="openAnnouncementDialog(scope.row.id)"></icon-btn>
              <icon-btn name="Delete" icon="trash" @click.native="deleteAnnouncement(scope.row.id)"></icon-btn>
            </div>
          </el-table-column>
        </el-table>
        <div class="panel-options">
          <el-button type="primary" size="small" @click="openAnnouncementDialog(null)"
            icon="el-icon-plus">Create</el-button>
          <el-pagination class="page" layout="prev, pager, next" @current-change="currentChange"
            :page-size="pageSize" :total="total">
          </el-pagination>
        </div>
      </div>
    </Panel>
    <!--对话框-->
    <el-dialog :title="announcementDialogTitle" :visible.sync="showEditAnnouncementDialog" @open="onOpenEditDialog"
      :close-on-click-modal="false">
      <el-form label-position="top">
        <el-form-item :label="$t('m.Announcement_Title')" required>
          <el-input v-model="announcement.title" :placeholder="$t('m.Announcement_Title')" class="title-input">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('m.Announcement_Content')" required>
          <Simditor v-model="announcement.content"></Simditor>
        </el-form-item>
        <div class="visible-box">
          <span>{{ $t('m.Announcement_visible') }}</span>
          <el-switch v-model="announcement.visible" active-text="" inactive-text="">
          </el-switch>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <cancel @click.native="showEditAnnouncementDialog = false"></cancel>
        <save type="primary" @click.native="submitAnnouncement"></save>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Simditor from '../../components/Simditor.vue'
import api from '../../api.js'

export default {
  name: 'Announcement',
  components: {
    Simditor
  },
  data() {
    return {
      contestId: '',
      // 显示编辑公告对话框
      showEditAnnouncementDialog: false,
      // 公告列表
      announcementList: [],
      // 一页显示的公告数
      pageSize: 15,
      // 总公告数
      total: 0,
      // 当前公告id
      currentAnnouncementId: null,
      mode: 'create',
      // 公告 (new | edit) model
      announcement: {
        title: '',
        visible: true,
        content: ''
      },
      // 对话框标题
      announcementDialogTitle: 'Edit Announcement',
      // 是否显示loading
      loading: true,
      // 当前页码
      currentPage: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.contestId = this.$route.params.contestId
      if (this.contestId) {
        this.getContestAnnouncementList(1)
      } else {
        this.getAnnouncementList(1)
      }
    },
    // 切换页码回调
    currentChange(page) {
      this.currentPage = page
      this.getAnnouncementList(page)
    },
    getAnnouncementList(page) {
      this.loading = true
      api.getAnnouncementList(page, this.pageSize).then(res => {
        this.loading = false
        this.total = res.data.data.totalRow
        this.announcementList = res.data.data.records
      }, res => {
        this.loading = false
      })
    },
    getContestAnnouncementList(page) {
      this.loading = true
      api.getContestAnnouncementList(page, this.pageSize,this.contestId).then(res => {
        this.loading = false
        this.total = res.data.data.totalRow
        this.announcementList = res.data.data.records
      }).catch(() => {
        this.loading = false
      })
    },
    // 打开编辑对话框的回调
    onOpenEditDialog() {
      // todo 优化
      // 暂时解决 文本编辑器显示异常bug
      setTimeout(() => {
        if (document.createEvent) {
          let event = document.createEvent('HTMLEvents')
          event.initEvent('resize', true, true)
          window.dispatchEvent(event)
        } else if (document.createEventObject) {
          window.fireEvent('onresize')
        }
      }, 0)
    },
    // 提交编辑
    // 默认传入MouseEvent
    submitAnnouncement(data = undefined) {
      let funcName = ''
      if (!data.title) {
        data = {
          id: this.currentAnnouncementId,
          title: this.announcement.title,
          content: this.announcement.content,
          visible: this.announcement.visible
        }
      }
      if (this.contestId) {
        data.contestId = this.contestId
        funcName = this.mode === 'edit' ? 'updateContestAnnouncement' : 'createContestAnnouncement'
      } else {
        funcName = this.mode === 'edit' ? 'updateAnnouncement' : 'createAnnouncement'
      }
      api[funcName](data).then(res => {
        this.showEditAnnouncementDialog = false
        this.init()
      }).catch()
    },
    // 删除公告
    deleteAnnouncement(announcementId) {
      this.$confirm('Are you sure you want to delete this announcement?', 'Warning', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        // then 为确定
        this.loading = true
        let funcName = this.contestId ? 'deleteContestAnnouncement' : 'deleteAnnouncement'
        api[funcName](announcementId).then(res => {
          this.loading = true
          this.init()
        })
      }).catch(() => {
        // catch 为取消
        this.loading = false
      })
    },
    openAnnouncementDialog(id) {
      this.showEditAnnouncementDialog = true
      if (id !== null) {
        this.currentAnnouncementId = id
        this.announcementDialogTitle = this.$t('m.Edit_Announcement')
        this.announcementList.find(item => {
          if (item.id === this.currentAnnouncementId) {
            this.announcement.title = item.title
            this.announcement.visible = item.visible
            this.announcement.content = item.content
            this.mode = 'edit'
          }
        })
      } else {
        this.currentAnnouncementId = null
        this.announcementDialogTitle = this.$t('m.Create_Announcement')
        this.announcement.title = ''
        this.announcement.visible = true
        this.announcement.content = ''
        this.mode = 'create'
      }
    },

    handleVisibleSwitch(row) {
      this.mode = 'edit'
      this.submitAnnouncement({
        id: row.id,
        title: row.title,
        content: row.content,
        visible: row.visible
      })
    }
  },
  watch: {
    $route() {
      this.init()
    }
  }
}
</script>

<style lang="less" scoped>
.title-input {
  margin-bottom: 20px;
}

.visible-box {
  margin-top: 10px;
  width: 205px;
  float: left;
}
</style>
