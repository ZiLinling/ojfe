import Vue from 'vue'
import store from '@/store'
import axios from 'axios'

Vue.prototype.$http = axios
axios.defaults.baseURL = '/api'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'

export default {
  getWebsiteConf() {
    return ajax('config/website', 'get')
  },
  getAnnouncementList(page, limit) {
    let params = {
      page: page,
      limit: limit
    }
    return ajax('announcement/list', 'get', {
      params
    })
  },
  login(data) {
    return ajax('user/login', 'post', {
      data
    })
  },
  checkUsernameOrEmail(username, email) {
    return ajax('user/check_username_or_email', 'post', {
      data: {
        username,
        email
      }
    })
  },
  // 注册
  register(data) {
    return ajax('user/register', 'post', {
      data
    })
  },
  logout() {
    return ajax('user/logout', 'get')
  },
  getCaptcha(email) {
    return ajax('user/captcha', 'get', {
      params: {
        email
      }
    })
  },
  getUserInfo(username = undefined) {
    return ajax('profile', 'get', {
      params: {
        username
      }
    })
  },
  updateProfile(profile) {
    return ajax('profile/update', 'put', {
      data: profile
    })
  },
  freshDisplayID(userID) {
    return ajax('profile/fresh_display_id', 'get', {
      params: {
        user_id: userID
      }
    })
  },
  twoFactorAuth(method, data) {
    return ajax('two_factor_auth', method, {
      data
    })
  },
  tfaRequiredCheck(username) {
    return ajax('tfa_required', 'post', {
      data: {
        username
      }
    })
  },
  getSessions() {
    return ajax('sessions', 'get')
  },
  deleteSession(sessionKey) {
    return ajax('sessions', 'delete', {
      params: {
        session_key: sessionKey
      }
    })
  },
  applyResetPassword(data) {
    return ajax('apply_reset_password', 'post', {
      data
    })
  },
  resetPassword(data) {
    return ajax('reset_password', 'post', {
      data
    })
  },
  changePassword(data) {
    return ajax('change_password', 'post', {
      data
    })
  },
  changeEmail(data) {
    return ajax('change_email', 'post', {
      data
    })
  },
  getLanguages() {
    return ajax('config/languages', 'get')
  },
  getProblemTagList() {
    return ajax('tag/list', 'get')
  },
  getProblemList(searchParams) {
    return ajax('problem/list', 'get', {
      params: searchParams
    })
  },
  pickone() {
    return ajax('pickone', 'get')
  },
  getProblem(problemId) {
    return ajax('problem/get', 'get', {
      params: {
        displayId: problemId
      }
    })
  },
  getContestList(page, limit, searchParams) {
    let params = {
      page,
      limit
    }
    if (searchParams !== undefined) {
      Object.keys(searchParams).forEach((element) => {
        if (searchParams[element]) {
          params[element] = searchParams[element]
        }
      })
    }
    return ajax('contest/list', 'get', {
      params
    })
  },
  getContest(id) {
    return ajax('contest/get', 'get', {
      params: {
        id
      }
    })
  },
  getContestAccess(contestId) {
    return ajax('contest/access', 'get', {
      params: {
        contestId: contestId
      }
    })
  },
  checkContestPassword(contestId, password) {
    return ajax('contest/access', 'get', {
      params: {
        contestId: contestId,
        password
      }
    })
  },
  getContestAnnouncementList(contestId) {
    return ajax('announcement/list', 'get', {
      params: {
        contestId: contestId
      }
    })
  },
  getContestProblemList(contestId) {
    return ajax('problem/list', 'get', {
      params: {
        contestId: contestId
      }
    })
  },
  getContestProblem(problemId, contestId) {
    return ajax('problem/get', 'get', {
      params: {
        contestId: contestId,
        displayId: problemId
      }
    })
  },
  submitCode(data) {
    return ajax('submission', 'post', {
      data
    })
  },
  getSubmissionList(page, limit, params) {
    params.limit = limit
    params.page = page
    return ajax('submission/list', 'get', {
      params
    })
  },
  getContestSubmissionList(page, limit, params) {
    params.limit = limit
    params.page = page
    return ajax('submission/list', 'get', {
      params
    })
  },
  getSubmission(id) {
    return ajax('submission', 'get', {
      params: {
        id
      }
    })
  },
  submissionExists(problemId) {
    return ajax('submission/exist', 'get', {
      params: {
        problemId: problemId
      }
    })
  },
  submissionRejudge(id) {
    return ajax('admin/submission/rejudge', 'get', {
      params: {
        id
      }
    })
  },
  updateSubmission(data) {
    return ajax('submission/update', 'put', {
      data
    })
  },
  getUserRank(page, limit, rule = 'acm') {
    let params = {
      page,
      limit,
      rule
    }
    return ajax('profile/user_rank', 'get', {
      params
    })
  },
  getContestRank(params,rule) {
    if(rule==='ACM'){
      return ajax('acmContest/rank', 'get', {
        params
      })
    }else{
      return ajax('oiContest/rank', 'get', {
        params
      })
    }
  },
  getACMACInfo(params) {
    return ajax('admin/contest/acm_helper', 'get', {
      params
    })
  },
  updateACInfoCheckedStatus(data) {
    return ajax('admin/contest/acm_helper', 'put', {
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
        // if (method !== 'get') {
        //   Vue.prototype.$success('Succeeded')
        // }
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

// axios.interceptors.response.use(
//   config => {
//     console.log(config.data)
//     if (data.error !== null)
//       return Promise.reject(config.data);
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   });