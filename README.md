# AI / Portfolio

孙颖的 AI 作品集：AI 产品判断、AI 协作开发、开源项目与 AI Native 研究。站点采用原生 HTML、CSS 与 JavaScript，可直接维护和部署。

此仓库维护公开作品集源文件，并通过 GitHub Pages 发布。页面只展示可公开核验的项目、研究判断与经历范围。

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
    ├── evidence-atlas.css
    ├── evidence-atlas.js
    └── assets/
        └── ...
```

当前视觉以真实项目截图、排版和贯穿页面的 SVG 证据线为核心。旧的生成素材仍保留在资源目录，但没有进入页面 DOM。

## 本地预览

作品集不依赖构建工具或后端服务，直接用浏览器打开即可。也可以在仓库根目录启动一个静态服务器：

```bash
python3 -m http.server 8000
```

然后访问 <http://localhost:8000/outputs/>。

## 内容结构

- AI 视角：从模型能力、工作系统、AI to B 的价值与信任谈起
- AI 协作开发：一手材料、架构拆解、仓库实现、测试与浏览器验证、Git 维护
- 项目经历：Slide Studio、Miaoda Game Remix、Transcript Fidelity、Personal Agent 与 AI Native 系统研究
- 前沿观察：原始来源、小实验与个人表达形成的学习方法
- 个人经历：百度与字节跳动的 AI 产品、Agent、评测和交付经历

页面只使用姓名“孙颖”，并收敛其余个人信息。项目按 `Open Source`、`Android Prototype`、`Research Direction` 标示证据边界。

## 更新方式

这是一个可以持续用 Git 维护的静态站点。内容结构在 `outputs/index.html`，视觉在 `outputs/evidence-atlas.css`，交互在 `outputs/evidence-atlas.js`。确认浏览器效果后提交：

```bash
git add README.md outputs/index.html outputs/evidence-atlas.css outputs/evidence-atlas.js outputs/assets/slide-studio-cover.png
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
