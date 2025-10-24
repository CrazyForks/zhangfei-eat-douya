# 升级说明 - 增强的图片管理功能

## 新增功能概览

本次更新为系统添加了全面的图片管理功能，包括多图片源支持、本地图库管理和用户上传功能。

## 主要更新

### 1. 多图片 API 支持
- ✅ **Unsplash**（原有）- 高质量免费图片
- ✨ **Pexels**（新增）- 丰富的免费图片和视频
- ✨ **Pixabay**（新增）- 免费图片和插画资源

### 2. 智能图片源优先级策略
- 可自定义图片源优先级顺序
- 自动降级机制：如果首选源失败，自动尝试下一个
- 支持的图片源类型：
  - `user_uploaded` - 用户手动上传的图片
  - `unsplash` - Unsplash API
  - `pexels` - Pexels API
  - `pixabay` - Pixabay API
  - `local` - 本地图库

### 3. 本地图库管理
- 支持配置多个本地图片目录
- 为每个目录设置标签（tags）
- 系统根据文章关键词智能匹配标签
- 示例配置：
  ```json
  "local_image_directories": [
    {
      "path": "pic",
      "tags": ["default", "general"]
    },
    {
      "path": "images/nature",
      "tags": ["nature", "landscape", "outdoor"]
    },
    {
      "path": "images/tech",
      "tags": ["technology", "business", "computer"]
    }
  ]
  ```

### 4. 用户上传功能
- 支持手动上传图片用于特定文章
- 支持的格式：png, jpg, jpeg, gif, webp, bmp
- 上传的图片保存在配置的 `uploaded_images_dir` 目录
- API 接口：`/api/upload-image`

## 新增 API 接口

### 测试图片 API
- `POST /api/test-pexels` - 测试 Pexels API 配置
- `POST /api/test-pixabay` - 测试 Pixabay API 配置

### 图片管理
- `POST /api/upload-image` - 上传图片
- `GET /api/list-local-images` - 列出本地图库中的所有图片
- `GET /api/list-uploaded-images` - 列出用户上传的所有图片

### 配置接口更新
- `GET /api/config` - 新增字段：
  - `pexels_api_key_set` - Pexels API Key 状态
  - `pixabay_api_key_set` - Pixabay API Key 状态
  - `image_source_priority` - 图片源优先级配置
  - `local_image_directories` - 本地图片目录配置
  - `enable_user_upload` - 是否启用用户上传
  - `uploaded_images_dir` - 上传图片保存目录

## 配置文件变更

### config.json 新增字段

```json
{
  "pexels_api_key": "YOUR_PEXELS_API_KEY",
  "pixabay_api_key": "YOUR_PIXABAY_API_KEY",
  "image_source_priority": ["unsplash", "pexels", "pixabay", "local", "user_uploaded"],
  "local_image_directories": [
    {
      "path": "pic",
      "tags": ["default", "general"]
    }
  ],
  "enable_user_upload": true,
  "uploaded_images_dir": "uploads"
}
```

### 默认值
- `image_source_priority`: `["unsplash", "pexels", "pixabay", "local"]`
- `local_image_directories`: `[{"path": "pic", "tags": ["default"]}]`
- `enable_user_upload`: `true`
- `uploaded_images_dir`: `"uploads"`

## 升级步骤

### 1. 更新代码
```bash
# 备份现有配置
cp config.json config.json.backup

# 更新代码文件
# app.py 已更新
# config.example.json 已更新
```

### 2. 安装依赖（如需要）
```bash
pip install -r requirements.txt
```

注：本次更新主要使用现有依赖，无需安装新包。

### 3. 更新配置文件

如果你想使用新功能，需要在 `config.json` 中添加相关配置：

