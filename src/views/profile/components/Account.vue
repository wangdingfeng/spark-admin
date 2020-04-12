<template>
  <el-form ref="dataForm" :rules="rules" :model="temp">
    <el-form-item label="用户名称" prop="name">
      <el-input v-model.trim="temp.name" type="text" />
    </el-form-item>
    <el-form-item label="新密码" prop="password">
      <el-input v-model.trim="temp.password" type="password" />
    </el-form-item>
    <el-form-item label="确认密码" prop="repassword">
      <el-input v-model.trim="temp.repassword" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="updateLoading" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updatetUserInfo } from '@/api/sys/user.js'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          repassword: ''
        }
      }
    }
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.temp.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      updateLoading: false,
      temp: {
        name: this.user.name,
        password: '',
        repassword: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        repassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.updateLoading = true
          updatetUserInfo({ password: this.temp.repassword }).then(response => {
            this.$message({
              message: '更新成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.updateLoading = false
          })
        }
      })
    }
  }
}
</script>
