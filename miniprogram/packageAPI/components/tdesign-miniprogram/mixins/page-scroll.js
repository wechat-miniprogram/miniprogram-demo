import { getCurrentPage } from '../common/utils';
const onPageScroll = function (event) {
    const page = getCurrentPage();
    if (!page)
        return;
    const { pageScroller } = page;
    pageScroller === null || pageScroller === void 0 ? void 0 : pageScroller.forEach((scroller) => {
        if (typeof scroller === 'function') {
            scroller(event);
        }
    });
};
export default (funcName = 'onScroll') => {
    return Behavior({
        attached() {
            var _a;
            const page = getCurrentPage();
            if (!page)
                return;
            const bindScroller = (_a = this[funcName]) === null || _a === void 0 ? void 0 : _a.bind(this);
            if (bindScroller) {
                this._pageScroller = bindScroller;
            }
            if (Array.isArray(page.pageScroller)) {
                page.pageScroller.push(bindScroller);
            }
            else {
                page.pageScroller =
                    typeof page.onPageScroll === 'function' ? [page.onPageScroll.bind(page), bindScroller] : [bindScroller];
            }
            page.onPageScroll = onPageScroll;
        },
        detached() {
            var _a;
            const page = getCurrentPage();
            if (!page)
                return;
            page.pageScroller = ((_a = page.pageScroller) === null || _a === void 0 ? void 0 : _a.filter((item) => item !== this._pageScroller)) || [];
        },
    });
};
