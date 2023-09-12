import { createScopedThreejs } from 'threejs-miniprogram'
import { registerGLTFLoader } from '../loaders/gltf-loader'

const threeBehavior = Behavior({
    methods: {
        // 针对 threejs 的初始化逻辑
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
        initYUVShader() {
            const gl = this.gl = this.renderer.getContext()
            const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM)
            const vs = `
                attribute vec2 a_position;
                attribute vec2 a_texCoord;
                uniform mat3 displayTransform;
                varying vec2 v_texCoord;
                void main() {
                vec3 p = displayTransform * vec3(a_position, 0);
                gl_Position = vec4(p, 1);
                v_texCoord = a_texCoord;
                }
            `
            const fs = `
                precision highp float;

                uniform sampler2D y_texture;
                uniform sampler2D uv_texture;
                varying vec2 v_texCoord;
                void main() {
                vec4 y_color = texture2D(y_texture, v_texCoord);
                vec4 uv_color = texture2D(uv_texture, v_texCoord);

                float Y, U, V;
                float R ,G, B;
                Y = y_color.r;
                U = uv_color.r - 0.5;
                V = uv_color.a - 0.5;
                
                R = Y + 1.402 * V;
                G = Y - 0.344 * U - 0.714 * V;
                B = Y + 1.772 * U;
                
                gl_FragColor = vec4(R, G, B, 1.0);
                }
            `
            const vertShader = gl.createShader(gl.VERTEX_SHADER)
            gl.shaderSource(vertShader, vs)
            gl.compileShader(vertShader)

            const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
            gl.shaderSource(fragShader, fs)
            gl.compileShader(fragShader)

            const program = this._program = gl.createProgram()
            this._program.gl = gl
            gl.attachShader(program, vertShader)
            gl.attachShader(program, fragShader)
            gl.deleteShader(vertShader)
            gl.deleteShader(fragShader)
            gl.linkProgram(program)
            gl.useProgram(program)

            const uniformYTexture = gl.getUniformLocation(program, 'y_texture')
            gl.uniform1i(uniformYTexture, 5)
            const uniformUVTexture = gl.getUniformLocation(program, 'uv_texture')
            gl.uniform1i(uniformUVTexture, 6)

            this._dt = gl.getUniformLocation(program, 'displayTransform')
            gl.useProgram(currentProgram)
        },
        initYUVVAO() {
            const gl = this.renderer.getContext()
            const ext = gl.getExtension('OES_vertex_array_object')
            this.ext = ext

            const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING)
            const vao = ext.createVertexArrayOES()

            ext.bindVertexArrayOES(vao)

            const posAttr = gl.getAttribLocation(this._program, 'a_position')
            const pos = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, pos)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW)
            gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0)
            gl.enableVertexAttribArray(posAttr)
            vao.posBuffer = pos

            const texcoordAttr = gl.getAttribLocation(this._program, 'a_texCoord')
            const texcoord = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, texcoord)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, 0, 1, 1, 0, 0, 0]), gl.STATIC_DRAW)
            gl.vertexAttribPointer(texcoordAttr, 2, gl.FLOAT, false, 0, 0)
            gl.enableVertexAttribArray(texcoordAttr)
            vao.texcoordBuffer = texcoord

            ext.bindVertexArrayOES(currentVAO)
            this._vao = vao
        },
        initYUV() {
            this.initYUVShader()
            this.initYUVVAO()
        },
        renderYUV(frame) {
            const gl = this.renderer.getContext()
            gl.disable(gl.DEPTH_TEST)
            const {
                yTexture,
                uvTexture
            } = frame.getCameraTexture(gl, 'yuv')
            const displayTransform = frame.getDisplayTransform()
            if (yTexture && uvTexture) {
                const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM)
                const currentActiveTexture = gl.getParameter(gl.ACTIVE_TEXTURE)
                const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING)

                gl.useProgram(this._program)
                this.ext.bindVertexArrayOES(this._vao)

                gl.uniformMatrix3fv(this._dt, false, displayTransform)
                gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)

                gl.activeTexture(gl.TEXTURE0 + 5)
                const bindingTexture5 = gl.getParameter(gl.TEXTURE_BINDING_2D)
                gl.bindTexture(gl.TEXTURE_2D, yTexture)

                gl.activeTexture(gl.TEXTURE0 + 6)
                const bindingTexture6 = gl.getParameter(gl.TEXTURE_BINDING_2D)
                gl.bindTexture(gl.TEXTURE_2D, uvTexture)

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

                gl.bindTexture(gl.TEXTURE_2D, bindingTexture6)
                gl.activeTexture(gl.TEXTURE0 + 5)
                gl.bindTexture(gl.TEXTURE_2D, bindingTexture5)

                gl.useProgram(currentProgram)
                gl.activeTexture(currentActiveTexture)
                this.ext.bindVertexArrayOES(currentVAO)
            }
        },
    },
})

export default threeBehavior;