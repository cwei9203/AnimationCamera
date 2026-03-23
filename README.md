# 次元穿梭 - 圣地巡礼 App 🎌

<div align="center">

![React Native](https://img.shields.io/badge/React%20Native-0.83.2-blue.svg)
![Expo](https://img.shields.io/badge/Expo-55.0.8-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

**基于 React Native + Expo 的二次元圣地巡礼应用**

让你在现实场景中与喜爱的动漫角色合影！

[功能特性](#功能特性) • [快速开始](#快速开始) • [使用流程](#使用流程) • [项目结构](#项目结构) • [开发计划](#开发计划)

</div>

---

## 📱 应用简介

**次元穿梭**是一款专为动漫爱好者打造的圣地巡礼应用。通过相机取景、参考图叠加、角色抠图和图片合成等功能，让你轻松创作出次元融合作品。

### 核心功能

- 🎯 **精准取景** - 参考图半透明叠加，完美复刻动漫场景
- 🎨 **角色抠图** - 支持 remove.bg 和腾讯云智能识图 API
- ✨ **创意合成** - 自由拖拽、缩放角色，打造独特作品
- 💾 **一键保存** - 保存到相册或直接分享到社交平台

## 功能特性

### 已实现 ✅

- **📷 相机取景 + 参考图半透明叠加**
  - 实时预览 + 参考图叠放
  - 滑块调节透明度（0-100%）
  - 前后摄像头切换

- **🎨 角色选择**
  - 内置热门动漫角色
  - 上传自定义角色
  - 抠图 API 集成（remove.bg / 腾讯云）

- **🖼️ 图片合成 + 手势调整**
  - 背景图 + 角色图叠加
  - 👆 拖拽移动角色位置
  - ➕➖ 按钮缩放角色大小
  - 实时显示当前缩放比例
  - 截图保存功能
  - 分享功能

### 待实现 🚧

- [ ] 圣地数据库（地理位置 + 场景数据）
- [ ] 社区功能（分享 + 点赞）
- [ ] 自建抠图模型

## 🛠️ 技术栈

### 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| React Native | 0.83.2 | 跨平台移动应用框架 |
| Expo | 55.0.8 | 开发工具链和原生模块 |
| TypeScript | 5.9.2 | 类型安全的 JavaScript |
| React Navigation | 7.x | 页面路由和导航 |

### 主要依赖

| 库 | 用途 |
|------|------|
| expo-camera | 相机功能 |
| expo-image-picker | 图片选择 |
| expo-media-library | 相册访问 |
| expo-image-manipulator | 图片处理 |
| react-native-view-shot | 视图截图 |
| react-native-gesture-handler | 手势处理 |
| react-native-reanimated | 动画引擎 |
| @react-native-community/slider | 滑块控件 |

### 开发工具

- **Babel** - JavaScript 编译器
- **ESLint** - 代码规范检查
- **Prettier** - 代码格式化

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 或 **yarn** >= 1.22.0
- **Expo CLI** (推荐全局安装)
- **iOS**: macOS + Xcode 14+
- **Android**: Android Studio + JDK 11+

### 1. 克隆项目

```bash
git clone https://github.com/your-username/seichi-app.git
cd seichi-app
```

### 2. 安装依赖

```bash
npm install
# 或使用 yarn
yarn install
```

### 3. 配置环境变量（可选）

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，添加你的 API Key
```

#### 抠图 API 配置指南

<details>
<summary><b>Option 1: remove.bg (推荐)</b></summary>

1. 访问 [remove.bg](https://www.remove.bg/)
2. 注册账号并登录
3. 进入 [API 页面](https://www.remove.bg/api) 获取 API Key
4. 添加到 `.env` 文件：

```bash
REMOVE_BG_API_KEY=your_api_key_here
```

**免费额度**: 50次/月

</details>

<details>
<summary><b>Option 2: 腾讯云智能识图</b></summary>

1. 访问 [腾讯云官网](https://cloud.tencent.com/)
2. 注册并登录账号
3. 开通 [智能识图服务](https://cloud.tencent.com/product/iai)
4. 进入 [访问管理](https://console.cloud.tencent.com/cam/capi) 获取密钥
5. 添加到 `.env` 文件：

```bash
TENCENT_SECRET_ID=your_secret_id
TENCENT_SECRET_KEY=your_secret_key
```

**免费额度**: 1000次/月

</details>

> 💡 **提示**: 如果不配置 API Key，抠图功能将返回原图，但其他功能（拍照、合成、保存）仍可正常使用。

### 4. 运行项目

```bash
# 启动开发服务器
npx expo start

# iOS（需要 Mac + Xcode）
npm run ios

# Android（需要 Android Studio）
npm run android

# Web 浏览器
npm run web
```

### 5. 在真机上测试

1. 在手机上安装 **Expo Go** 应用
2. 运行 `npx expo start` 启动开发服务器
3. 使用 Expo Go 扫描终端中的二维码
4. 等待应用加载完成

> ⚠️ **注意**: 相机功能在 iOS 模拟器上不可用，请使用真机测试。

## 📖 使用流程

### 第一步：拍照取景 📷

1. 打开应用，授予相机和相册权限
2. 点击 **"添加参考图"** 从相册选择动漫场景图
3. 使用 **透明度滑块** 调节参考图透明度（0-100%）
4. 移动手机，对准实景角度，使参考图与现实场景重合
5. 点击 **快门按钮** 拍照

> 💡 **技巧**: 可以点击 🔄 按钮切换前后摄像头

### 第二步：选择角色 🎨

1. 拍照完成后自动进入角色选择页面
2. 三种方式获取角色：
   - **热门**: 选择内置的动漫角色
   - **我的上传**: 从相册上传自定义角色图片
   - **抠图**: 上传图片并自动去除背景
3. 点击角色卡片进行选择（选中会有蓝色边框）
4. 点击 **"确认选择"** 进入合成页面

### 第三步：创意合成 ✨

1. 查看背景图和角色图的合成效果
2. **调整角色位置**:
   - 👆 用手指 **拖拽** 角色到合适位置
3. **调整角色大小**:
   - ➕ 点击 **+** 按钮放大（最大 300%）
   - ➖ 点击 **-** 按钮缩小（最小 30%）
   - 实时显示当前缩放比例
4. **重置调整**:
   - ↺ 点击 **重置** 按钮恢复默认位置和大小
5. **保存作品**:
   - 💾 点击 **"保存到相册"** 保存到手机
   - 📤 点击 **"分享作品"** 分享到社交平台
   - 🔄 点击 **"重新拍摄"** 返回相机页面

## 📁 项目结构

```
seichi-app/
├── App.tsx                          # 应用入口 + 导航配置
├── app.json                         # Expo 配置（权限 + 主题）
├── babel.config.js                  # Babel 配置（reanimated 插件）
├── tsconfig.json                    # TypeScript 配置
├── package.json                     # 项目依赖和脚本
├── .env.example                     # 环境变量示例
├── .gitignore                       # Git 忽略文件
│
├── assets/                          # 静态资源
│   ├── icon.png                     # 应用图标
│   ├── splash-icon.png              # 启动页图标
│   ├── favicon.png                  # Web 图标
│   └── characters/                  # 内置角色图片
│
└── src/                             # 源代码目录
    ├── types.ts                     # TypeScript 类型定义
    │
    ├── screens/                     # 页面组件
    │   ├── CameraScreen.tsx         # 相机取景 + 参考图叠加
    │   ├── CharacterScreen.tsx      # 角色选择 + 抠图
    │   └── ResultScreen.tsx         # 合成结果 + 保存/分享
    │
    ├── services/                    # 服务层
    │   ├── imageProcessor.ts        # 图片处理（缩放/压缩）
    │   └── removeBgApi.ts           # 抠图 API 封装
    │
    └── utils/                       # 工具函数
        └── captureView.ts           # 视图截图工具
```

### 核心模块说明

| 模块 | 文件 | 说明 |
|------|------|------|
| **相机模块** | `CameraScreen.tsx` | 实现相机预览、参考图叠加、透明度调节、拍照功能 |
| **角色模块** | `CharacterScreen.tsx` | 角色选择、上传、抠图功能 |
| **合成模块** | `ResultScreen.tsx` | 图片合成、拖拽缩放、保存分享功能 |
| **抠图服务** | `removeBgApi.ts` | 封装 remove.bg 和腾讯云抠图 API |
| **图片处理** | `imageProcessor.ts` | 图片缩放、压缩、格式转换 |
| **截图工具** | `captureView.ts` | 将 React Native View 转换为图片 |

## 🔧 核心实现

### 1. 参考图叠加

使用 Expo Camera 实现相机预览，叠加半透明参考图：

```typescript
<CameraView ref={cameraRef} style={styles.camera} facing={facing}>
  {referenceImage && (
    <View style={styles.overlayContainer}>
      <Image
        source={{ uri: referenceImage }}
        style={[styles.overlayImage, { opacity }]}
        resizeMode="contain"
      />
    </View>
  )}
</CameraView>
```

### 2. 透明度控制

使用 Slider 组件实现平滑的透明度调节：

```typescript
<Slider
  style={styles.slider}
  value={opacity}
  onValueChange={setOpacity}
  minimumValue={0}
  maximumValue={1}
  step={0.01}
  minimumTrackTintColor="#667eea"
  maximumTrackTintColor="rgba(255,255,255,0.3)"
  thumbTintColor="#fff"
/>
```

### 3. 图片合成

使用 `react-native-view-shot` 捕获 View 为图片：

```typescript
import { captureRef } from 'react-native-view-shot';

const uri = await captureRef(viewRef, {
  format: 'png',
  quality: 1,
});
```

### 4. 拖拽手势

使用 PanResponder 实现角色拖拽：

```typescript
const panResponder = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newX = tempPosition.x + gestureState.dx;
      const newY = tempPosition.y + gestureState.dy;
      setPosition({ x: newX, y: newY });
    },
  })
).current;
```

### 5. 抠图 API

自动选择可用的抠图服务：

```typescript
export async function removeBackground(imageUri: string): Promise<RemoveBgResult> {
  // 优先使用 remove.bg
  if (REMOVE_BG_API_KEY) {
    return removeBgWithRemoveBg(imageUri);
  }
  
  // 备选腾讯云
  if (TENCENT_SECRET_ID && TENCENT_SECRET_KEY) {
    return removeBgWithTencent(imageUri);
  }
  
  // 没有配置 API key，返回原图
  return { success: true, uri: imageUri };
}
```

## 🗺️ 开发计划

### Phase 1: MVP ✅ (已完成)

- [x] 相机取景 + 参考图叠加
- [x] 透明度滑块调节
- [x] 前后摄像头切换
- [x] 基础角色选择（热门/上传/抠图）
- [x] 图片合成 + 拖拽缩放
- [x] 保存到相册
- [x] 分享功能

### Phase 2: 完善体验 🚧 (进行中)

- [ ] 手势调整角色位置 ✅ (已完成)
- [ ] 圣地数据库（种子数据）
- [ ] 离线缓存
- [ ] 更多内置角色
- [ ] 角色搜索功能

### Phase 3: 社区功能 🚧 (计划中)

- [ ] 用户上传圣地
- [ ] 作品分享 + 点赞
- [ ] 评论功能
- [ ] 发现附近圣地
- [ ] 用户个人主页

### Phase 4: AI 增强 🚧 (未来)

- [ ] 自建抠图模型（减少 API 依赖）
- [ ] 自动场景匹配
- [ ] 光线融合算法
- [ ] 风格迁移
- [ ] AR 实时预览

## ❓ 常见问题

<details>
<summary><b>Q: 为什么没有抠图效果？</b></summary>

A: 需要配置 `REMOVE_BG_API_KEY` 或腾讯云密钥。没有配置时，抠图功能会返回原图。

**解决方法**:
1. 复制 `.env.example` 为 `.env`
2. 按照 [抠图 API 配置指南](#抠图-api-配置指南) 获取 API Key
3. 重启应用

</details>

<details>
<summary><b>Q: 保存的图片没有角色？</b></summary>

A: 可能是 `react-native-view-shot` 未正确安装。

**解决方法**:
```bash
# iOS
cd ios && pod install && cd ..

