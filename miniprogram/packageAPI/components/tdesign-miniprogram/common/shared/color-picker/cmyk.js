export const rgb2cmyk = (red, green, blue) => {
    let computedC = 0;
    let computedM = 0;
    let computedY = 0;
    let computedK = 0;
    const r = parseInt(`${red}`.replace(/\s/g, ''), 10);
    const g = parseInt(`${green}`.replace(/\s/g, ''), 10);
    const b = parseInt(`${blue}`.replace(/\s/g, ''), 10);
    if (r === 0 && g === 0 && b === 0) {
        computedK = 1;
        return [0, 0, 0, 1];
    }
    computedC = 1 - r / 255;
    computedM = 1 - g / 255;
    computedY = 1 - b / 255;
    const minCMY = Math.min(computedC, Math.min(computedM, computedY));
    computedC = (computedC - minCMY) / (1 - minCMY);
    computedM = (computedM - minCMY) / (1 - minCMY);
    computedY = (computedY - minCMY) / (1 - minCMY);
    computedK = minCMY;
    return [computedC, computedM, computedY, computedK];
};
export const cmyk2rgb = (cyan, magenta, yellow, black) => {
    let c = cyan / 100;
    let m = magenta / 100;
    let y = yellow / 100;
    const k = black / 100;
    c = c * (1 - k) + k;
    m = m * (1 - k) + k;
    y = y * (1 - k) + k;
    let r = 1 - c;
    let g = 1 - m;
    let b = 1 - y;
    r = Math.round(255 * r);
    g = Math.round(255 * g);
    b = Math.round(255 * b);
    return {
        r,
        g,
        b,
    };
};
const REG_CMYK_STRING = /cmyk\((\d+%?),(\d+%?),(\d+%?),(\d+%?)\)/;
const toNumber = (str) => Math.max(0, Math.min(255, parseInt(str, 10)));
export const cmykInputToColor = (input) => {
    if (/cmyk/i.test(input)) {
        const str = input.replace(/\s/g, '');
        const match = str.match(REG_CMYK_STRING);
        const c = toNumber(match[1]);
        const m = toNumber(match[2]);
        const y = toNumber(match[3]);
        const k = toNumber(match[4]);
        const { r, g, b } = cmyk2rgb(c, m, y, k);
        return `rgb(${r}, ${g}, ${b})`;
    }
    return input;
};
