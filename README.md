# AI / Portfolio

孙颖的 AI 作品集：AI to B 观点、Claude / Claude Code 工作方法、开源项目与 AI Native 终端实践。站点采用原生 HTML、CSS 与 JavaScript，可直接维护和部署。

## 目录

```text
.
├── README.md
├── .gitignore
├── .github/
│   └── workflows/
│       └── pages.yml
└── outputs/
    ├── index.html
    ├── styles.css
    ├── app.js
    └── assets/
        ├── slide-studio-cover.png
        └── hero-signal.png
```

页面中的 `data-generated-asset` 标记是可替换的 GPT Image 2 素材位。即使尚未放入生成图，CSS 视觉也会完整显示；后续可将无文字、无 Logo 的背景素材接入这些位置。

## 本地预览

作品集不依赖构建工具或后端服务，直接用浏览器打开即可。也可以在仓库根目录启动一个静态服务器：

```bash
python3 -m http.server 8000
```

然后访问 <http://localhost:8000/outputs/>。

## 内容结构

- AI 视角：从模型能力、工作系统、AI to B 的价值与信任谈起
- Claude × Claude Code：定义问题、补充上下文、协作执行、人工复盘
- 项目经历：Slide Studio、Miaoda Game Remix、Transcript Fidelity、Personal Agent、AI Native OS、AI 居民
- 前沿观察：原始来源、小实验与个人表达形成的学习方法
- 个人经历：百度与字节跳动的 AI 产品、Agent、评测和交付经历

公开页面仅使用姓名“孙颖”，不展示学校、学历、电话、邮箱或其他具体个人信息。项目按 `Open Source`、`Private Prototype`、`Product Research` 标示证据边界。

## 更新方式

这是一个可以持续用 Git 维护的静态站点。内容结构在 `outputs/index.html`，视觉在 `outputs/styles.css`，交互在 `outputs/app.js`。确认浏览器效果后提交：

```bash
git add README.md outputs/index.html outputs/styles.css outputs/app.js outputs/assets
git commit -m "更新作品集"
```

如果后续配置了 GitHub 远程仓库，再按仓库地址添加 `origin` 并推送：

```bash
git remote add origin <your-github-repository-url>
git push -u origin main
```

当前仓库不依赖 npm、打包器或外部资源。`.github/workflows/pages.yml` 会在 `main` 分支更新时将 `outputs/` 目录发布到 GitHub Pages，也可以在 GitHub Actions 中手动触发。

## 发布前检查

- 确认个人简介、时间线和项目描述均为可公开且已核验的信息
- 在桌面与移动端浏览器检查导航、锚点、排版和可读性
- 在桌面与移动端确认控制台无报错，键盘焦点与减弱动效模式可用
- 发布前运行 `git diff --check`，避免提交空白字符错误
