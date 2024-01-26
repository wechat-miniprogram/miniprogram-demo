Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
    capacity: {
      type: Number,
      value: 20
    },
    emitRate: {
      type: Number,
      value: 5
    },
    lifeTime:{
      type: Number,
      value: 3
    }
  },
  data: {
    loaded: false
  },
  lifetimes: {},
  methods: {
    handleReady({detail}) {

    },

    handleAssetsProgress: function({detail}) {
      console.log('assets progress', detail.value);
      
    },
    handleAssetsLoaded: function({detail}) {
      console.log('assets loaded', detail.value);
      this.setData({loaded: true});
    }
  }
})