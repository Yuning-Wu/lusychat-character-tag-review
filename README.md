# LusyChat 角色 Tag · GPT-5.6 Sol 150 条审核

这是一个只读静态审核页，展示 150 个正式库角色由 GPT-5.6 Sol 完成的一次性 Tag 初筛结果，每页 50 条。

- 全量范围：`status=1`、`station=100`、`visible IN (Public, Unlisted)`；本次刷新时共 4,069 个角色。
- 本次抽样：145 个 Public、5 个 Unlisted；之前 100 个角色已用同一 Sol 方法重新审核。
- 新增和删除候选仅使用当前 116 个常规 Tag；4 个活动 Tag 不参与 AI 增删。
- 同时展示新增与严格删除建议；Xiaoya 评论涉及的 Tag 禁止删除。
- 所有建议均未写入正式库。
- `Female` 已从正式目录删除；`Size Difference`、`Taboo` 已正常启用。
- 六个 GPT-5.6 Sol 子 Agent 分别处理独立角色片段；每个角色只执行一次综合筛选。
- 新增置信度不低于 70；删除不低于 95，且只保留角色原文与当前 Tag 的直接事实冲突。
- 页面 UI 与 AI 建议使用简体中文；角色原信息及当前 Tag 使用 `zh-TW` 多语言内容。

打开 `index.html` 即可查看，线上版本由 GitHub Pages 发布。
