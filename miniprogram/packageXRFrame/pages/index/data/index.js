const base = {
  name: '基础能力',
  tag: 'func',
  childArr: [
    {
      name: 'Geometry',
      label: '基础图形',
      path: '/pages/basic/scene-basic/index',
    },
    {
      name: 'Alpha',
      label: '透明画布',
      path: '/pages/basic/scene-basic-alpha/index',
    },
    {
      name: 'Light',
      label: '多光源',
      path: '/pages/basic/scene-basic-light/index',
    },
    {
      name: 'Animation',
      label: '动画',
      path: '/pages/basic/scene-basic-animation/index',
    },
    {
      name: 'Video',
      label: '视频纹理',
      path: '/pages/basic/scene-basic-video/index',
    },
    {
      name: 'Interaction',
      label: '交互',
      path: '/pages/basic/scene-basic-touch/index',
    },
    {
      name: 'Share',
      label: '录屏和截频',
      path: '/pages/basic/scene-basic-share/index',
    },
    {
      name: 'VisibleLayer',
      label: '显示和图层',
      path: '/pages/basic/scene-basic-visible-layer/index',
    },
    {
      name: 'Shadow',
      label: '动态节点',
      path: '/pages/basic/scene-basic-shadow/index',
    },
    {
      name: 'RenderTexture',
      label: '渲染目标',
      path: '/pages/basic/scene-basic-render-texture/index',
    },
    {
      name: 'PostProcessing',
      label: '后处理效果',
      path: '/pages/basic/scene-basic-postprocessing/index'
    },
    {
      name: 'EnvData',
      label: '全局环境数据与局部环境数据',
      path: '/pages/basic/scene-basic-envData/index',
    },
  ],
}
const gltf = {
  name: 'glTF能力',
  tag: 'func',
  childArr: [{
    name: 'Standard',
    label: '标准金属头盔',
    path: '/pages/gltf/scene-gltf-damageHelmet/index',
  },
  {
    name: 'Unlit',
    label: '无光照材质卡通模型',
    path: '/pages/gltf/scene-gltf-unlit/index',
  },
  {
    name: 'Loading',
    label: '加载界面与多光源场景',
    path: '/pages/gltf/scene-gltf-light-loading/index',
  },
  {
    name: 'Animation',
    label: 'gltf动画',
    path: '/pages/gltf/scene-gltf-animation/index',
  },
  {
    name: 'Morph',
    label: 'gltf morph',
    path: '/pages/gltf/scene-gltf-morph/index',
  },
  {
    name: '扩展',
    label: '压缩纹理',
    path: '/pages/gltf/scene-gltf-compressTextures/index',
  },
  {
    name: '扩展',
    label: 'KHR_texture_transform',
    path: '/pages/gltf/scene-gltf-textureTransform/index',
  },
  {
    name: '扩展',
    label: 'KHR_materials_pbrSpecularGlossiness',
    path: '/pages/gltf/scene-gltf-specularGlossiness/index',
  },
  {
    name: '扩展',
    label: 'KHR_materials_sheen',
    path: '/pages/gltf/scene-gltf-sheen/index',
  },
  {
    name: '扩展',
    label: 'KHR_materials_transmission',
    path: '/pages/gltf/scene-gltf-transmission/index',
  },
  {
    name: '扩展',
    label: 'KHR_lights_punctual',
    path: '/pages/gltf/scene-gltf-lightsPunctual/index',
  },
  ],
}

const ar = {
  name: 'AR能力',
  tag: 'func',
  childArr: [{
    name: 'Camera',
    label: 'AR 相机渲染',
    path: '/pages/ar/scene-ar-camera/index',
  },
  {
    name: 'Basic',
    label: 'AR 平面识别',
    path: '/pages/ar/scene-ar-basic/index',
  },
  {
    name: 'ThreeDof',
    label: 'AR 相机旋转',
    path: '/pages/ar/scene-ar-threeDof/index',
  },
  {
    name: '2DMarker',
    label: 'AR 2DMarker',
    path: '/pages/ar/scene-ar-2dmarker/index',
  },
  {
    name: 'OSDMarker',
    label: 'AR OSDMarker',
    path: '/pages/ar/scene-ar-osdmarker/index',
  },
  {
    name: 'Face',
    label: 'AR 人脸',
    path: '/pages/ar/scene-ar-face/index',
  },
  {
    name: 'Face',
    label: 'AR 三维人脸',
    path: '/pages/ar/scene-ar-face-3d/index',
  },
  {
    name: 'Hand',
    label: 'AR 人手',
    path: '/pages/ar/scene-ar-hand/index',
  },
  {
    name: 'Hand',
    label: 'AR 三维人手',
    path: '/pages/ar/scene-ar-hand-3d/index',
  },
  {
    name: 'Body',
    label: 'AR 人体',
    path: '/pages/ar/scene-ar-body/index',
  },
  {
    name: 'Body',
    label: 'AR 三维人体',
    path: '/pages/ar/scene-ar-body-3d/index',
  },
  {
    name: 'Shoe',
    label: 'AR 试鞋',
    path: '/pages/ar/scene-ar-shoe/index',
  },
  {
    name: 'Plane+Marker',
    label: 'AR 平面 Marker融合',
    path: '/pages/ar/scene-ar-vio-marker/index',
  },
  {
    name: 'Plane+Depth',
    label: 'AR 平面深度剔除',
    path: '/pages/ar/scene-ar-vio-depth/index',
  },
  ],
}

