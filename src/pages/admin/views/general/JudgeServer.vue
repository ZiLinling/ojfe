<template>
  <div class="view">
    <Panel :title="$t('m.Judge_Server_Token')">
      <code>{{ token }}</code>
    </Panel>
    <Panel :title="$t('m.Judge_Server_Info')">
      <el-table
        :data="servers"
        :default-expand-all="true"
        border>
        <el-table-column
          type="expand">
          <template slot-scope="props" >
            <div class="info">
              <p>{{$t('m.IP')}}:
              <el-tag type="success">{{ props.row.ip }}</el-tag>&nbsp;&nbsp;
              {{$t('m.Judger_Version')}}:
              <el-tag type="success">{{ props.row.judgerVersion }}</el-tag>
            </p>
            <p>{{$t('m.Service_URL')}}: <code>{{ props.row.serviceUrl }}</code></p>
            <p>{{$t('m.Last_Heartbeat')}}: {{ props.row.lastHeartbeat}}</p>
            <p>{{$t('m.Create_Time')}}: {{ props.row.createTime}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="Status">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === 'normal' ? 'success' : 'danger'">
              {{ scope.row.status === 'normal' ? 'Normal' : 'Abnormal' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="hostname"
          label="Hostname">
        </el-table-column>
        <el-table-column
          prop="taskNumber"
          label="Task Number">
        </el-table-column>
        <el-table-column
          prop="cpuCore"
          label="CPU Core">
        </el-table-column>
        <el-table-column
          prop="cpuUsage"
          label="CPU Usage">
          <template slot-scope="scope">{{ scope.row.cpuUsage }}%</template>
        </el-table-column>
        <el-table-column
          prop="memoryUsage"
          label="Memory Usage">
          <template slot-scope="scope">{{ scope.row.memoryUsage }}%</template>
        </el-table-column>
        <el-table-column label="Disabled">
          <template slot-scope="{row}">
            <el-switch v-model="row.isDisabled" @change="handleDisabledSwitch(row.id, row.isDisabled)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="Options">
          <template slot-scope="scope">
            <icon-btn name="Delete" icon="trash" @click.native="deleteJudgeServer(scope.row.hostname,scope.row.ip)"></icon-btn>
          </template>
        </el-table-column>
      </el-table>
    </Panel>
  </div>
</template>

<script>
  import api from '../../api.js'

  export default {
    name: 'JudgeServer',
    data () {
      return {
        servers: [],
        token: '',
        intervalId: -1
      }
    },
    mounted () {
      this.refreshJudgeServerList()
      this.intervalId = setInterval(() => {
        this.refreshJudgeServerList()
      }, 5000)
    },
    methods: {
      refreshJudgeServerList () {
        api.getJudgeServer().then(res => {
          this.servers = res.data.data
          this.token = res.data.data.token
        })
      },
      deleteJudgeServer (hostname,ip) {
        this.$confirm('If you delete this judge server, it can\'t be used until next heartbeat', 'Warning', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          api.deleteJudgeServer(hostname,ip).then(res =>
            this.refreshJudgeServerList()
          )
        }).catch(() => {
        })
      },
      handleDisabledSwitch (id, value) {
        let data = {
          id,
          isDisabled: value
        }
        api.updateJudgeServer(data).catch(() => {})
      }
    },
    beforeRouteLeave (to, from, next) {
      clearInterval(this.intervalId)
      next()
    }
  }
</script>

<style>

.el-table__expanded-cell[class*=cell] {
    padding: 20px 50px;
}

</style>
