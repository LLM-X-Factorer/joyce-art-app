# 信源回链与数字审计

日期：2026-09-19。角色：独立信源回链／数字审计，只审不改。

**角色裁决：PASS。** HIGH 0 条；CRITICAL 0 条。信源回链维度建议 9.5/10；扣分仅为复算脚本跨机器可用性，非算术或来源错误。本裁决仅覆盖本角色，不替代其他角色及总审裁决。

## 标尺与因端核对

已读 `references/audit-rules.md`，并以 `named-failures.md` 电享 v1/v3 对照为锚：防止把尚未验证的“无人供给”或品类标签当作壁垒。本报告的对象是 Common Room 的早期业务选择，不是上市公司估值；不因缺少尚未开展的访谈或真实成交而要求虚构现有数据。

因端是用户已确认的范围：中国大陆及海外华语学生，比较科目备考、艺术分析写作、学校／教师合作，输出成本与试点。果端第 2、5、6、8 章与该范围相符。双向验证：**因端 ✓，果端 ✓**。

审阅正文 `docs/research/ALEVEL_ART_HISTORY_BUSINESS_RESEARCH.md`，并对照 `sources.json`、`scan_2026-09-19.json`、`compete_2026-09-19.json`、`unit_economics.json`、`unit_economics_operations.json`、`calculations.md` 和复算脚本。没有修改这些文件。

## 来源及口径核查

| 正文位置 | 核查证据 | 裁决理由 |
| --- | --- | --- |
| 第 3 章，行 162、170：715 人 | 独立重新打开 [Pearson 2026 PDF](https://qualifications.pearson.com/content/dam/pdf/Support/Grade-statistics/A-level/grade-statistics-june-2026-provisional-advance-level.pdf)：封面 UK Only；PDF 第 6 页 9HT0 Total Sat 715 | PASS。正文明确临时统计、英国当期参考人数，并排除中国、全球、在读人数及培训买家口径。 |
| 第 3 章，行 171—176：838、483、80 家及冲突 | 独立重新打开 [AAH 原 PDF](https://courtauld.ac.uk/wp-content/uploads/2025/11/AAH-report-FINAL.pdf)：附录 3 为 2019=483、2025=838；正文写 42%；机构表述为 80 家。另核 [发布新闻](https://courtauld.ac.uk/news-blogs/2025/courtauld-association-for-art-history-report/) 的 122 家基年为 2016，而 PDF 为 2014 | PASS。报告保留两处冲突，采用明确公式核算，不将来源冲突静默清洗成确定趋势。80 家未误写为考试中心。 |
| 第 3 章，行 171：2025 PDF 访问限制 | 独立访问 [Pearson 2025 原地址](https://qualifications.pearson.com/content/dam/pdf/Support/Grade-statistics/A-level/grade-statistics-june-2025-provisional-advanced-level.pdf)，仍跳转 404；838 可在 AAH 附表直接核对 | PASS。报告诚实区分索引与可读 PDF，且说明两个出处可能同一上游；本审未把搜索索引当独立原始验证。 |
| 第 4 章，行 216—218：英国价格 | 独立核对 [NEC 常规](https://www.nec.ac.uk/course/a-level-history-of-art/)、[NEC fast track](https://www.nec.ac.uk/course/structured-fast-track-a-level-history-of-art/) 和 [Oxbridge](https://oxbridgehomelearning.uk/course/a-level-history-of-art/)：£730、£1499、£395、促销 £597；24/12/24 个月支持表述相符 | PASS。正文均归为机构展示；未把标价当成交，未将英镑换算为国内愿付价格；考费另计。 |
| 第 4 章，行 219：免费服务 | 独立核对 [AHLU 项目页](https://www.arthistorylinkup.org/programmes/art-history-a-level)：state sponsored Y12/Y13，免费，2026-09-04 申请截止 | PASS。没有将特定人群的公益服务写成中国学生均可获得的免费替代。 |
| 第 4 章，行 220—221：国内供给 | 独立核对 [英萃](https://study.intergreat.com/zh-hans/subject/16177.html) 独立艺术史入口和 Robert J.、Ailsa M. 展示；惟世访问限制按底稿保留 | PASS。仅据此排除“没有任何供给”，未升级为师资、排期、中文授课或销量已核实。 |
| 第 9 章：资料表与缺失 | 逐项对照正文引用位置 | PASS。所列资料均有实际论证用途。来源池中未全部写入正文的检索线索没有被冒充正文参考文献或独立验证数量。 |

## 算术与模型复核

独立用 Python `Decimal` 按日志输入重算全部 **90 项原始运算**，并按公式重新构造全部 **6 个情景**；与 JSON 输出对账，差异 **0 项**。本审没有直接执行会覆写底稿的 `reproduce_unit_economics.py`。

市场核算复算输出：

```text
(838 - 483) / 483 × 100 = 73.49896480331262939958592133
(715 - 838) / 838 × 100 = -14.67780429594272076372315036
715 - 838 = -123
```

正文显示 73.50%、−14.68% 和 −123 与底稿一致。六年累计变化没有被写成年度增长率。

| 第 6 章情景 | 重复工时 | 重复余量 | 首期余量 | 对账 |
| --- | ---: | ---: | ---: | --- |
| 6 人，1,980 元 | 31 | 1,086 | −4,914 | PASS |
| 6 人，2,480 元 | 31 | 3,936 | −2,064 | PASS |
| 6 人，2,980 元 | 31 | 6,786 | 786 | PASS |
| 仅 4 人 | 26 | 924 | −5,076 | PASS |
| 每次反馈 60 分钟 | 43 | 336 | −5,664 | PASS |
| 劳动 500 元／小时 | 31 | −2,264 | −12,264 | PASS |

两项保本价 1,789.47 元、2,842.11 元按模型精确值四舍五入一致。摘要、服务卡、第 6 章与第 8 章采用相同的 4 次课堂、2 篇短文、每生 4 次反馈定义，未发现服务次数与成本脱节。

第 6 章将 2,480 元、班额、劳动单价、时间、材料、技术、5% 预留和首次投入全部标为方案假设。说明作者时间是机会成本，说明未计实际税额、经营条件、机构分成和产品开发；没有声称余量就是已实现净利润。收入预留没有伪装为实测退款率。中国成交、学习效果、复购和 LTV 的缺失在第 1、6、8、9 章均明确，并对应后续验证动作。

## 非阻断建议

**LOW：复算脚本依赖本机技能路径。** `reproduce_unit_economics.py` 的 `CLI` 固定为 `/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py`。第 6 章称“可用脚本复算”，本机成立，但其他 GitHub 阅读者没有该技能路径时无法直接运行。建议交付前补一句依赖说明，或提供可配置路径／自包含复算入口。公式、原始输入输出和结果已完整保存，因此不影响本轮数字可审计性，不升格 HIGH。

## 开放题与定向回写

本角色另外检查了“学生=付款人”“考试中心=开课机构”“平台展示价=实际成交”“假设余量=已实现利润”四种容易跨口径的问题，均未发现未披露混用。经营条件和素材授权尚缺确认，正文已明确列入开班前核实，不能以本审 PASS 推断经营合法性或教学效果。

无 HIGH／CRITICAL 定向重写要求。保留当前数据限制和假设说明，不为了降低不确定性而补写虚构数字。
