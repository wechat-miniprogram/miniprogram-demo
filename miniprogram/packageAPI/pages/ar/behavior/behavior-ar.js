import { createScopedThreejs } from 'threejs-miniprogram'
import { registerGLTFLoader } from '../loaders/gltf-loader'


module.exports = Behavior({
    // 全局变量
    canvas: undefined,  // canvas
    gl: undefined,      // 全局gl对象
    THREE: undefined,   // THREE 对象
    session: undefined, // 全局的VKsession对象
    camera: undefined,  // Three相机，主要相机
    // 全局 data
    data: {
        domWidth: 0,
        domHeight: 0,
        width: 1,       // canvas大小
        height: 1,      // canvas大小
        widthScale: 1,      // canvas宽度缩放值
        heightScale: 0.8,   // canvas高度缩放值
        cameraPosition: 0,  // 相机朝向
    },
    methods: {
        onReady() {
            // 获取canvas
            wx.createSelectorQuery()
                .select('#webgl')
                .node()
                .exec(res => {
                    this.canvas = res[0].node
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
            this.canvas.width = width;
            this.canvas.height = height;
            console.log(`canvas size: width = ${width} , height = ${height}`)
            this.setData({
                width,
                height,
                domWidth: info.windowWidth * this.data.widthScale,
                domHeight: info.windowHeight * this.data.heightScale,
            });
        },
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
        initTHREE() {
            const THREE = this.THREE = createScopedThreejs(this.canvas)
            registerGLTFLoader(THREE)

            // 相机
            this.camera = new THREE.PerspectiveCamera(50, 0.7, 0.1, 1000);

            // 场景
            const scene = this.scene = new THREE.Scene()

            // 光源
            const light1 = new THREE.HemisphereLight(0xffffff, 0x444444) // 半球光
            light1.position.set(0, 0.2, 0)
            scene.add(light1)
            const light2 = new THREE.DirectionalLight(0xffffff) // 平行光
            light2.position.set(0, 0.2, 0.1)
            scene.add(light2)

            // 渲染层
            const renderer = this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            })
            renderer.gammaOutput = true
            renderer.gammaFactor = 2.2
        },
        initLoop() {
            // 限制调用帧率
            let fps = 30
            let fpsInterval = 1000 / fps
            let last = Date.now()

            const session = this.session;

            // 逐帧渲染
            const onFrame = timestamp => {
                let now = Date.now()
                const mill = now - last
                // 经过了足够的时间
                if (mill > fpsInterval) {
                    last = now - (mill % fpsInterval); //校正当前时间
                    if (this.loop) {
                        // 执行循环
                        this.loop()
                    }
                }
                session.requestAnimationFrame(onFrame)
            }
            session.requestAnimationFrame(onFrame)
        },
    },
});