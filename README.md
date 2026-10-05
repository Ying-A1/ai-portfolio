# AI / Portfolio

一份关于 AI 理解、AI to B 观察、个人项目与工作方法的静态 HTML 作品集。

## 目录

```text
.
├── README.md
├── .gitignore
└── outputs/
    └── portfolio.html
```

## 本地预览

作品集不依赖构建工具或后端服务，直接用浏览器打开即可。也可以在仓库根目录启动一个静态服务器：

```bash
python3 -m http.server 8000
```

然后访问 <http://localhost:8000/outputs/portfolio.html>。

## 内容结构

- AI 视角：从模型能力、工作系统、AI to B 的价值与信任谈起
- Claude × Claude Code：定义问题、补充上下文、协作执行、人工复盘
- 项目经历：Slide Studio / 秒哒、Personal Agent、AI Native OS、AI 居民
- 前沿观察：原始来源、小实验与个人表达形成的学习方法
- 个人经历：简历、教育与实习信息的展示区

## 更新方式

这是一个可以持续用 Git 维护的静态站点。日常修改 `outputs/portfolio.html`，确认浏览器效果后提交：

```bash
git add README.md .gitignore outputs/portfolio.html
git commit -m "更新作品集"
```

如果后续配置了 GitHub 远程仓库，再按仓库地址添加 `origin` 并推送：

```bash
git remote add origin <your-github-repository-url>
git push -u origin main
```

当前仓库不依赖 npm、打包器或外部资源，适合直接发布到 GitHub Pages、静态托管服务或个人服务器。

## 发布前检查

- 确认个人简介、联系方式、时间线和项目描述均为可公开且已核验的信息
- 在桌面与移动端浏览器检查导航、锚点、排版和可读性
- 发布前运行 `git diff --check`，避免提交空白字符错误
