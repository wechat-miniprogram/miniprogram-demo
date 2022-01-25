import CustomPage from '../../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'form',
      path: 'page/weui/example/form/form'
    }
  },
  data: {
    showTopTips: false,

    radioItems: [
      {name: 'cell standard', value: '0', checked: true},
      {name: 'cell standard', value: '1'}
    ],
    checkboxItems: [
      {name: 'standard is dealt for u.', value: '0', checked: true},
      {name: 'standard is dealicient for u.', value: '1'}
    ],
    items: [
      {name: 'USA', value: '美国'},
      {name: 'CHN', value: '中国', checked: 'true'},
      {name: 'BRA', value: '巴西'},
      {name: 'JPN', value: '日本'},
      {name: 'ENG', value: '英国'},
      {name: 'TUR', value: '法国'},
    ],

    date: '2016-09-01',
    time: '12:01',

    countryCodes: ['+86', '+80', '+84', '+87'],
    countryCodeIndex: 0,

    countries: ['中国', '美国', '英国'],
    countryIndex: 0,

    accounts: ['微信号', 'QQ', 'Email'],
    accountIndex: 0,

    isAgree: false,
    formData: {

    },
    rules: [{
      name: 'radio',
      rules: {required: false, message: '单选列表是必选项'},
    }, {
      name: 'checkbox',
      rules: {required: true, message: '多选列表是必选项'},
    }, {
      name: 'name',
      rules: {required: true, message: '请输入姓名'},
    }, {
      name: 'qq',
      rules: {required: true, message: 'qq必填'},
    }, {
      name: 'mobile',
      rules: [{required: true, message: 'mobile必填'}, {mobile: true, message: 'mobile格式不对'}],
    }, {
      name: 'vcode',
      rules: {required: true, message: '验证码必填'},
    }, {
      name: 'idcard',
      rules: {
        validator(rule, value) {
          if (!value || value.length !== 18) {
            return 'idcard格式不正确'
          }
          return ''
        }
      },
    }]
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    const radioItems = this.data.radioItems
    for (let i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value === e.detail.value
    }

    this.setData({
      radioItems,
      'formData.radio': e.detail.value
    })
  },
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)

    const checkboxItems = this.data.checkboxItems; const
      values = e.detail.value
    for (let i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value === values[j]) {
          checkboxItems[i].checked = true
          break
        }
      }
    }

    this.setData({
      checkboxItems,
      'formData.checkbox': e.detail.value
    })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value,
      'formData.date': e.detail.value
    })
  },
  formInputChange(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindCountryCodeChange(e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value)

    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  bindCountryChange(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value)

    this.setData({
      countryIndex: e.detail.value
    })
  },
  bindAccountChange(e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value)

    this.setData({
      accountIndex: e.detail.value
    })
  },
  bindAgreeChange(e) {
    this.setData({
      isAgree: !!e.detail.value.length
    })
  },
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })
        }
      } else {
        wx.showToast({
          title: '校验通过'
        })
      }
    })
    // this.selectComponent('#form').validateField('mobile', (valid, errors) => {
    //     console.log('valid', valid, errors)
    // })
  }

})