```json
{
  "gemini_api_key": "your_existing_key",
  "unsplash_access_key": "your_existing_key",

  // 新增：Pexels API（可选）
  "pexels_api_key": "YOUR_PEXELS_KEY",

  // 新增：Pixabay API（可选）
  "pixabay_api_key": "YOUR_PIXABAY_KEY",

  // 新增：图片源优先级（可选，有默认值）
  "image_source_priority": ["unsplash", "pexels", "pixabay", "local"],

  // 新增：本地图库配置（可选，有默认值）
  "local_image_directories": [
    {
      "path": "pic",
      "tags": ["default"]
    }
  ],

  // 新增：用户上传功能（可选，默认启用）
  "enable_user_upload": true,
  "uploaded_images_dir": "uploads",

  // 保持原有配置...
  "pandoc_path": "your_pandoc_path",
  "default_model": "gemini-pro",
  "max_concurrent_tasks": 3
}
```

### 4. 创建必要的目录

```bash
# 创建上传目录
mkdir uploads

# 创建额外的本地图片目录（可选）
mkdir -p images/nature
mkdir -p images/tech
```

### 5. 重启应用

```bash
python app.py
```

## 向后兼容性

✅ **完全向后兼容** - 如果不配置新功能，系统将继续使用原有的方式工作：
- 仅使用 Unsplash（如果已配置）
- 或从 `pic` 目录随机选择图片

## 功能测试

### 测试 API 连接
1. 访问配置页面：`http://localhost:5000/config`
2. 输入 API Key
3. 点击"测试 API"按钮验证连接

### 测试图片下载
1. 在写作页面输入主题
2. 点击生成
3. 查看控制台日志，确认图片源尝试顺序和结果

### 测试本地图库
1. 在配置的本地目录中放入图片
2. 配置相应的标签
3. 生成文章时系统会自动匹配

### 测试用户上传
1. 访问写作页面
2. 点击"上传图片"按钮
3. 选择本地图片文件
4. 上传成功后生成文章

## 使用建议

### 推荐配置策略

#### 策略 1：在线优先（推荐）
适合有稳定网络连接的环境：
```json
"image_source_priority": ["unsplash", "pexels", "pixabay", "local"]
```

#### 策略 2：离线优先
适合网络不稳定或离线环境：
```json
"image_source_priority": ["local", "unsplash", "pexels", "pixabay"]
```

#### 策略 3：用户控制优先
适合需要精确配图的场景：
```json
"image_source_priority": ["user_uploaded", "local", "unsplash", "pexels", "pixabay"]
```

### API 配额管理

考虑到免费 API 的配额限制，建议：
1. 配置多个 API 源作为备选
2. 设置合理的优先级顺序
3. 准备本地图库作为最终兜底

## 常见问题

### Q: 升级后原有配置会丢失吗？
A: 不会。系统会保留所有原有配置，新字段使用默认值。

### Q: 必须配置所有图片 API 吗？
A: 不必须。你可以只配置需要的 API，未配置的源会被自动跳过。

### Q: 本地图库标签如何匹配？
A: 系统从文章中提取关键词，与目录标签进行匹配。匹配算法支持部分匹配和模糊匹配。

### Q: 图片从哪里下载？
A:
- API 图片临时保存在 `output` 目录，生成文档后自动删除
- 用户上传的图片保存在配置的 `uploaded_images_dir` 目录
- 本地图库的图片原地使用，不会复制

### Q: 如何查看图片源使用情况？
A: 查看控制台日志，系统会输出详细的图片源尝试和结果信息。

## 技术支持

详细使用指南请参考：`IMAGE_CONFIG_GUIDE.md`

如遇问题，请检查：
1. 控制台日志输出
2. API Key 是否正确
3. 网络连接状态
4. 本地目录权限

## 更新日志

### v2.0.0 (2024-XX-XX)
- ✨ 新增 Pexels API 支持
- ✨ 新增 Pixabay API 支持
- ✨ 新增图片源优先级配置
- ✨ 新增本地图库管理（多目录、标签）
- ✨ 新增用户上传图片功能
- ✨ 新增图片源降级策略
- 🐛 修复图片下载超时问题
- 📝 添加详细配置文档

## 贡献者

感谢所有为此功能做出贡献的开发者！

---

**注意**：请在生产环境部署前，在测试环境充分测试新功能。
