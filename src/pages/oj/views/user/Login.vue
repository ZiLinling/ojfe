<template>
  <div>
    <Form ref="formLogin" :model="formLogin" :rules="ruleLogin">
      <FormItem prop="username">
        <Input type="text" v-model="formLogin.username" :placeholder="$t('m.LoginUsername')" size="large"
          @on-enter="handleLogin">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="formLogin.password" :placeholder="$t('m.LoginPassword')" size="large"
          @on-enter="handleLogin">
        <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
    </Form>
    <div class="footer">
      <Button type="primary" @click="handleLogin" class="btn" long :loading="btnLoginLoading">
        {{ $t('m.UserLogin') }}
      </Button>
      <a v-if="website.allow_register" @click.stop="handleBtnClick('register')">{{ $t('m.No_Account') }}</a>
      <a @click.stop="goResetPassword" style="float: right">{{ $t('m.Forget_Password') }}</a>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import api from '@oj/api'
import { FormMixin } from '@oj/components/mixins'

export default {
  mixins: [FormMixin],
  data() {
    return {
      btnLoginLoading: false,
      formLogin: {
        username: '',
        password: '',
      },
      ruleLogin: {
        username: [
          { required: true, trigger: 'blur' },
        ],
        password: [
          { required: true, trigger: 'change', min: 6, max: 20 }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['changeModalStatus', 'getProfile', 'getToken']),
    handleBtnClick(mode) {
      this.changeModalStatus({
        mode,
        visible: true
      })
    },
    handleLogin() {
      this.validateForm('formLogin').then(valid => {
        this.btnLoginLoading = true
        let formData = Object.assign({}, this.formLogin)
        formData.password = this.$md5(this.$md5(formData.password))
        api.login(formData).then(res => {
          this.btnLoginLoading = false
          this.changeModalStatus({ visible: false })
          this.getToken(res.data.data)
          this.getProfile()
          this.$success(this.$i18n.t('m.Welcome_back'))
        }, _ => {
          this.btnLoginLoading = false
        })
      })
    },
    goResetPassword() {
      this.changeModalStatus({ visible: false })
      this.$router.push({ name: 'apply-reset-password' })
    }
  },
  computed: {
    ...mapGetters(['website', 'modalStatus']),
    visible: {
      get() {
        return this.modalStatus.visible
      },
      set(value) {
        this.changeModalStatus({ visible: value })
      }
    }
  }
}
</script>

<style scoped lang="less">
.footer {
  overflow: auto;
  margin-top: 20px;
  margin-bottom: -15px;
  text-align: left;

  .btn {
    margin: 0 0 15px 0;

    &:last-child {
      margin: 0;
    }
  }
}
</style>
