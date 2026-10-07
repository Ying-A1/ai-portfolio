# THE CUT / AI Portfolio

孙颖的 AI 作品集：以五幕项目电影呈现 AI、Agent、Harness、开源项目与 AI Native 研究。站点采用原生 HTML、CSS 与 JavaScript，可直接维护和部署。

此仓库维护作品集源文件，并通过 GitHub Pages 发布。页面只展示已核对且适合公开的项目事实、研究范围与经历概述。

## 目录

```text
.
├── README.md
├── .gitignore
├── .github/
│   └── workflows/
│       └── validate.yml
└── outputs/
    ├── index.html
    ├── the-cut.css
    ├── the-cut.js
    └── assets/
        └── ...
```

当前视觉以电影片头、共享叙事舞台和真实 Slide Studio 界面为核心。GPT Image 2 生成的无文字材料只承担片头与系统剖面的氛围；所有文字仍由 HTML 排版，产品能力仍由真实截图和可核验文字表达。页面只引用 `the-cut.css` 和 `the-cut.js`。

## 本地预览

作品集不依赖构建工具或后端服务，直接用浏览器打开即可。也可以在仓库根目录启动一个静态服务器：

```bash
python3 -m http.server 8000
```

然后访问 <http://localhost:8000/outputs/>。

## 内容结构

- AI 视角：AI 理解上下文，Agent 进入行动，Harness 管理状态、权限与验证
- AI 协作开发：一手材料、目标界定、仓库实现与结果验证
- 项目经历：Slide Studio、Miaoda Game Remix、Transcript Fidelity、Personal Agent 与 AI Native 系统研究
- 个人经历：百度与字节跳动的 AI 产品、Agent、评测和交付经历

页面个人信息只使用姓名“孙颖”，不展示学校、学历、联系方式、客户信息或凭证。项目按 `Open Source`、`Android Prototype`、`Research Direction` 标示事实与验证边界。

## 更新方式

这是一个可以持续用 Git 维护的静态站点。内容结构在 `outputs/index.html`，视觉在 `outputs/the-cut.css`，交互在 `outputs/the-cut.js`。确认浏览器效果后提交：

```bash
git add .github/workflows/validate.yml README.md outputs/index.html outputs/the-cut.css outputs/the-cut.js outputs/assets/the-cut-context-field.webp outputs/assets/the-cut-agent-cutaway.webp outputs/assets/slide-studio/
git commit -m "更新作品集"
```

更新前先确认目标分支和 Diff，再推送：

```bash
git status --short --branch
git diff --check
git push origin main
```

当前仓库不依赖 npm、打包器或外部运行时资源。`.github/workflows/validate.yml` 检查入口文件、JavaScript 语法、页面锚点及本地素材引用；`.github/workflows/pages.yml` 负责公开 Pages 发布。

## 发布前检查

- 确认个人简介、时间线和项目描述均为可公开且已核验的信息
- 在桌面与移动端浏览器检查导航、锚点、排版和可读性
- 在桌面与移动端确认控制台无报错，键盘焦点与减弱动效模式可用
- 发布前运行 `git diff --check`，避免提交空白字符错误
- 使用 `python3 -m http.server 8000` 从仓库根目录预览，不把本地文件路径或失效的 Pages 地址作为对外链接
