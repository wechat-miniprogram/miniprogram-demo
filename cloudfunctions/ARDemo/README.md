# 三维识别与重建云服务

## proto更新

### 依赖安装

```
// ARModel 下
tnpm install --save-dev @tencent/cloud-functions-tools@latest
```

### 基于 proto 文件生成脚本逻辑
```
// ARModel 下
npm run svrkit
```

## 服务更新

```
1. 安装 ARModel 下本地 npm 依赖

2. 云函数环境切为 test环境

3. ARModel 右键上传所有文件（由于有@tencent的子包）
```