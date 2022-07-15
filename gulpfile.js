const fs = require('fs')

const gulp = require('gulp')
const postcss = require('gulp-postcss')
const cssvars = require('postcss-css-variables')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const gulpIf = require('gulp-if')
const gulpIgnore = require('gulp-ignore')

gulp.task('transform-css-vars', () => {
  const plugins = [
    cssvars({
      preserve: false,
      variables: {
        "--weui-BTN-DISABLED-FONT-COLOR": "rgba(0, 0, 0, .2)",
        "--weui-BTN-DEFAULT-BG": "#f2f2f2",
        "--weui-BTN-DEFAULT-COLOR": "#06ae56",
        "--weui-BTN-DEFAULT-ACTIVE-BG": "#e6e6e6",
        "--weui-DIALOG-LINE-COLOR": "rgba(0, 0, 0, .1)",
        "--weui-BG-0": "#ededed",
        "--weui-BG-1": "#f7f7f7",
        "--weui-BG-2": "#fff",
        "--weui-BG-3": "#f7f7f7",
        "--weui-BG-4": "#4c4c4c",
        "--weui-BG-5": "#fff",
        "--weui-FG-0": "rgba(0, 0, 0, .9)",
        "--weui-FG-HALF": "rgba(0, 0, 0, .9)",
        "--weui-FG-1": "rgba(0, 0, 0, .5)",
        "--weui-FG-2": "rgba(0, 0, 0, .3)",
        "--weui-FG-3": "rgba(0, 0, 0, .1)",
        "--weui-RED": "#fa5151",
        "--weui-ORANGE": "#fa9d3b",
        "--weui-YELLOW": "#ffc300",
        "--weui-GREEN": "#91d300",
        "--weui-LIGHTGREEN": "#95ec69",
        "--weui-BRAND": "#07c160",
        "--weui-BLUE": "#10aeff",
        "--weui-INDIGO": "#1485ee",
        "--weui-PURPLE": "#6467f0",
        "--weui-WHITE": "#fff",
        "--weui-LINK": "#576b95",
        "--weui-TEXTGREEN": "#06ae56",
        "--weui-FG": "#000",
        "--weui-BG": "#fff",
        "--weui-TAG-TEXT-ORANGE": "#fa9d3b",
        "--weui-TAG-BACKGROUND-ORANGE": "rgba(250, 157, 59, .1)",
        "--weui-TAG-TEXT-GREEN": "#06ae56",
        "--weui-TAG-BACKGROUND-GREEN": "rgba(6, 174, 86, .1)",
        "--weui-TAG-TEXT-BLUE": "#10aeff",
        "--weui-TAG-BACKGROUND-BLUE": "rgba(16, 174, 255, .1)",
        "--weui-TAG-TEXT-BLACK": "rgba(0, 0, 0, .5)",
        "--weui-TAG-BACKGROUND-BLACK": "rgba(0, 0, 0, .05)",
        "--weui-BG-COLOR-ACTIVE": "#ececec",
        "--height": "44px",
        "--right": "95px",
      },
      preserveInjectedVariables: false,
    })
  ]
  return gulp.src([
        './miniprogram/app.wxss',
        './miniprogram/common/common.wxss',
        './miniprogram/page/common/common.wxss',
        './miniprogram/page/common/index.wxss',
        './miniprogram/page/component/index.wxss',
        './miniprogram/page/cloud/index.wxss',
        './miniprogram/page/API/index.wxss',
        './miniprogram/page/extend/index.wxss',
        './miniprogram/packageComponent/pages/canvas/canvas-2d/canvas-2d.wxss',
      ])
      .pipe(gulpIgnore.exclude(
        file => {
          try {
            fs.accessSync(file.path.replace(/\.wxss$/, '-skyline.wxss'))
          } catch(e) {
            return false
          }
          return true
        }))
      .pipe(postcss(plugins))
      .pipe(replace(/\:root ?{}\n/g, ''))
      .pipe(gulpIf(file => file.path.includes('miniprogram/page/common'), rename({suffix: '-skyline'})))
      .pipe(gulpIf(file => file.path.includes('miniprogram/common'), rename({suffix: '-skyline'})))
      .pipe(gulp.dest(file => file.base))
})
