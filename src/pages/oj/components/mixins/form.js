import api from '@oj/api'

export default {
  data () {
    return {
    }
  },
  methods: {
    validateForm (formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate(valid => {
          if (!valid) {
            this.$error('please validate the error fields')
          } else {
            resolve(valid)
          }
        })
      })
    }
  }
}
