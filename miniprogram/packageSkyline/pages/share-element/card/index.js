import { cardList } from '../data';

Page({
  data: {
    cardData: {},
  },

  onLoad(query) {
    const selected = parseInt(query.idx, 10);
    this.setData({
      cardData: cardList[selected],
    });
  },
});