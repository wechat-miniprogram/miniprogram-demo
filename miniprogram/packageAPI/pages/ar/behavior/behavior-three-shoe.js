const threeBehavior = Behavior({
  methods: {
    updateThreeMatrix() {
      // 同步 VKCamera 矩阵信息到 Three Camera
      if (VKCamera) {
        // VK接管相机矩阵
        this.camera.matrixAutoUpdate = false

        // VK ViewMatrix 返回列主序
        this.camera.matrixWorldInverse.fromArray(VKCamera.viewMatrix)
        this.camera.matrixWorld.getInverse(this.camera.matrixWorldInverse)

        const projectionMatrix = VKCamera.getProjectionMatrix(NEAR, FAR)

        // projectionMatrix[0] = projectionMatrix[0] / 2;
        // projectionMatrix[5] = projectionMatrix[5] / 2;

        // VK 返回列主序
        // 设置 投影矩阵
        this.camera.projectionMatrix.fromArray(projectionMatrix)
        this.camera.projectionMatrixInverse.getInverse(this.camera.projectionMatrix)
      }

      // 存在model，更新矩阵
      if (this.modelWrap && this.points3d && this.shoeTransform) {
        // console.log('toUpdate')
        const THREE = this.THREE

        // 顶点偏移矩阵
        const positionMat = new THREE.Matrix4()
        // 认为点 0 0 0
        positionMat.setPosition(0, 0, 0)

        // Anchor返回矩阵，实际上就是完整的 modelView matrix
        const anchorMatrix = new THREE.Matrix4()
        // 目前返回的是行主序矩阵
        anchorMatrix.set(
          this.shoeTransform[0],
          this.shoeTransform[1],
          this.shoeTransform[2],
          this.shoeTransform[3],
          this.shoeTransform[4],
          this.shoeTransform[5],
          this.shoeTransform[6],
          this.shoeTransform[7],
          this.shoeTransform[8],
          this.shoeTransform[9],
          this.shoeTransform[10],
          this.shoeTransform[11],
          this.shoeTransform[12],
          this.shoeTransform[13],
          this.shoeTransform[14],
          this.shoeTransform[15],
        )
        // 两者叠加
        // const modelWorld = positionMat.multiply(anchorMatrix);

        const modelWorld = anchorMatrix

        const pos = new THREE.Vector3()
        const quaternion = new THREE.Quaternion()
        const scale = new THREE.Vector3()

        // 解析出 实际的 信息
        modelWorld.decompose(pos, quaternion, scale)
        console.log(pos, quaternion, scale)

        // 设置到容器节点上
        this.modelWrap.position.set(pos.x, pos.y, pos.z)
        this.modelWrap.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
        this.modelWrap.scale.set(scale.x, scale.y, scale.z)

        if (this.model) {
          // 先把模型放置在脚踝
          // this.model.position.set(this.points3d[0].x, this.points3d[0].y, this.points3d[0].z);
        }

        if (this.hintBoxList && this.hintBoxList.length > 0) {
          // console.log('ready to set', this.hintBoxList);
          // 存在提示列表，则更新点信息
          for (let i = 0; i < this.hintBoxList.length; i++) {
            const hintBox = this.hintBoxList[i]
            hintBox.position.set(this.points3d[i].x, this.points3d[i].y, this.points3d[i].z)
          }
          // console.log('seted', this.hintBoxList);
        }

        // debug 用信息
        if (!loggerOnce) {
          // console.log('positionMat', positionMat);
          // console.log('anchorMat', anchorMat);
          // console.log('modelWorld', modelWorld);

          // console.log('projectionMatrix', this.camera.projectionMatrix);

          // console.log('this.modelWrap.position', this.modelWrap.position);
          // console.log('this.modelWrap.quaternion', this.modelWrap.quaternion);
          // console.log('this.modelWrap.scale', this.modelWrap.scale);

          // console.log('domSize', this.data.domWidth, this.data.domHeight)
          // VK 直接数值
          console.log('joints', Array.from(this.points3d))
          console.log('viewMatrix', Array.from(VKCamera.viewMatrix))
          console.log('projectionMatrix', Array.from(VKCamera.getProjectionMatrix(NEAR, FAR)))
          console.log('anchorTransform', Array.from(this.shoeTransform))

          loggerOnce = true
        }
      }

      // 渲染 Three 场景
      this.renderer.autoClearColor = false
      this.renderer.state.setCullFace(this.THREE.CullFaceBack)
      this.renderer.render(this.scene, this.camera)
      // 为什么去掉这句话会画不出来，我感觉大概率是YUV的面朝向错了
      this.renderer.state.setCullFace(this.THREE.CullFaceNone)
    },
    addShoeHintBox() {
      const THREE = this.THREE

      const wrap = this.modelWrap

      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const boxScale = 0.3

      const hintBoxList = []
      for (let i = 0; i < 8; i++) {
        const colorHex = (i * 2).toString(16)
        const material = new THREE.MeshPhysicalMaterial({
          metalness: 0.0,
          roughness: 0.5,
          color: parseInt(`${colorHex}${colorHex}${colorHex}${colorHex}${colorHex}${colorHex}`, 16),
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(0, 0, 0)
        mesh.scale.set(boxScale, boxScale, boxScale)
        wrap.add(mesh)
        hintBoxList.push(mesh)
      }

      this.hintBoxList = hintBoxList
    },
  },
})

export default threeBehavior
