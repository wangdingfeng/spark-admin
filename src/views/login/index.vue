<template>
  <div class="login-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="12" :lg="16" :xl="16">
        <div style="color: transparent;">占位符</div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <el-form
          ref="loginForm"
          auto-complete="on"
          :model="loginForm"
          :rules="loginRules"
          label-position="left"
          label-width="0px"
          class="card-box login-form"
        >
          <div class="title">
            <svg-icon icon-class="sparkler" />hello !
          </div>
          <div class="title-tips">欢迎来到Spark平台！</div>
          <el-form-item prop="username" class="login-form-admin">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              v-model="loginForm.username"
              name="username"
              type="text"
              auto-complete="off"
              placeholder="请输入用户名"
              tabindex="1"
            />
          </el-form-item>
          <el-form-item prop="password" class="login-form-pass">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              v-model="loginForm.password"
              name="password"
              :type="pwdType"
              placeholder="请输入密码"
              auto-complete="off"
              tabindex="2"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon icon-class="eye" />
            </span>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="width:100%;"
              :loading="loading"
              size="default"
              @click.native.prevent="handleLogin"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请填写用户名' }
        ],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.loading = false
              this.$router.push({ path: '/' })
              this.$message({
                message: '登录成功，请使用',
                type: 'success'
              })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$base-color-default: #1890ff;
$base-z-index: 999;

$base-font-size-default: 14px;
$base-font-size-small: 12px;
$base-input-height: 32px;

$base-color-white: #fff;
$base-color-red: #ff4d4f;
$base-color-blue: $base-color-default;
$base-font-color: #606266;

.login-container {
  height: 100vh;
  min-height: 600px;
  background: url('~@/assets/background.jpg') center center fixed no-repeat;
  background-size: cover;

  .title {
    height: 50px;
    font-size: 54px;
    font-weight: 500;
    color: rgba(14, 18, 26, 1);
  }

  .title-tips {
    height: 24px;
    margin-top: 29px;
    font-size: 26px;
    font-weight: 400;
    color: rgba(14, 18, 26, 1);
  }

  .login-btn {
    display: inherit;
    width: 220px;
    height: 60px;
    margin-top: 5px;
    border: 0;

    &:hover {
      opacity: 0.9;
    }
  }

  .login-logo-bysj {
    position: absolute;
    top: 45px;
    left: 45px;

    img {
      width: 180px;
    }
  }

  .login-form {
    position: relative;
    max-width: 100%;
    margin: 22vh 10% 10%;
    overflow: hidden;

    .forget-password {
      width: 100%;
      margin-top: 40px;
      text-align: left;

      .forget-pass {
        width: 129px;
        height: 19px;
        font-size: 20px;
        font-weight: 400;
        color: rgba(92, 102, 240, 1);
      }
    }
  }

  .tips {
    margin-bottom: 10px;
    font-size: $base-font-size-default;
    color: $base-color-white;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      margin: 0 auto 40px auto;
      font-size: 34px;
      font-weight: bold;
      color: $base-color-blue;
      text-align: center;
    }
  }

  .svg-container {
    position: absolute;
    top: 14px;
    left: 15px;
    z-index: $base-z-index;
    font-size: 16px;
    color: #d7dee3;
    cursor: pointer;
    user-select: none;
  }

  .show-pwd {
    position: absolute;
    top: 14px;
    right: 25px;
    font-size: 16px;
    color: $base-font-color;
    cursor: pointer;
    user-select: none;
  }

  .el-form-item {
    padding-right: 0;
    margin: 20px 0;
    color: #454545;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 2px;

    &__content {
      min-height: $base-input-height;
      line-height: $base-input-height;
    }

    &__error {
      position: absolute;
      top: 100%;
      left: 18px;
      font-size: $base-font-size-small;
      line-height: 18px;
      color: $base-color-red;
    }
  }

  .el-input {
    box-sizing: border-box;

    input {
      height: 58px;
      padding-left: 45px;
      font-size: $base-font-size-default;
      line-height: 58px;
      color: $base-font-color;
      background: #f6f4fc;
      border: 0;
      caret-color: $base-font-color;
    }
  }
}
</style>
