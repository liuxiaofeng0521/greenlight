# Agent 工具箱 — 速查表

## 如何调用

在对话中告诉 Claude 调用哪个 Agent。Claude 会用 `Agent` 工具调用对应的 subagent_type。

## 产品 & 策略

| Agent | subagent_type | 什么时候用 |
|-------|---------------|-----------|
| 产品经理 | product-manager | 写 PRD、定功能优先级、用户故事 |
| 趋势研究员 | trend-researcher | 市场调研、竞品分析、找蓝海 |
| 行为心理学 | behavioral-nudge-engine | 优化转化率、引导用户行为 |
| 反馈分析 | feedback-synthesizer | 整理用户反馈、提炼产品需求 |
| 实验追踪 | experiment-tracker | A/B 测试、功能实验 |
| 冲刺规划 | sprint-prioritizer | 敏捷规划、功能优先级排序 |

## 品牌 & 设计

| Agent | subagent_type | 什么时候用 |
|-------|---------------|-----------|
| 品牌顾问 | brand-guardian | 命名、品牌定位、视觉方向 |
| UI 设计师 | ui-designer | 界面设计规范、组件样式 |
| UX 架构师 | ux-architect | 交互流程、用户体验 |
| UX 研究员 | ux-researcher | 用户行为分析、可用性测试 |
| 视觉叙事 | visual-storyteller | 品牌故事、宣传物料 |
| 图像提示词 | image-prompt-engineer | AI 生成封面图、配图 |

## 营销 & 获客

| Agent | subagent_type | 什么时候用 |
|-------|---------------|-----------|
| 小红书专家 | xiaohongshu-specialist | 小红书内容策略、选题、避坑 |
| 内容创作者 | content-creator | 写笔记文案、文章 |
| 社交媒体策略 | social-media-strategist | 跨平台内容分发 |
| 增长黑客 | growth-hacker | 增长策略、裂变玩法 |
| SEO 专家 | seo-specialist | 搜索引擎优化 |
| 抖音策略 | douyin-strategist | 抖音/短视频内容 |
| 知乎策略 | zhihu-strategist | 知乎问答引流 |
| 公众号运营 | wechat-official-account | 公众号内容 |
| 短视频剪辑 | short-video-editing-coach | 视频内容制作指导 |

## 技术 & 开发

| Agent | subagent_type | 什么时候用 |
|-------|---------------|-----------|
| 软件架构师 | software-architect | 技术选型、架构设计 |
| 前端开发 | frontend-developer | 前端实现 |
| 后端架构 | backend-architect | 后端/API 设计 |
| 快速原型 | rapid-prototyper | 快速出 MVP |
| 代码审查 | code-reviewer | 代码质量把关 |
| 安全工程师 | security-engineer | 安全审计 |
| DevOps | devops-automator | CI/CD、部署 |
| 数据库优化 | database-optimizer | 数据库设计调优 |
| 微信小程序 | wechat-mini-program-developer | 小程序开发 |

## 销售 & 转化

| Agent | subagent_type | 什么时候用 |
|-------|---------------|-----------|
| 销售外展 | sales-outreach | 冷启动外展话术 |
| 客户服务 | customer-service | 客服话术 |
| 提案策略 | proposal-strategist | 商业提案/标书 |
| 销售教练 | sales-coach | 转化话术优化 |
| 私域运营 | private-domain-operator | 微信私域、社群运营 |

## 运营 & 管理

| Agent | subagent_type | 什么时候用 |
|-------|---------------|-----------|
| 财务分析师 | financial-analyst | 定价模型、财务测算 |
| 合规检查 | legal-compliance-checker | 法律合规审查 |
| 项目管理 | project-shepherd | 项目进度管理 |
| 技术文档 | technical-writer | API 文档、使用说明 |
| 执行摘要 | executive-summary-generator | 商业计划书摘要 |

## 已验证好用的 Agent（已产出过）

1. **xiaohongshu-specialist** — 10 个选题 + 发布策略 + 评论区话术
2. **product-manager** — 完整 PRD + 用户故事 + 成功指标
3. **brand-guardian** — 品牌命名 + 配色 + 文案风格
4. **ui-designer** — 设计规范 + CSS 变量 + 交互状态
5. **software-architect** — 技术架构 + 算法选型 + 部署方案

## 使用原则

1. 每次调用给清晰的 prompt（背景 + 想要什么产出 + 格式要求）
2. 多个 Agent 可并行调用（它们互相独立）
3. 产出存档到 `docs/agents-output/`
4. 每次调用都是一次性咨询，不会自动记上下文
