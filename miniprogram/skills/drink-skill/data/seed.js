const CATEGORIES = [
  { id: 141, name: '黑咖/果咖' },
  { id: 133, name: '奶咖' },
  { id: 136, name: '蔬果汁' },
  { id: 135, name: '水果茶' },
  { id: 139, name: '奶茶/暖饮' }
]

const DRINKS = [
  { id: 289, name: '美式', price: 15, categoryId: 141, categoryName: '黑咖/果咖', description: '', imageUrl: '' },
  { id: 293, name: '白桃茶美式', price: 16, categoryId: 141, categoryName: '黑咖/果咖', description: '清爽茶香', imageUrl: '' },
  { id: 295, name: '杨桃油柑美式', price: 18, categoryId: 141, categoryName: '黑咖/果咖', description: '鲜油柑+杨桃', imageUrl: '' },
  { id: 353, name: '凤梨美式', price: 18, categoryId: 141, categoryName: '黑咖/果咖', description: '推荐', imageUrl: '' },
  { id: 362, name: '葡萄美式', price: 18, categoryId: 141, categoryName: '黑咖/果咖', description: '', imageUrl: '' },
  { id: 294, name: '爆柠美式', price: 18, categoryId: 141, categoryName: '黑咖/果咖', description: '', imageUrl: '' },
  { id: 296, name: '鲜橙美式', price: 20, categoryId: 141, categoryName: '黑咖/果咖', description: '', imageUrl: '' },

  { id: 393, name: '焦糖蜂窝拿铁', price: 20, categoryId: 133, categoryName: '奶咖', description: '', imageUrl: '' },
  { id: 395, name: '小黄油拿铁', price: 20, categoryId: 133, categoryName: '奶咖', description: '', imageUrl: '' },
  { id: 368, name: '黄油Dirty', price: 20, categoryId: 133, categoryName: '奶咖', description: '到店制作 大口喝', imageUrl: '' },
  { id: 390, name: '轻芝士拿铁', price: 20, categoryId: 133, categoryName: '奶咖', description: '法国kiri芝士', imageUrl: '' },
  { id: 195, name: '拿铁', price: 18, categoryId: 133, categoryName: '奶咖', description: '', imageUrl: '' },
  { id: 384, name: 'SOE澳白', price: 18, categoryId: 133, categoryName: '奶咖', description: '小热杯 更"咖啡"！', imageUrl: '' },
  { id: 383, name: '秋玫瑰拿铁', price: 20, categoryId: 133, categoryName: '奶咖', description: '玫瑰与奶咖的双向奔赴', imageUrl: '' },
  { id: 299, name: '生椰拿铁', price: 20, categoryId: 133, categoryName: '奶咖', description: '', imageUrl: '' },
  { id: 297, name: '橘皮拿铁', price: 20, categoryId: 133, categoryName: '奶咖', description: '', imageUrl: '' },
  { id: 208, name: '燕麦拿铁', price: 22, categoryId: 133, categoryName: '奶咖', description: 'OATLY燕麦奶', imageUrl: '' },

  { id: 394, name: '杨桃+油柑', price: 18, categoryId: 136, categoryName: '蔬果汁', description: '', imageUrl: '' },
  { id: 389, name: '胡萝卜汁', price: 13, categoryId: 136, categoryName: '蔬果汁', description: '补充维生素A', imageUrl: '' },
  { id: 386, name: '青瓜+西芹+苹果', price: 15, categoryId: 136, categoryName: '蔬果汁', description: '全能果蔬饮就它了', imageUrl: '' },
  { id: 387, name: '青瓜+雪梨+柠檬', price: 15, categoryId: 136, categoryName: '蔬果汁', description: '一口喝出清润好气色', imageUrl: '' },
  { id: 313, name: '苹果胡萝卜汁', price: 17, categoryId: 136, categoryName: '蔬果汁', description: '现榨无糖0负担', imageUrl: '' },

  { id: 315, name: '蜂蜜柚子茶', price: 12, categoryId: 135, categoryName: '水果茶', description: '', imageUrl: '' },
  { id: 300, name: '海盐柠檬', price: 13, categoryId: 135, categoryName: '水果茶', description: '补充电解质', imageUrl: '' },
  { id: 302, name: '鸭屎香柠檬茶', price: 13, categoryId: 135, categoryName: '水果茶', description: '', imageUrl: '' },
  { id: 301, name: '白桃乌龙柠檬茶', price: 13, categoryId: 135, categoryName: '水果茶', description: '', imageUrl: '' },
  { id: 305, name: '满杯百香果', price: 13, categoryId: 135, categoryName: '水果茶', description: '', imageUrl: '' },
  { id: 306, name: '百香益力多', price: 16, categoryId: 135, categoryName: '水果茶', description: '', imageUrl: '' },
  { id: 307, name: '柠檬益力多', price: 16, categoryId: 135, categoryName: '水果茶', description: '', imageUrl: '' },
  { id: 364, name: '黑加仑柠檬茶', price: 16, categoryId: 135, categoryName: '水果茶', description: '', imageUrl: '' },
  { id: 303, name: '杨桃油柑柠檬茶', price: 16, categoryId: 135, categoryName: '水果茶', description: '鲜油柑榨+杨桃', imageUrl: '' },

  { id: 371, name: '抹茶脑袋', price: 17, categoryId: 139, categoryName: '奶茶/暖饮', description: '冷热皆宜', imageUrl: '' },
  { id: 372, name: '茶萃奶白', price: 16, categoryId: 139, categoryName: '奶茶/暖饮', description: '冷热皆宜', imageUrl: '' },
  { id: 316, name: '黑糖姜母茶', price: 12, categoryId: 139, categoryName: '奶茶/暖饮', description: '热饮 红枣配枸杞', imageUrl: '' },
  { id: 381, name: '红糖姜桃胶撞奶', price: 18, categoryId: 139, categoryName: '奶茶/暖饮', description: '热饮 姜跟牛奶很般配', imageUrl: '' }
]

