<template>
  <div>
    <Form ref="formRegister" :model="formRegister" :rules="ruleRegister">
      <FormItem prop="username">
        <Input type="text" v-model="formRegister.username" :placeholder="$t('m.RegisterUsername')" size="large"
          @on-enter="handleRegister">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="email">
        <Input v-model="formRegister.email" :placeholder="$t('m.Email_Address')" size="large" @on-enter="handleRegister">
        <Icon type="ios-mail-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="formRegister.password" :placeholder="$t('m.RegisterPassword')" size="large"
          @on-enter="handleRegister">
        <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="passwordAgain">
        <Input type="password" v-model="formRegister.passwordAgain" :placeholder="$t('m.Password_Again')" size="large"
          @on-enter="handleRegister">
        <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="captcha" style="margin-bottom:10px">
        <div class="oj-captcha">
          <div class="oj-captcha-code">
            <Input v-model="formRegister.captcha" :placeholder="$t('m.Captcha')" size="large" @on-enter="handleRegister">
            <Icon type="ios-bulb-outline" slot="prepend"></Icon>
            </Input>
          </div>
          <div class="oj-captcha-img">
            <Button :disabled="btndisabled" @click="btnGetCaptcha">
              {{ btntext }}
            </Button>
          </div>
        </div>
      </FormItem>
    </Form>
    <div class="footer">
      <Button type="primary" @click="handleRegister" class="btn" long :loading="btnRegisterLoading">
        {{ $t('m.UserRegister') }}
      </Button>
      <Button type="default" @click="switchMode('login')" class="btn" long>
        {{ $t('m.Already_Registed') }}
      </Button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import api from '@oj/api'
import { FormMixin } from '@oj/components/mixins'

export default {
  mixins: [FormMixin],
  mounted() {
  },
  data() {
    const CheckUsernameNotExist = (rule, value, callback) => {
      api.checkUsernameOrEmail(value, undefined).then(res => {
        if (res.data.data.username === true) {
          callback(new Error(this.$i18n.t('m.The_username_already_exists')))
        } else {
          callback()
        }
      }, _ => callback())
    }
    const CheckEmailNotExist = (rule, value, callback) => {
      api.checkUsernameOrEmail(undefined, value).then(res => {
        if (res.data.data.email === true) {
          this.emailIsOk = false;
          callback(new Error(this.$i18n.t('m.The_email_already_exists')))
        } else {
          this.emailIsOk = true;
          callback()
        }
      }, _ => callback())
    }
    const CheckPassword = (rule, value, callback) => {
      if (this.formRegister.password !== '') {
        // 对第二个密码框再次验证
        this.$refs.formRegister.validateField('passwordAgain')
      }
      callback()
    }

    const CheckAgainPassword = (rule, value, callback) => {
      if (value !== this.formRegister.password) {
        callback(new Error(this.$i18n.t('m.password_does_not_match')))
      }
      callback()
    }

    return {
      btnRegisterLoading: false,
      btntext: "点击获取邮箱验证码",
      btndisabled: false,
      emailIsOk: false,
      formRegister: {
        username: '',
        password: '',
        passwordAgain: '',
        email: '',
        captcha: ''
      },
      ruleRegister: {
        username: [
          { required: true, trigger: 'blur' },
          { validator: CheckUsernameNotExist, trigger: 'blur' }
        ],
        email: [
          { required: true, type: 'email', trigger: 'blur' },
          { validator: CheckEmailNotExist, trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur', min: 6, max: 20 },
          { validator: CheckPassword, trigger: 'blur' }
        ],
        passwordAgain: [
          { required: true, validator: CheckAgainPassword, trigger: 'change' }
        ],
        captcha: [
          { required: true, trigger: 'blur', min: 6, max: 6 }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['changeModalStatus', 'getProfile']),
    switchMode(mode) {
      this.changeModalStatus({
        mode,
        visible: true
      })
    },
    btnGetCaptcha() {
      if (this.emailIsOk) {
        if (this.btndisabled) return;
        api.getCaptcha(this.formRegister.email);
        this.btndisabled = true;
        let n = 60;
        this.btntext = "剩余 " + n + "s";
        const run = setInterval(() => {
          n = n - 1;
          if (n < 0) {
            clearInterval(run);
          }
          this.btntext = "剩余 " + n + "s";
          if (this.btntext < "剩余 " + 0 + "s") {
            this.btndisabled = false;
            this.btntext = "重新获取";
          }
        }, 1000);
      }
    },
    handleRegister() {
      this.validateForm('formRegister').then(valid => {
        let formData = Object.assign({}, this.formRegister)
        delete formData['passwordAgain']
        this.btnRegisterLoading = true
        formData.password = this.$md5(this.$md5(formData.password))
        api.register(formData).then(res => {
          this.$success(this.$i18n.t('m.Thanks_for_registering'))
          this.switchMode('login')
          this.btnRegisterLoading = false
        }, _ => {
          this.formRegister.captcha = ''
          this.btnRegisterLoading = false
        })
      })
    }
  },
  computed: {
    ...mapGetters(['website', 'modalStatus'])

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
