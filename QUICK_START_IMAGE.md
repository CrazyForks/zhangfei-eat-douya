# 图片功能快速开始指南

## 5 分钟快速配置

### 方案 1：仅使用本地图库（离线可用）

**适合场景**：没有网络或不想依赖外部 API

1. **准备图片目录**
   ```bash
   # 创建图片目录
   mkdir -p images/default

   # 复制一些图片到目录中
   # 支持格式：png, jpg, jpeg, gif, webp, bmp
   ```

2. **编辑 config.json**
   ```json
   {
     "gemini_api_key": "your_key",
     "pandoc_path": "pandoc",
     "image_source_priority": ["local"],
     "local_image_directories": [
       {
         "path": "images/default",
         "tags": ["default"]
       }
     ]
   }
   ```

3. **完成！** 开始生成文章，系统会自动从本地图库随机选择图片。

---

### 方案 2：使用在线 API（推荐）

**适合场景**：有稳定网络，希望获得高质量配图

#### 步骤 1：获取 API 密钥

选择一个或多个服务（推荐至少配置 2 个作为备份）：

**Unsplash（推荐）**
1. 访问 https://unsplash.com/developers
2. 创建应用，获取 Access Key
3. 免费配额：50次/小时

**Pexels**
1. 访问 https://www.pexels.com/api/
2. 注册并获取 API Key
3. 免费配额：200次/小时

**Pixabay**
1. 访问 https://pixabay.com/api/docs/
2. 注册后在设置中获取 API Key
3. 免费配额：100次/分钟

#### 步骤 2：配置 API

在 `config.json` 中添加：

```json
{
  "gemini_api_key": "your_gemini_key",
  "unsplash_access_key": "your_unsplash_key",
  "pexels_api_key": "your_pexels_key",
  "pixabay_api_key": "your_pixabay_key",
  "image_source_priority": ["unsplash", "pexels", "pixabay", "local"]
}
```

#### 步骤 3：测试 API

1. 启动应用：`python app.py`
2. 访问：http://localhost:5000/config
3. 点击每个 API 的"测试"按钮
4. 确认显示"工作正常"

#### 步骤 4：开始使用

访问 http://localhost:5000，输入主题，点击生成！

---

### 方案 3：混合模式（最稳定）

**适合场景**：追求最高可用性，多重保障

```json
{
  "image_source_priority": [
    "unsplash",    // 首选：最高质量
    "pexels",      // 备选 1
    "pixabay",     // 备选 2
    "local"        // 兜底：本地图库
  ],
  "local_image_directories": [
    {
      "path": "pic",
      "tags": ["default", "general"]
    }
  ]
}
```

这样配置后：
- ✅ Unsplash 优先，质量最高
- ✅ 如果 Unsplash 失败，自动尝试 Pexels
- ✅ 如果 Pexels 失败，尝试 Pixabay
- ✅ 如果所有 API 都失败，使用本地图库
- ✅ 确保 100% 有图可用

---

## 高级功能

### 1. 按主题分类本地图库

创建目录结构：
```
images/
├── nature/      # 自然风光
├── tech/        # 科技商务
├── food/        # 美食
└── travel/      # 旅行
```

在 `config.json` 中配置：
```json
{
  "local_image_directories": [
    {
      "path": "images/nature",
      "tags": ["nature", "landscape", "outdoor", "mountain", "forest", "ocean"]
    },
    {
      "path": "images/tech",
      "tags": ["technology", "computer", "business", "innovation", "digital"]
    },
    {
      "path": "images/food",
      "tags": ["food", "cooking", "recipe", "restaurant", "cuisine"]
    }
  ]
}
```

系统会自动匹配文章关键词和标签，选择最相关的图片！

### 2. 手动上传图片

如果你想为某篇特定文章使用特定图片：

1. 在写作页面点击"上传图片"
2. 选择本地图片文件
3. 上传成功后，在优先级中添加 `user_uploaded`：
   ```json
   "image_source_priority": ["user_uploaded", "unsplash", "pexels", "local"]
   ```
4. 生成文章时会优先使用你上传的图片

---

## 常用配置模板

### 模板 1：完全自动化
```json
{
  "unsplash_access_key": "xxx",
  "pexels_api_key": "xxx",
  "pixabay_api_key": "xxx",
  "image_source_priority": ["unsplash", "pexels", "pixabay"]
}
```

### 模板 2：离线优先
```json
{
  "image_source_priority": ["local", "unsplash"],
  "local_image_directories": [
    {"path": "images/stock", "tags": ["default"]}
  ]
}
```

### 模板 3：精准控制
```json
{
  "image_source_priority": ["user_uploaded", "local"],
  "enable_user_upload": true,
  "uploaded_images_dir": "uploads"
}
```

---

## 故障排除

### 问题：所有 API 都显示失败
**解决方案**：
1. 检查 API Key 是否正确
2. 检查网络连接
3. 确认没有超出配额限制
4. 使用测试按钮验证单个 API

### 问题：本地图库不工作
**解决方案**：
1. 确认目录路径正确（相对或绝对路径）
2. 确认目录中有图片文件
3. 确认图片格式被支持
4. 检查文件权限

### 问题：图片不匹配主题
**解决方案**：
1. 优化本地图库的标签配置
2. 创建更多主题目录
3. 使用用户上传功能手动选择

---

## 性能优化建议

### 1. 配额管理
- 配置多个 API 源分散请求
- 设置合理的优先级
- 准备本地图库兜底

### 2. 响应速度
- 本地图库响应最快
- API 请求有 10 秒超时
- 多级降级确保不阻塞

### 3. 图片质量
- Unsplash 质量最高
- Pexels 资源丰富
- Pixabay 插画较多

---

## 下一步

- 📖 阅读完整文档：`IMAGE_CONFIG_GUIDE.md`
- 🔄 查看升级说明：`UPGRADE_NOTES.md`
- 💡 探索更多配置选项

**开始创作吧！** 🚀
