import {
    createScopedThreejs
} from './threejs-miniprogram'
import {
    registerGLTFLoader
} from '../loaders/gltf-loader'

const info = wx.getSystemInfoSync()

export default function getBehavior() {
    return Behavior({
        data: {
            width: 1,
            height: 1,
            fps: 0,
            memory: 0,
            cpu: 0,
        },
        methods: {
            onReady() {
                wx.createSelectorQuery()
                    .select('#webgl')
                    .node()
                    .exec(res => {
                        this.canvas = res[0].node

                        const info = wx.getSystemInfoSync()
                        const pixelRatio = info.pixelRatio
                        const calcSize = (width, height) => {
                            console.log(`canvas size: width = ${width} , height = ${height}`)
                            this.canvas.width = width * pixelRatio
                            this.canvas.height = height * pixelRatio
                            this.setData({
                                width,
                                height,
                            })
                        }
                        calcSize(info.windowWidth, info.windowHeight * 0.8)

                        this.initVK()
                    })
            },
            onUnload() {
                if (this._texture) {
                    this._texture.dispose()
                    this._texture = null
                }
                if (this.renderer) {
                    this.renderer.dispose()
                    this.renderer = null
                }
                if (this.scene) {
                    this.scene.dispose()
                    this.scene = null
                }
                if (this.camera) this.camera = null
                if (this.model) this.model = null
                if (this._insertModel) this._insertModel = null
                if (this._insertModels) this._insertModels = null
                if (this.planeBox) this.planeBox = null
                if (this.mixers) {
                    this.mixers.forEach(mixer => mixer.uncacheRoot(mixer.getRoot()))
                    this.mixers = null
                }
                if (this.clock) this.clock = null

                if (this.THREE) this.THREE = null
                if (this._tempTexture && this._tempTexture.gl) {
                    this._tempTexture.gl.deleteTexture(this._tempTexture)
                    this._tempTexture = null
                }
                if (this._fb && this._fb.gl) {
                    this._fb.gl.deleteFramebuffer(this._fb)
                    this._fb = null
                }
                if (this._program && this._program.gl) {
                    this._program.gl.deleteProgram(this._program)
                    this._program = null
                }
                if (this.canvas) this.canvas = null
                if (this.gl) this.gl = null
                if (this.session) this.session = null
                if (this.textContentList) this.textContentList = []
            },
            initVK() {
                // 初始化 threejs
                this.initTHREE()

                // 自定义初始化
                if (this.init) this.init()

                console.log('this.gl', this.gl)

                const session = this.session = wx.createVKSession({
                    track: {
                        shoe: {
                          mode: 2
                        }
                    },
                    version: 'v1',
                    gl: this.gl
                })
                session.start(err => {
                    if (err) return console.error('VK error: ', err)

                    console.log('@@@@@@@@ VKSession.version', session.version)

                    const canvas = this.canvas

                    const calcSize = (width, height, pixelRatio) => {
                        console.log(`canvas size: width = ${width} , height = ${height}`)
                        this.canvas.width = width * pixelRatio
                        this.canvas.height = height * pixelRatio
                        this.setData({
                            width,
                            height,
                        })
                    }

                    session.on('resize', () => {
                        const info = wx.getSystemInfoSync()
                        calcSize(info.windowWidth, info.windowHeight * 0.8, info.pixelRatio)
                    })

                    session.on('addAnchors', anchors => {
                        console.log("anchor add")
                    })
                    session.on('updateAnchors', anchors => {
                        console.log(anchors)
                        this.data.anchor2DList = []
                        // 手动传入图像的时候用dom画点和框就行
                        this.setData({
                            anchor2DList: anchors.map(anchor => ({
                                points: anchor.points,
                                origin: anchor.origin,
                                size: anchor.size
                            })),
                        })
                    })
                    session.on('removeAnchors', anchors => {
                        console.log("anchor remove")
                    })

                    
                    //限制调用帧率
                    let fps = 30
                    let fpsInterval = 1000 / fps
                    let last = Date.now()

                    // 逐帧渲染
                    const onFrame = timestamp => {
                        let now = Date.now()
                        const mill = now - last
                        // 经过了足够的时间
                        if (mill > fpsInterval) {
                            last = now - (mill % fpsInterval); //校正当前时间
                            const frame = session.getVKFrame(canvas.width, canvas.height)
                            if (frame) {
                            this.render(frame)
                            }
                        }
                        session.requestAnimationFrame(onFrame)
                    }
                    session.requestAnimationFrame(onFrame)
                })
            },
            initTHREE() {
                const THREE = this.THREE = createScopedThreejs(this.canvas)
                registerGLTFLoader(THREE)

                // 相机
                this.camera = new THREE.Camera()

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
        },
    })
}