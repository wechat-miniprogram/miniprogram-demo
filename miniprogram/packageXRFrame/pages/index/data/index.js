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
    // {
    //   name: 'Physic',
    //   label: '物理',
    //   path: '/pages/basic/scene-basic-physic/index',
    // },
    {
      name: 'ParticleSystem',
      label: '粒子系统',
      path: '/pages/basic/scene-basic-particle/index',
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
};
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
      label: 'KHR_lights_punctual',
      path: '/pages/gltf/scene-gltf-lightsPunctual/index',
    },
  ],
};

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
      name: 'Hand',
      label: 'AR 人手',
      path: '/pages/ar/scene-ar-hand/index',
    },
    {
      name: 'Body',
      label: 'AR 人体',
      path: '/pages/ar/scene-ar-body/index',
    },
    {
      name: 'Plane+Marker',
      label: 'AR 平面Marker融合',
      path: '/pages/ar/scene-ar-vio-marker/index',
    },
  ],
};

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
};

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
};

const template = {
  name: '通用功能模版',
  tag: 'template',
  childArr: [
    {
      name: 'Message',
      label: '小程序混合通信',
      path: '/pages/template/xr-template-message/index',
    },
    {
      name: 'Controller',
      label: '第一人称漫游',
      path: '/pages/template/xr-template-control/index',
    },
    {
      name: 'Loading',
      label: '动态资源加载与使用',
      path: '/pages/template/xr-template-loading/index',
    },
    {
      name: 'Tracker',
      label: '动态多Tracker切换（图片识别）',
      path: '/pages/template/xr-template-tracker/index',
    },
    {
      name: 'AR',
      label: '模型摆放与手势控制',
      path: '/pages/template/xr-template-arPreview/index',
    },
    {
      name: 'AR',
      label: '面向屏幕的面片',
      path: '/pages/template/xr-template-lookat/index',
    },
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
      name: 'Animation',
      label: '序列帧动画（雪碧图、GIF）',
      path: '/pages/template/xr-template-frameEffect/index',
    },
    {
      name: 'Touch',
      label: '点选物体与动画控制',
      path: '/pages/template/xr-template-select/index',
    },
    {
      name: 'Share',
      label: '截图与分享',
      path: '/pages/template/xr-template-share/index',
    },
    {
      name: 'Video',
      label: '过滤黑色背景视频',
      path: '/pages/template/xr-template-removeBlack/index',
    },
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
};

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
};


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
};

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
};

export default [base, ar, gltf, physics, custom, template, classic, scan, production];
