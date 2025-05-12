const MinDistance = 10;
const getDirection = (x, y) => {
    if (x > y && x > MinDistance) {
        return 'horizontal';
    }
    if (y > x && y > MinDistance) {
        return 'vertical';
    }
    return '';
};
export default Behavior({
    methods: {
        resetTouchStatus() {
            this.direction = '';
            this.deltaX = 0;
            this.deltaY = 0;
            this.offsetX = 0;
            this.offsetY = 0;
        },
        touchStart(event) {
            this.resetTouchStatus();
            const [touch] = event.touches;
            this.startX = touch.clientX;
            this.startY = touch.clientY;
        },
        touchMove(event) {
            const [touch] = event.touches;
            this.deltaX = touch.clientX - this.startX;
            this.deltaY = touch.clientY - this.startY;
            this.offsetX = Math.abs(this.deltaX);
            this.offsetY = Math.abs(this.deltaY);
            this.direction = getDirection(this.offsetX, this.offsetY);
        },
    },
});