# 重新安装依赖
npm install

# 清理缓存
npx expo start --clear
```

</details>

<details>
<summary><b>Q: 相机黑屏？</b></summary>

A: 可能是权限问题或模拟器限制。

**解决方法**:
1. 检查相机权限是否已授予
2. iOS 模拟器不支持相机，请使用真机测试
3. Android 模拟器需要配置摄像头

</details>

<details>
<summary><b>Q: 应用崩溃或无法启动？</b></summary>

A: 可能是依赖版本不兼容。

**解决方法**:
```bash
# 清理 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 清理 Expo 缓存
npx expo start --clear
```

</details>

<details>
<summary><b>Q: 如何添加自定义角色？</b></summary>

A: 在角色选择页面：
1. 点击 **"我的上传"** 标签
2. 点击 **"+ 上传角色"** 按钮
3. 从相册选择图片
4. 角色会自动添加到列表中

</details>

<details>
<summary><b>Q: 如何提高抠图质量？</b></summary>

A: 
1. 使用 remove.bg API（质量更好）
2. 上传清晰的角色图片
3. 选择背景简单的图片
4. 避免过于复杂的边缘（如头发丝）

</details>

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 规则
- 提交前运行 `npm run lint`
- 保持代码注释清晰

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 🙏 致谢

- [Expo](https://expo.dev/) - 优秀的 React Native 开发平台
- [React Navigation](https://reactnavigation.org/) - 强大的导航库
- [remove.bg](https://www.remove.bg/) - 高质量抠图 API
- [React Native View Shot](https://github.com/gre/react-native-view-shot) - 视图截图工具

## 📞 联系方式

- **作者**: Your Name
- **邮箱**: your.email@example.com
- **GitHub**: [@your-username](https://github.com/your-username)

## ⚡ 性能优化建议

### 图片优化

- 使用适当尺寸的图片（建议不超过 2048x2048）
- 压缩图片后再上传
- 使用 WebP 格式（如果支持）

### 应用优化

- 避免在列表中渲染大量图片
- 使用 `React.memo` 优化组件渲染
- 合理使用 `useCallback` 和 `useMemo`

### 内存管理

- 及时释放不需要的图片资源
- 避免内存泄漏（清理定时器、取消订阅）
- 监控应用内存使用情况

## 🔐 隐私说明

本应用需要以下权限：

| 权限 | 用途 | 必需 |
|------|------|------|
| 相机 | 拍摄圣地巡礼照片 | ✅ |
| 相册 | 保存和选择参考图 | ✅ |
| 网络 | 调用抠图 API | ❌ |

> 💡 所有图片处理均在本地完成，不会上传到服务器（除非使用抠图 API）。

## 📊 版本历史

### v1.0.0 (2024-03-23)

- ✨ 初始版本发布
- 📷 相机取景 + 参考图叠加
- 🎨 角色选择 + 抠图功能
- 🖼️ 图片合成 + 拖拽缩放
- 💾 保存到相册 + 分享功能

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/seichi-app&type=Date)](https://star-history.com/#your-username/seichi-app&Date)

## 📚 相关资源

- [Expo 官方文档](https://docs.expo.dev/)
- [React Native 官方文档](https://reactnative.dev/)
- [React Navigation 文档](https://reactnavigation.org/docs/getting-started)
- [remove.bg API 文档](https://www.remove.bg/api)

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️ Star 支持一下！**

[![GitHub stars](https://img.shields.io/github/stars/your-username/seichi-app?style=social)](https://github.com/your-username/seichi-app/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-username/seichi-app?style=social)](https://github.com/your-username/seichi-app/network/members)
[![GitHub issues](https://img.shields.io/github/issues/your-username/seichi-app)](https://github.com/your-username/seichi-app/issues)

Made with ❤️ for anime fans

</div>
