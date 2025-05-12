// 获取留言列表
export function getCommentList() {
  return [
    {
      comment: '为了进一步优化小程序性能，提供更为接近原生的用户体验，我们在 WebView 渲染之外新增了一个渲染引擎 Skyline，其使用更精简高效的渲染管线，并带来诸多增强特性，让 Skyline 拥有更接近原生渲染的性能体验。',
      userName: 'binnie',
      userHeadImg: 'http://wx.qlogo.cn/mmhead/uI5pczeERTajXl904XSbHwAtGENC5ccKvo2F54sgYeqibHxOXNAFKdg/132',
      subCommentList: [
        {
          comment: '界面更不容易被逻辑阻塞，进一步减少卡顿。',
          userName: '拖拉机🚜',
          userHeadImg: 'https://res.wx.qq.com/op_res/0AG3_hOKnGAqBhAhBx_a__0nu3Q_hGgnBQgiQhJMqZrvroKqdtYXhcSUdlp59bXjx7qF-ddTwGCcB-AqzYmlrw',
          replyUserName: 'binnie'
        },
        {
          comment: '无需为每个页面新建一个 JS 引擎实例（WebView），减少了内存、时间开销。',
          userName: 'binnie',
          userHeadImg: 'http://wx.qlogo.cn/mmhead/uI5pczeERTajXl904XSbHwAtGENC5ccKvo2F54sgYeqibHxOXNAFKdg/132',
          replyUserName: '拖拉机🚜',
        },
        {
          comment: '框架可以在页面之间共享更多的资源，进一步减少运行时内存、时间开销。',
          userName: '拖拉机🚜',
          userHeadImg: 'https://res.wx.qq.com/op_res/0AG3_hOKnGAqBhAhBx_a__0nu3Q_hGgnBQgiQhJMqZrvroKqdtYXhcSUdlp59bXjx7qF-ddTwGCcB-AqzYmlrw',
          replyUserName: 'binnie'
        },
        {
          comment: '框架的代码之间无需再通过 JSBridge 进行数据交换，减少了大量通信时间开销。',
          userName: 'binnie',
          userHeadImg: 'http://wx.qlogo.cn/mmhead/uI5pczeERTajXl904XSbHwAtGENC5ccKvo2F54sgYeqibHxOXNAFKdg/132',
          replyUserName: '拖拉机🚜',
        }
      ]
    },
    {
      comment: 'Skyline 以性能为首要目标，因此特性上在满足基本需求的前提下进行了大幅精简，目前 Skyline 只实现了 CSS 特性的子集。在编码上，Skyline 与 WebView 模式保持一致，仍使用 WXML 和 WXSS 编写界面。在不采用 Skyline 新增特性的情况下，适配了 Skyline 的小程序在低版本或未支持 Skyline 的平台上可无缝自动退回到 WebView 渲染。',
      userName: '拖拉机🚜',
      userHeadImg: 'https://res.wx.qq.com/op_res/0AG3_hOKnGAqBhAhBx_a__0nu3Q_hGgnBQgiQhJMqZrvroKqdtYXhcSUdlp59bXjx7qF-ddTwGCcB-AqzYmlrw',
      subCommentList: [
        {
          comment: '基于 Worklet 机制的 动画模块，能够在渲染线程同步运行动画相关逻辑。',
          userName: '拖拉机🚜',
          userHeadImg: 'https://res.wx.qq.com/op_res/0AG3_hOKnGAqBhAhBx_a__0nu3Q_hGgnBQgiQhJMqZrvroKqdtYXhcSUdlp59bXjx7qF-ddTwGCcB-AqzYmlrw',
          replyUserName: 'binnie'
        },
        {
          comment: '基于 Worklet 机制的 手势系统。在渲染线程同步监听手势、执行手势相关逻辑；支持手势协商处理；',
          userName: '小苹果🍎',
          userHeadImg: 'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJBAK7KJg9KId_6N1-rJ4OyCCQoJGVMOaTabboo2viRucoxkPvHRkn2fVl6tectlzBg',
          replyUserName: 'binnie'
        },
        {
          comment: '基于 Worklet 机制的 自定义路由模块，支持实现自定义路由动画和交互。',
          userName: '流星雨',
          userHeadImg: 'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYf3q0W302-kseD8VxLKoItZ6HgneLkgpQSEMIgEKz_xVE7putZxs2YEYqB13Uh37_w',
          replyUserName: 'binnie'
        },
        {
          comment: '支持 跨页面共享元素，能够将上一个页面的元素“共享”到下一个页面，并伴随着过渡动画。',
          userName: '落日余晖',
          userHeadImg: 'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYYjda9Dp372N3T05q_nn3PgvoXBoReXvaXBfkthtXQLN7m5_YI6FoTre-xvJBDFLMA',
          replyUserName: 'binnie'
        },
      ]
    },
    {
      comment: 'Skyline 能很好地保持和原有架构的兼容性，基于 WebView 环境的小程序代码基本上无需任何改动即可直接在新的架构下运行。',
      userName: '小苹果🍎',
      userHeadImg: 'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJBAK7KJg9KId_6N1-rJ4OyCCQoJGVMOaTabboo2viRucoxkPvHRkn2fVl6tectlzBg',
      subCommentList: []
    },
    {
      comment: 'Skyline 支持了一些 Web 所缺失的但很重要的能力，以满足开发者实现更好的交互体验。',
      userName: 'binnie',
      userHeadImg: 'http://wx.qlogo.cn/mmhead/uI5pczeERTajXl904XSbHwAtGENC5ccKvo2F54sgYeqibHxOXNAFKdg/132',
      subCommentList: [

      ]
    },
    {
      comment: 'worklet 动画可以做到类原生动画般的体验。',
      userName: '流星雨',
      userHeadImg: 'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYf3q0W302-kseD8VxLKoItZ6HgneLkgpQSEMIgEKz_xVE7putZxs2YEYqB13Uh37_w',
      subCommentList: [
        {
          comment: '提供如 timing、spring 等常见动画方式的封装方法，开发者可自定义动画曲线，同时可对不同的动画类型进行组合、重复，形成交织动画。😄',
          userName: 'binnie',
          userHeadImg: 'http://wx.qlogo.cn/mmhead/uI5pczeERTajXl904XSbHwAtGENC5ccKvo2F54sgYeqibHxOXNAFKdg/132',
          replyUserName: '流星雨'
        }
      ]
    },
    {
      comment: 'Skyline 中 wxs 代码运行在 AppService 线程，而事件产生在 UI 线程，因此 wxs 动画 性能有所降低，为了提升小程序交互体验的效果，我们内置了一批手势组件。',
      userName: '落日余晖',
      userHeadImg: 'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYYjda9Dp372N3T05q_nn3PgvoXBoReXvaXBfkthtXQLN7m5_YI6FoTre-xvJBDFLMA',
      subCommentList: [
        {
          comment: '免去开发者监听 touch 事件，自行计算手势逻辑的复杂步骤；',
          userName: 'binnie',
          userHeadImg: 'http://wx.qlogo.cn/mmhead/uI5pczeERTajXl904XSbHwAtGENC5ccKvo2F54sgYeqibHxOXNAFKdg/132',
          replyUserName: '落日余晖'
        },
        {
          comment: '手势组件直接在 UI 线程响应，避免了传递到 JS 线程带来的延迟；',
          userName: '落日余晖',
          userHeadImg: 'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYYjda9Dp372N3T05q_nn3PgvoXBoReXvaXBfkthtXQLN7m5_YI6FoTre-xvJBDFLMA',
          replyUserName: 'binnie'
        }
      ]
    },
    {
      comment: '在连续的 Skyline 页面间跳转时，可实现自定义路由效果，路由动画的曲线、时长均可交由开发者控制。',
      userName: 'binnie',
      userHeadImg: 'http://wx.qlogo.cn/mmhead/uI5pczeERTajXl904XSbHwAtGENC5ccKvo2F54sgYeqibHxOXNAFKdg/132',
      subCommentList: []
    },
    {
      comment: '在连续的两个 Skyline 页面跳转时，可以将上一个页面的元素“共享”到下一个页面，并伴随着过渡动画。',
      userName: '绿意盎然',
      userHeadImg: 'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJH2f0R4uXyqnNGlrivO8cKbn0nz1DE_6s22rc91zluwIrqiAVZNREvCeVYAUS8aaZw',
      subCommentList: []
    },
  ]
}
