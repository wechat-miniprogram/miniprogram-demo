module.exports = Behavior({
    // 全局变量
    session: undefined, // 全局的VKsession对象
    canvas: undefined,  // canvas
    // XRFrame相关变量
    xrScene: undefined, // xr-frame 的场景
    xrCamera: undefined, // xr-frame 的相机
    xrFrameReady: undefined, // xr-frame初始化完毕
    // ThreeJs 相关变量
    gl: undefined,      // 全局gl对象
    THREE: undefined,   // THREE 对象
    camera: undefined,  // Three相机，主要相机
    // 全局 data
    data: {
        domWidth: 0,
        domHeight: 0,
        width: 0,       // canvas大小
        height: 0,      // canvas大小
        widthScale: 1,      // canvas宽度缩放值
        heightScale: 0.8,   // canvas高度缩放值
        cameraPosition: 0,  // 相机朝向
    },
    methods: {
        onReady() {
            // 获取canvas
            wx.createSelectorQuery()
                .select('#canvas')
                .node()
                .exec(res => {
                    this.canvas = res[0].node

                    // 运算画布大小
                    this.calcCanvasSize()

                    // 页面自定义初始化
                    if (this.init) this.init()
                })
        },
        calcCanvasSize () {
            const info = wx.getSystemInfoSync()
            const pixelRatio = info.pixelRatio;
            const width = info.windowWidth * this.data.widthScale * pixelRatio;
            const height = info.windowHeight * this.data.heightScale * pixelRatio;
            // 存在 webgl Canvas的情况下，写入大小
            if (this.canvas) {
                this.canvas.width = width;
                this.canvas.height = height;
            }
            console.log(`canvas size: width = ${width} , height = ${height}`)
            this.setData({
                width: width,
                height: height,
                domWidth: info.windowWidth * this.data.widthScale,
                domHeight: info.windowHeight * this.data.heightScale,
            });
        },
        // 前后摄像头
        switchCamera(event){
            if(this.session.config){
                const config = this.session.config
                let pos = Number(event.currentTarget.dataset.value)
                config.cameraPosition = pos
                this.session.config = config
                this.setData({
                    cameraPosition:event.currentTarget.dataset.value
                })
            }
        },
        // 限帧逻辑
        initLoop() {
            // 限制调用帧率,暂时去掉
            let fps = 30

            const session = this.session;

            // 逐帧渲染
            const onFrame = timestamp => {
                try {
                    this.loop()
                }catch(e) {
                    console.error(e);
                }
                session.requestAnimationFrame(onFrame)
            }
            session.requestAnimationFrame(onFrame)
        },
    },
});