const physics = {
  name: '物理能力',
  tag: 'func',
  childArr: [
    {
      name: 'Shoot',
      label: '射击积木',
      path: '/pages/physics/scene-physics-shoot/index'
    },
    {
      name: 'Throw',
      label: '投球入筐',
      path: '/pages/physics/scene-physics-throw/index'
    }
  ]
}

const particle = {
  name: '粒子能力',
  tag: 'func',
  childArr: [
    {
      name: 'Firework',
      label: '喷射烟火',
      path: '/pages/particle/scene-particle-firework/index'
    },
    {
      name: 'Portal',
      label: '传送门',
      path: '/pages/particle/scene-particle-portal/index'
    },
    {
      name: 'Orb',
      label: '闪电光球',
      path: '/pages/particle/scene-particle-orb/index'
    },
    {
      name: 'ShapeEmitter',
      label: '球形发射器',
      path: '/pages/particle/scene-particle-shapeEmitter/index'
    },
    {
      name: 'MeshEmitter',
      label: '网格发射器',
      path: '/pages/particle/scene-particle-meshEmitter/index'
    },
    {
      name: 'HumanFace',
      label: '自定义粒子系统',
      path: '/pages/particle/scene-particle-custom/index'
    },
  ]
}

const customParticle = {
  name: '粒子定制能力',
  tag: 'func',
  childArr: [
    {
      name: 'Firework',
      label: '喷射烟火',
      path: '/pages/customParticle/scene-customParticle-firework/index'
    },
    {
      name: 'Portal',
      label: '传送门',
      path: '/pages/customParticle/scene-customParticle-portal/index'
    },
    {
      name: 'Orb',
      label: '闪电光球',
      path: '/pages/customParticle/scene-customParticle-orb/index'
    },
    {
      name: 'ShapeEmitter',
      label: '球形发射器',
      path: '/pages/customParticle/scene-customParticle-shapeEmitter/index'
    },
    {
      name: 'MeshEmitter',
      label: '网格发射器',
      path: '/pages/customParticle/scene-customParticle-meshEmitter/index'
    }
  ]
}

const custom = {
  name: '高级定制',
  tag: 'func',
  childArr: [
    {
      name: 'Logic',
      label: '定制组件和元素',
      path: '/pages/custom/scene-custom-logic/index',
    },
    {
      name: 'Render',
      label: '定制渲染资源',
      path: '/pages/custom/scene-custom-render/index',
    }
  ]
}

const messageTemplate = {
  name: '混合通信、资源加载、互动',
  tag: 'template',
  childArr: [
    {
      name: 'Message',
      label: '小程序混合通信',
      path: '/pages/template/xr-template-message/index',
    },
    {
      name: 'Loading',
      label: '动态资源加载与使用',
      path: '/pages/template/xr-template-loading/index',
    },
    {
      name: 'Controller',
      label: '第一人称漫游',
      path: '/pages/template/xr-template-control/index',
    },
    {
      name: 'Touch',
      label: '点选物体与动画控制',
      path: '/pages/template/xr-template-select/index',
    },
  ],
}

const arTemplate = {
  name: '常用AR定制能力',
  tag: 'template',
  childArr: [
    {
      name: 'Marker',
      label: '动态多Tracker切换（图片识别）',
      path: '/pages/template/xr-template-tracker/index',
    },
    {
      name: 'Marker',
      label: '识别后固定模型，在屏幕中间',
      path: '/pages/template/xr-template-markerCenter/index',
    },
    {
      name: 'Plane+Marker',
      label: '识别后固定模型，在世界空间',
      path: '/pages/template/xr-template-markerLock/index',
    },
    {
      name: 'Plane',
      label: '世界空间，动态创建连线',
      path: '/pages/template/xr-template-arLine/index',
    },
    {
      name: 'Plane',
      label: '模型摆放与手势控制',
      path: '/pages/template/xr-template-arPreview/index',
    },
    {
      name: 'AR',
      label: '人脸试戴眼镜（带遮挡）',
      path: '/pages/template/xr-template-arGlasses/index',
    },
    {
      name: 'AR',
      label: '模型控制朝向(面向屏幕的面片与模型)',
      path: '/pages/template/xr-template-lookat/index',
    },
    {
      name: 'AR',
      label: '平面模式下的 UI 面板',
      path: '/pages/template/xr-template-arui/index',
    },
  ],
}

