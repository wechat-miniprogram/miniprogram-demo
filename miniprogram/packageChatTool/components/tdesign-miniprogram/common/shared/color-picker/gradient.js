import isString from 'lodash/isString';
import isNull from 'lodash/isNull';
import tinyColor from 'tinycolor2';
const combineRegExp = (regexpList, flags) => {
    let source = '';
    for (let i = 0; i < regexpList.length; i++) {
        if (isString(regexpList[i])) {
            source += regexpList[i];
        }
        else {
            source += regexpList[i].source;
        }
    }
    return new RegExp(source, flags);
};
const generateRegExp = () => {
    const searchFlags = 'gi';
    const rAngle = /(?:[+-]?\d*\.?\d+)(?:deg|grad|rad|turn)/;
    const rSideCornerCapture = /to\s+((?:(?:left|right|top|bottom)(?:\s+(?:top|bottom|left|right))?))/;
    const rComma = /\s*,\s*/;
    const rColorHex = /#(?:[a-f0-9]{6}|[a-f0-9]{3})/;
    const rDigits3 = /\(\s*(?:\d{1,3}\s*,\s*){2}\d{1,3}\s*\)/;
    const rDigits4 = /\(\s*(?:\d{1,3}\s*,\s*){2}\d{1,3}\s*,\s*\d*\.?\d+\)/;
    const rValue = /(?:[+-]?\d*\.?\d+)(?:%|[a-z]+)?/;
    const rKeyword = /[_a-z-][_a-z0-9-]*/;
    const rColor = combineRegExp(['(?:', rColorHex, '|', '(?:rgb|hsl)', rDigits3, '|', '(?:rgba|hsla)', rDigits4, '|', rKeyword, ')'], '');
    const rColorStop = combineRegExp([rColor, '(?:\\s+', rValue, '(?:\\s+', rValue, ')?)?'], '');
    const rColorStopList = combineRegExp(['(?:', rColorStop, rComma, ')*', rColorStop], '');
    const rLineCapture = combineRegExp(['(?:(', rAngle, ')|', rSideCornerCapture, ')'], '');
    const rGradientSearch = combineRegExp(['(?:(', rLineCapture, ')', rComma, ')?(', rColorStopList, ')'], searchFlags);
    const rColorStopSearch = combineRegExp(['\\s*(', rColor, ')', '(?:\\s+', '(', rValue, '))?', '(?:', rComma, '\\s*)?'], searchFlags);
    return {
        gradientSearch: rGradientSearch,
        colorStopSearch: rColorStopSearch,
    };
};
const parseGradient = (regExpLib, input) => {
    let result;
    let matchColorStop;
    let stopResult;
    regExpLib.gradientSearch.lastIndex = 0;
    const matchGradient = regExpLib.gradientSearch.exec(input);
    if (!isNull(matchGradient)) {
        result = {
            original: matchGradient[0],
            colorStopList: [],
        };
        if (matchGradient[1]) {
            result.line = matchGradient[1];
        }
        if (matchGradient[2]) {
            result.angle = matchGradient[2];
        }
        if (matchGradient[3]) {
            result.sideCorner = matchGradient[3];
        }
        regExpLib.colorStopSearch.lastIndex = 0;
        matchColorStop = regExpLib.colorStopSearch.exec(matchGradient[4]);
        while (!isNull(matchColorStop)) {
            stopResult = {
                color: matchColorStop[1],
            };
            if (matchColorStop[2]) {
                stopResult.position = matchColorStop[2];
            }
            result.colorStopList.push(stopResult);
            matchColorStop = regExpLib.colorStopSearch.exec(matchGradient[4]);
        }
    }
    return result;
};
const REGEXP_LIB = generateRegExp();
const REG_GRADIENT = /.*gradient\s*\(((?:\([^)]*\)|[^)(]*)*)\)/gim;
export const isGradientColor = (input) => {
    REG_GRADIENT.lastIndex = 0;
    return REG_GRADIENT.exec(input);
};
const sideCornerDegreeMap = {
    top: 0,
    right: 90,
    bottom: 180,
    left: 270,
    'top left': 225,
    'left top': 225,
    'top right': 135,
    'right top': 135,
    'bottom left': 315,
    'left bottom': 315,
    'bottom right': 45,
    'right bottom': 45,
};
export const parseGradientString = (input) => {
    const match = isGradientColor(input);
    if (!match) {
        return false;
    }
    const gradientColors = {
        points: [],
        degree: 0,
    };
    const result = parseGradient(REGEXP_LIB, match[1]);
    if (result.original.trim() !== match[1].trim()) {
        return false;
    }
    const points = result.colorStopList.map(({ color, position }) => {
        const point = Object.create(null);
        point.color = tinyColor(color).toRgbString();
        point.left = parseFloat(position);
        return point;
    });
    gradientColors.points = points;
    let degree = parseInt(result.angle, 10);
    if (Number.isNaN(degree)) {
        degree = sideCornerDegreeMap[result.sideCorner] || 90;
    }
    gradientColors.degree = degree;
    return gradientColors;
};
export default parseGradientString;
