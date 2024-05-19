import Vue from 'vue'
import router from './router'
import axios from 'axios'
import utils from '@/utils/utils'
import store from '@/store'


Vue.prototype.$http = axios
axios.defaults.baseURL = '/api'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'

export default {
  // 登录
  login(username, password) {
    return ajax('user/login', 'post', {
      data: {
        username,
        password
      }
    })
  },
  logout() {
    return ajax('user/logout', 'get')
  },
  getProfile() {
    return ajax('profile', 'get')
  },
  // 获取公告列表
  getAnnouncementList(page, limit) {
    return ajax('announcement/admin/list', 'get', {
      params: {
        page,
        limit
      }
    })
  },
  // 删除公告
  deleteAnnouncement(id) {
    return ajax('announcement/admin/delete', 'delete', {
      params: {
        id
      }
    })
  },
  // 修改公告
  updateAnnouncement(data) {
    return ajax('announcement/admin/update', 'put', {
      data
    })
  },
  // 添加公告
  createAnnouncement(data) {
    return ajax('announcement/admin/save', 'post', {
      data
    })
  },
  // 获取用户列表
  getUserList(page, limit, keyword) {
    let params = { page, limit }
    if (keyword) {
      params.keyword = keyword
    }
    return ajax('user/list', 'get', {
      params: params
    })
  },
  // 获取单个用户信息
  getUser(id) {
    return ajax('user', 'get', {
      params: {
        id
      }
    })
  },
  // 编辑用户
  editUser(data) {
    return ajax('user', 'put', {
      data
    })
  },
  deleteUsers(id) {
    return ajax('user', 'delete', {
      params: {
        id
      }
    })
  },
  importUsers(data) {
    return ajax('user', 'post', {
      data
    })
  },
  generateUser(data) {
    return ajax('user/generate_user', 'post', {
      data
    })
  },
  getLanguages() {
    return ajax('config/languages', 'get')
  },
  getSMTPConfig() {
    return ajax('config/smtp', 'get')
  },
  createSMTPConfig(data) {
    return ajax('config/smtp', 'post', {
      data
    })
  },
  editSMTPConfig(data) {
    return ajax('config/smtp', 'put', {
      data
    })
  },
  testSMTPConfig(email) {
    return ajax('config/smtp/test', 'post', {
      data: {
        email
      }
    })
  },
  getWebsiteConfig() {
    return ajax('config/website', 'get')
  },
  editWebsiteConfig(data) {
    return ajax('config/website', 'post', {
      data
    })
  },
  getJudgeServer() {
    return ajax('judgeServer', 'get')
  },
  deleteJudgeServer(hostname, ip) {
    return ajax('judgeServer', 'delete', {
      params: {
        hostname: hostname,
        ip: ip
      }
    })
  },
  updateJudgeServer(data) {
    return ajax('judgeServer', 'put', {
      data
    })
  },
  getInvalidTestCaseList() {
    return ajax('admin/prune_test_case', 'get')
  },
  pruneTestCase(id) {
    return ajax('admin/prune_test_case', 'delete', {
      params: {
        id
      }
    })
  },
  createContest(data) {
    return ajax('contest/admin/save', 'post', {
      data
    })
  },
  getContest(id) {
    return ajax('contest/admin/get', 'get', {
      params: {
        id
      }
    })
  },
  editContest(data) {
    return ajax('contest/admin/update', 'put', {
      data
    })
  },
  getContestList(page, limit, keyword) {
    let params = { page, limit }
    if (keyword) {
      params.keyword = keyword
    }
    return ajax('contest/admin/list', 'get', {
      params: params
    })
  },
  getContestAnnouncementList(page, limit,contestId) {
    return ajax('announcement/admin/list', 'get', {
      params: { 
        page,
        limit,
        contestId: contestId
      }
    })
  },
  createContestAnnouncement(data) {
    return ajax('announcement/admin/save', 'post', {
      data
    })
  },
  deleteContestAnnouncement(id) {
    return ajax('announcement/admin/delete', 'delete', {
      params: {
        id
      }
    })
  },
  updateContestAnnouncement(data) {
    return ajax('announcement/admin/update', 'put', {
      data
    })
  },
  getProblemTagList(params) {
    return ajax('tag', 'get', {
      params
    })
  },
  compileSPJ(data) {
    return ajax('admin/compile_spj', 'post', {
      data
    })
  },
  createProblem(data) {
    return ajax('problem/admin/save', 'post', {
      data
    })
  },
  editProblem(data) {
    return ajax('problem/admin/update', 'put', {
      data
    })
  },
  deleteProblem(id) {
    return ajax('problem/admin/delete', 'delete', {
      params: {
        id
      }
    })
  },
  getProblem(id) {
    return ajax('problem/admin/get', 'get', {
      params: {
        id
      }
    })
  },
  getProblemList(params) {
    params = utils.filterEmptyValue(params)
    return ajax('problem/admin/list', 'get', {
      params
    })
  },
  getContestProblemList(params) {
    params = utils.filterEmptyValue(params)
    return ajax('problem/admin/list', 'get', {
      params
    })
  },
  getContestProblem(id) {
    return ajax('problem/admin/get', 'get', {
      params: {
        id
      }
    })
  },
  createContestProblem(data) {
    return ajax('problem/admin/save', 'post', {
      data
    })
  },
  editContestProblem(data) {
    return ajax('problem/admin/update', 'put', {
      data
    })
  },
  deleteContestProblem(id) {
    return ajax('problem/admin/delete', 'delete', {
      params: {
        id
      }
    })
  },
  makeContestProblemPublic(data) {
    return ajax('problem/contest/make_public', 'post', {
      data
    })
  },
  addProblemFromPublic(data) {
    return ajax('problem/contest/add_problem_from_public', 'post', {
      data
    })
  },
  getReleaseNotes() {
    return ajax('admin/versions', 'get')
  },
  getDashboardInfo() {
    return ajax('common/dashboard_info', 'get')
  },
  exportProblems(data) {
    return ajax('export_problem', 'post', {
      data
    })
  }
}

/**
 * @param url
 * @param method get|post|put|delete...
 * @param params like queryString. if a url is index?a=1&b=2, params = {a: '1', b: '2'}
 * @param data post data, use for method put|post
 * @returns {Promise}
 */
function ajax(url, method, options) {
  if (options !== undefined) {
    var { params = {}, data = {} } = options
  } else {
    params = data = {}
  }
  return new Promise((resolve, reject) => {
    axios({
      url,
      method,
      params,
      data
    }).then(res => {
      // API正常返回(status=20x), 是否错误通过有无error判断
      if (res.data.error !== null) {
        Vue.prototype.$error(res.data.message)
        reject(res)
        //如果后端返回Token过期，则需要重新登录
        if (res.data.message == "Token Expired") {
          store.dispatch('clearProfile')
          store.dispatch('clearToken')
        }
      } else {
        resolve(res)
        if (method !== 'get') {
          Vue.prototype.$success('Succeeded')
        }
      }
    }, res => {
      // API请求异常，一般为Server error 或 network error
      reject(res)
      Vue.prototype.$error(res.message)
    })
  })
}

axios.interceptors.request.use(
  config => {
    let token = store.state.token
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  });