const customTemplate = {
  name: '常用定制（材质、几何体、流程）',
  tag: 'template',
  childArr: [
    {
      name: 'Geometry',
      label: '定制每帧变化的Geometry',
      path: '/pages/template/xr-template-geometry/index',
    },
    {
      name: 'Effect',
      label: '模型切换为卡通渲染(自定义多pass)',
      path: '/pages/template/xr-template-toon/index',
    },
    {
      name: 'Effect',
      label: '自定义PBR渲染',
      path: '/pages/template/xr-template-pbr/index',
    },
    {
      name: 'Effect',
      label: '透明平面阴影',
      path: '/pages/template/xr-template-planeShadow/index',
    },
    {
      name: 'Effect',
      label: '序列帧动画（雪碧图、GIF）',
      path: '/pages/template/xr-template-frameEffect/index',
    },
    {
      name: 'Video',
      label: '过滤黑色背景视频',
      path: '/pages/template/xr-template-removeBlack/index',
    },
  ],
}

const gltfEditTemplate = {
  name: 'glTF动态修改',
  tag: 'template',
  childArr: [
    {
      name: 'glTF',
      label: '模型更换贴图',
      path: '/pages/template/xr-template-gltfEdit/index',
    },
    {
      name: 'glTF',
      label: '模型动画（脚本、骨骼）',
      path: '/pages/template/xr-template-gltfAnimation/index',
    },
    {
      name: 'glTF',
      label: '设置 glTF 为遮挡模型',
      path: '/pages/template/xr-template-gltfOcclusion/index',
    },
    {
      name: 'glTF',
      label: '添加模型内UV动画',
      path: '/pages/template/xr-template-gltfUVAnimation/index',
    },
    {
      name: 'glTF',
      label: '双面半透明模型渲染',
      path: '/pages/template/xr-template-blendDouble/index',
    },
  ],
}

const toolTemplate = {
  name: '通用基础能力',
  tag: 'template',
  childArr: [
    {
      name: 'Share',
      label: '截图与分享',
      path: '/pages/template/xr-template-share/index',
    },
    {
      name: 'Text',
      label: '自定义文本',
      path: '/pages/template/xr-template-textEdit/index',
    },
    // {
    //     name: 'volumeVideo',
    //     label: '体积视频渲染',
    //     path: '/pages/template/xr-template-volumeVideo/index',
    // },
    {
      name: 'Dissolve',
      label: '消融特效',
      path: '/pages/template/xr-template-dissolve/index',
    }
    // {
    //   name: 'Video',
    //   label: '滤色视频（定制化渲染流程）',
    //   path: '/pages/scene-custom-render/index',
    // },
    // {
    //   name: 'Video',
    //   label: '视频羽化（自定义材质）',
    //   path: '/pages/template/xr-template-featherVideo/index',
    // },
  ]
}

const classic = {
  name: 'AR典型案例',
  tag: 'case',
  childArr: [
    {
      name: 'Perspect',
      label: '扫描透视模型',
      path: '/pages/ar-classic/scene-classic-perspect/index',
    },
    {
      name: 'Portal',
      label: '平面传送门',
      path: '/pages/ar-classic/scene-classic-portal/index',
    },
    {
      name: 'Video',
      label: '扫描图片视频',
      path: '/pages/ar-classic/scene-classic-video/index',
    },
    {
      name: 'OSD',
      label: '扫描物体查看信息',
      path: '/pages/ar-classic/scene-classic-osd/index',
    },
    {
      name: 'Face',
      label: '人脸穿戴案例',
      path: '/pages/ar-classic/scene-classic-face/index',
    },
    {
      name: 'Ball',
      label: '扫描微信球',
      path: '/pages/ar-classic/scene-classic-wxball/index',
    }
  ],
}

const scan = {
  name: '扫描还原案例',
  tag: 'case',
  childArr: [
    {
      name: 'Render',
      label: '扫描渲染案例(全景、模型)',
      path: '/pages/scan/scene-scan-render/index',
    },
    {
      name: 'XRFrameTeam',
      label: '卡其脱离太',
      path: '/pages/scan/scene-scan-team/index',
    }
  ],
}

const production = {
  name: '产品级案例',
  tag: 'case',
  childArr: [
    {
      name: 'Beside Edge',
      label: '边缘迷走',
      path: '/pages/scene-beside-edge/index'
    },
    {
      name: '',
      label: '■■■■',
      path: '/pages/scene-last-record/index'
    }
  ]
}

export default [base, ar, gltf, physics, particle, customParticle, custom, messageTemplate, arTemplate, customTemplate, gltfEditTemplate, toolTemplate, classic, scan, production]
