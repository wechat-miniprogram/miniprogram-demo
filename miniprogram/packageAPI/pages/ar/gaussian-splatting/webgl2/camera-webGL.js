import * as glMatrix from '../util/gl-matrix-min'

const { mat4, vec3, vec4 } = glMatrix

class CameraWebGL {
    constructor(gl, worker, {target = [0, 0, 0], up = [0, 1, 0], camera = []} = {}) {
        this.gl = gl;
        this.worker = worker;
        this.target = [...target] // Position of look-at target
        this.up = [...up]         // Up vector

        // Camera spherical coordinates (around the target)
        this.theta  = camera[0] ?? -Math.PI/2
        this.phi    = camera[1] ?? Math.PI/2
        this.radius = camera[2] ?? 3

        // Y Field of view
        // this.fov_y = 0.820176
        this.fov_y = Math.PI / 180 * 70;

        // False: orbit around object (mouse + wheel)
        // True: free-fly (mouse + AWSD)
        this.freeFly = false

        // Indicate that the camera moved and the splats need to be sorted
        this.needsWorkerUpdate = true

        // Is the user dragging the mouse?
        this.isDragging = false

        // Helper vectors
        this.pos = vec3.create()
        this.front = vec3.create()
        this.right = vec3.create()        

        // Helper matrices
        this.modelMatrix = mat4.create()
        this.viewMatrix = mat4.create()
        this.projMatrix = mat4.create()
        this.viewProjMatrix = mat4.create()
        this.lastViewProjMatrix = mat4.create()
        this.sceneRotationMatrix = rotateAlign(this.up, [0, 1, 0])

        // Matrices sent to the GPU
        this.mm = mat4.create()
        this.vm = mat4.create()
        this.mvm = mat4.create()
        this.mvpm = mat4.create()

        // past Touch
        this.lastTouch = {}

        // 是否已经初始化
        this.isWorkerInit = false;

        // 是否在排序
        this.isWorkerSorting = false;

        // 是否开启 worker 更新
        this.workerOn = true;

        // 初始化
        this.update();
    }

    setWorkerOn(flag) {
        this.workerOn = flag
    }

    updateCameraInfo(target, theta, phi, radius) {
        this.target = [...target]
        this.theta = theta
        this.phi = phi
        this.radius = radius
    }

    getPos(radius = this.radius) {
        const pos = [
            radius * Math.sin(this.phi) * Math.cos(this.theta),
            radius * Math.cos(this.phi),
            radius * Math.sin(this.phi) * Math.sin(this.theta)
        ]

        return vec3.transformMat3(pos, pos, this.sceneRotationMatrix)
    }

    update() {
        // console.log(this.pos)
        const gl = this.gl;
        // Update current position
        vec3.add(this.pos, this.target, this.getPos(this.freeFly ? 1 : this.radius))

        // Create a lookAt view matrix
        mat4.lookAt(this.viewMatrix, this.pos, this.target, this.up)

        // Create a perspective projection matrix
        const aspect = gl.canvas.width / gl.canvas.height
        mat4.perspective(this.projMatrix, this.fov_y, aspect, 0.01, 1000)

		// Convert view and projection to target coordinate system
        // Original C++ reference: https://gitlab.inria.fr/sibr/sibr_core/-/blob/gaussian_code_release_union/src/projects/gaussianviewer/renderer/GaussianView.cpp#L464
        mat4.copy(this.mm, this.modelMatrix);
        // modelMatrix 进行反转Y轴
        // invertRow(this.mm, 1);
        mat4.multiply(this.mvm, this.viewMatrix, this.mm)
        mat4.multiply(this.mvpm, this.projMatrix, this.mvm)

        invertRow(this.mvm, 2)

        // invertRow(this.mvm, 1)
        // invertRow(this.mvpm, 1)
        // (Webgl-specific) Invert x-axis
        // invertRow(this.mvm, 0)
        // invertRow(this.mvpm, 0)
        
        // console.log('vm', this.vm);
        // console.log('pm', this.projMatrix);

        if (this.isWorkerInit){
            if (this.workerOn) {
                this.updateWorker();
            }
        }
    }

    updateByVK() {
		// Convert view and projection to target coordinate system
        // Original C++ reference: https://gitlab.inria.fr/sibr/sibr_core/-/blob/gaussian_code_release_union/src/projects/gaussianviewer/renderer/GaussianView.cpp#L464
        mat4.copy(this.mm, this.modelMatrix);
        // modelMatrix 进行反转Y轴
        // invertRow(this.mm, 1);
        mat4.multiply(this.mvm, this.viewMatrix, this.mm)
        mat4.multiply(this.mvpm, this.projMatrix, this.mvm)

        invertRow(this.mvm, 2)

        // invertRow(this.mvm, 1)
        // invertRow(this.mvpm, 1)
        // (Webgl-specific) Invert x-axis
        // invertRow(this.mvm, 0)
        // invertRow(this.mvpm, 0)
        
        // console.log('vm', this.vm);
        // console.log('pm', this.projMatrix);

        if (this.isWorkerInit){
            if (this.workerOn) {
                this.updateWorker();
            }
        }
    }

    updateWorker() {
        const worker = this.worker;

        // Calculate the dot product between last and current view-projection matrices
        // If they differ too much, the splats need to be sorted
        const dot = this.lastViewProjMatrix[2]  * this.mvpm[2] 
                  + this.lastViewProjMatrix[6]  * this.mvpm[6]
                  + this.lastViewProjMatrix[10] * this.mvpm[10]
        if (Math.abs(dot - 1) > 0.01) {
            this.needsWorkerUpdate = true
            mat4.copy(this.lastViewProjMatrix, this.mvpm)
        }

        // Sort the splats as soon as the worker is available
        if (this.needsWorkerUpdate && !this.isWorkerSorting) {
            this.needsWorkerUpdate = false
            this.isWorkerSorting = true
            worker.postMessage({
                type: 'execFunc_sort',
                params: [
                  {
                    viewProjectionMatrix: this.mvpm
                  }
                ]
              })
        }
    }
}

const invertRow = (mat, row) => {
    mat[row + 0] = -mat[row + 0]
    mat[row + 4] = -mat[row + 4]
    mat[row + 8] = -mat[row + 8]
    mat[row + 12] = -mat[row + 12]
}

// Calculate the rotation matrix that aligns v1 with v2
// https://gist.github.com/kevinmoran/b45980723e53edeb8a5a43c49f134724
function rotateAlign(v1, v2) {
    const axis = [
      v1[1] * v2[2] - v1[2] * v2[1],
      v1[2] * v2[0] - v1[0] * v2[2],
      v1[0] * v2[1] - v1[1] * v2[0]
    ]

    const cosA = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]
    const k = 1.0 / (1.0 + cosA)
  
    const result = [
      (axis[0] * axis[0] * k) + cosA, (axis[1] * axis[0] * k) - axis[2], (axis[2] * axis[0] * k) + axis[1],
      (axis[0] * axis[1] * k) + axis[2], (axis[1] * axis[1] * k) + cosA, (axis[2] * axis[1] * k) - axis[0],
      (axis[0] * axis[2] * k) - axis[1], (axis[1] * axis[2] * k) + axis[0], (axis[2] * axis[2] * k) + cosA
    ]
  
    return result
}

export default CameraWebGL;