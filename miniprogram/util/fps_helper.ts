/**
 * 统计开始到现在/结束的fps
 */
class FpsHelper {
  startTime = 0;
  frameCount = 0;
  endTime = 0;

  tempFrameCount = 0;
  tempStartTime = 0;

  /** 更新fps, 回调1秒内的平均fps */
  updateFPS(onTempFPS: (fps: number) => any) {
    const now = Date.now();

    //更新全局fps记录
    if (this.frameCount == 0) {
      this.startTime = now;
    }
    this.frameCount++;
    this.endTime = now;

    //更新临时fps记录
    this.tempFrameCount++;
    if (this.tempStartTime > 0) {
      const interval = now - this.tempStartTime;
      if (interval > 1000) {
        const fps = Math.round(1000 / (interval / this.tempFrameCount));
        this.tempFrameCount = 0;
        this.tempStartTime = now;
        onTempFPS && onTempFPS(fps);
      }
    } else {
      this.tempStartTime = now;
      onTempFPS && onTempFPS(0);
    }
  }

  /** 获得开始到当前的平均fps */
  getAverageFps() {
    const duration = this.endTime - this.startTime;
    if (duration > 1000) {
      return Math.round((1000 * this.frameCount) / duration);
    }
    return 0;
  }

  /** 重置所有的计算 */
  reset() {
    this.startTime = 0;
    this.frameCount = 0;
    this.endTime = 0;

    this.tempFrameCount = 0;
    this.tempStartTime = 0;
  }

  /** 执行上报fps */
  doReport(record: boolean = false, face: boolean = false) {
    const duration = this.endTime - this.startTime;
    if (duration > 5000) {
      const fps = Math.round((1000 * this.frameCount) / duration);
      const info = wx.getSystemInfoSync();
      wx.report('skip_fps', {
        fps,
        duration,
        record: record ? 1 : 0,
        face: face ? 1 : 0,
        up_platform: info.platform,
        up_brand: info.brand,
        up_model: info.model,
        up_benchmark: info.benchmarkLevel
      });
      this.reset();
    }
  }
}

export { FpsHelper };
