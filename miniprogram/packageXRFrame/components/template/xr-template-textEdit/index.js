Component({
  behaviors: [require('../../common/share-behavior').default],
  properties: {
    a: Number,
  },
  data: {
    loaded: false,
    words: "文本内容",
    fontColor: "1.0 1.0 1.0",
    fontSize: 1,
  },
  lifetimes: {},
  methods: {
    handleReady({detail}) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);

      let number = 0;
      let fontSize = 1;
      setInterval(()=>{
        this.setData({
          words: number,
          fontSize: fontSize,
          fontColor: `${Math.random()} ${Math.random()} ${Math.random()}`
        })
        number++;
        if (fontSize > 2) {
          fontSize = 1;
        } else {
          fontSize+= 0.1;
        }
      }, 200);

    }
    
  }
})