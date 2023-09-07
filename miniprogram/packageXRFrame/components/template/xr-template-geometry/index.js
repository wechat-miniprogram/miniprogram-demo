

function getVertexBuffer(vertexData) {
  const vertexCount = vertexData.length / 12;
  const noise = 0.03;
  for (let i = 0; i < vertexCount; i++) {
    const vertexIndex = i * 12;
    // x
    vertexData[vertexIndex] = vertexData[vertexIndex] + Math.random() * noise - noise / 2;
    // y
    vertexData[vertexIndex + 1] = vertexData[vertexIndex + 1]+ Math.random() * noise - noise / 2;
    // z
    vertexData[vertexIndex + 2] = vertexData[vertexIndex + 2] + Math.random() * noise - noise / 2;
    // normal x
    // vertexData[vertexIndex + 3]
    // normal y
    // vertexData[vertexIndex + 4]
    // normal z
    // vertexData[vertexIndex + 5]
    // u
    // vertexData[vertexIndex + 6]
    // v
    // vertexData[vertexIndex + 7]
    // r
    vertexData[vertexIndex + 8] = i / vertexCount;
    // g
    vertexData[vertexIndex + 9] = i / vertexCount;
    // b
    vertexData[vertexIndex + 10] = i / vertexCount;
    // a
    // vertexData[vertexIndex + 11]
  }
  return new Float32Array(vertexData);
}


function buildSphere(
  vertexs,
  indices,
  radius = 1,
  widthSegments = 32,
  heightSegments = 16,
  phiStart = Math.PI /2,
  phiLength = Math.PI * 2,
  thetaStart = Math.PI,
  thetaLength = Math.PI
) {
  
  widthSegments = Math.max( 3, Math.floor( widthSegments ) );
  heightSegments = Math.max( 2, Math.floor( heightSegments ) );

  const thetaEnd = Math.min( thetaStart + thetaLength, Math.PI );

  let index = 0;
  const grid = [];

  // generate vertices, normals and uvs
  for ( let iy = 0; iy <= heightSegments; iy ++ ) {
    const verticesRow = [];
    const v = iy / heightSegments;
    // special case for the poles
    let uOffset = 0;
    if ( iy == 0 && thetaStart == 0 ) {
      uOffset = 0.5 / widthSegments;
    } else if ( iy == heightSegments && thetaEnd == Math.PI ) {
      uOffset = - 0.5 / widthSegments;
    }
    for ( let ix = 0; ix <= widthSegments; ix ++ ) {
      const u = ix / widthSegments;
      // vertex
      const vertexX = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
      const vertexY = radius * Math.cos( thetaStart + v * thetaLength );
      const vertexZ = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
      vertexs.push(vertexX, vertexY, vertexZ);
      // normal
      vertexs.push(vertexX / 3, vertexY / 3, vertexZ / 3);
      // uv
      vertexs.push(u + uOffset, 1 - v );
      // color
      vertexs.push(0, 0, 0, 1);


      verticesRow.push( index ++ );
    }
    grid.push( verticesRow );
  }
  // indices
  for ( let iy = 0; iy < heightSegments; iy ++ ) {
    for ( let ix = 0; ix < widthSegments; ix ++ ) {
      const a = grid[ iy ][ ix + 1 ];
      const b = grid[ iy ][ ix ];
      const c = grid[ iy + 1 ][ ix ];
      const d = grid[ iy + 1 ][ ix + 1 ];

      if ( iy !== 0 || thetaStart > 0 ) indices.push( a, d, b );
      if ( iy !== heightSegments - 1 || thetaEnd < Math.PI ) indices.push( b, d, c );
    }
  }
}

Component({
  behaviors: [require('../../common/share-behavior').default],
  properties: {
    a: Number,
  },
  data: {
    loaded: false
  },
  lifetimes: {},
  methods: {
    handleReady({detail}) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);
      const xrFrameSystem  = wx.getXrFrameSystem()

      this.geometryRoot = this.scene.getElementById('geometryRoot');

      const geoRadius = 1;

      this.vertexData = [];
      this.indexData = [];
      // 构造圆形的 顶点信息，可以通过增加切分区域增加顶点数量
      // 一般复杂人物 vertex 长度 77030 index 88266
      buildSphere(this.vertexData, this.indexData, geoRadius, 64, 64);
      
      console.log('vertexDataCount', this.vertexData.length);
      console.log('indexDataCount', this.indexData.length);


      // 注册 Geometry 信息
      xrFrameSystem.registerGeometry('man', scene => {
        const vl = scene.createVertexLayout({
          attributes: [
            {
              name: "a_position",
              format: xrFrameSystem.EVertexFormat.FLOAT3,
              offset: 0,
              usage: xrFrameSystem.EVertexLayoutUsage.POSITION
            },
            {
              name: "a_normal",
              format: xrFrameSystem.EVertexFormat.FLOAT3,
              offset: 12,
              usage: xrFrameSystem.EVertexLayoutUsage.NORMAL,
            },
            {
              name: "a_texCoord",
              format: xrFrameSystem.EVertexFormat.FLOAT2,
              offset: 24,
              usage: xrFrameSystem.EVertexLayoutUsage.UV0
            },
            {
              name: "a_color",
              format: xrFrameSystem.EVertexFormat.FLOAT4,
              offset: 32,
              usage: xrFrameSystem.EVertexLayoutUsage.COLOR
            }
          ],
          stride: 48
        });
      
        // VertexBuffer IndexBuffer 不能动态更改长度，需要一开始设定较大的长度。
        const vb = new Float32Array(this.vertexData.length);
        const ib = new Uint16Array(this.indexData);
      
        const geo = scene.createGeometry(vl, vb, ib);
      
        geo.setBoundBall(new xrFrameSystem.Vector3(), 1);
        geo.addSubMesh(ib.length, 0, 0);
      
        return geo;
      });

      this.geoElem = xrScene.createElement(xrFrameSystem.XRMesh, {
        geometry: "man",
        material: 'simple-mat',
        position: "0 0 0"
      });
      this.geometryRoot.addChild(this.geoElem);

      // 延时保证挂载与初始化完毕
      setTimeout(()=>{
        this.meshGeo = this.geoElem.getComponent(xrFrameSystem.Mesh);
        this.geometryGeo = this.meshGeo.geometry;

        this.matGeo = this.meshGeo.material;
        // 使用顶点色
        this.matGeo.setMacro("WX_USE_COLOR_0", true);
        // 设定 绘制双面
        this.matGeo.setRenderState("cullOn", false);

        xrScene.event.add('tick', this.handleTick.bind(this));
      },100);

    },
    
    handleAssetsProgress: function({detail}) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function({detail}) {
      console.log('assets loaded', detail.value);
    },
    handleTick(delta) {

      const vb = getVertexBuffer(this.vertexData);
      const ib = new Uint16Array(this.indexData);
    
      this.geometryGeo.uploadVertexBuffer(0, vb);
      this.geometryGeo.uploadIndexBuffer(0, ib);
    },

  }
})