function buildSkuSchema(categoryId) {
  const tempDim = {
    key: 'temperature', label: '温度', multiple: false,
    options: [
      { value: 'ice', label: '冰' },
      { value: 'hot', label: '热' }
    ]
  }
  const sugarDim = {
    key: 'sugar', label: '糖度', multiple: false,
    options: [
      { value: 'none', label: '无糖' },
      { value: 'less', label: '少糖' },
      { value: 'normal', label: '标准' },
      { value: 'more', label: '多糖' }
    ]
  }
  const cupDim = {
    key: 'cupSize', label: '杯型', multiple: false,
    options: [
      { value: 'medium', label: '中杯', extraPrice: 0 },
      { value: 'large', label: '大杯', extraPrice: 3 },
      { value: 'xlarge', label: '超大杯', extraPrice: 6 }
    ]
  }
  const milkToppings = {
    key: 'toppings', label: '加料', multiple: true,
    options: [
      { value: 'oatMilk', label: '燕麦奶', extraPrice: 3 },
      { value: 'coconut', label: '椰浆', extraPrice: 3 },
      { value: 'extraShot', label: '额外浓缩', extraPrice: 5 }
    ]
  }
  const teaToppings = {
    key: 'toppings', label: '加料', multiple: true,
    options: [
      { value: 'pearl', label: '珍珠', extraPrice: 2 },
      { value: 'jelly', label: '椰果', extraPrice: 2 }
    ]
  }
  const juiceCupDim = {
    key: 'cupSize', label: '杯型', multiple: false,
    options: [
      { value: 'medium', label: '中杯', extraPrice: 0 },
      { value: 'large', label: '大杯', extraPrice: 3 }
    ]
  }

  switch (categoryId) {
    case 141:
      return { dimensions: [tempDim, sugarDim] }
    case 133:
      return { dimensions: [tempDim, sugarDim, cupDim, milkToppings] }
    case 136:
      return { dimensions: [tempDim, juiceCupDim] }
    case 135:
      return { dimensions: [tempDim, sugarDim, cupDim] }
    case 139:
      return { dimensions: [tempDim, sugarDim, cupDim, teaToppings] }
    default:
      return { dimensions: [tempDim, sugarDim] }
  }
}

function buildCatalog() {
  return DRINKS.map(d => ({
    ...d,
    skuSchema: buildSkuSchema(d.categoryId)
  }))
}

module.exports = {
  CATEGORIES,
  DRINKS,
  buildCatalog,
  buildSkuSchema
}
