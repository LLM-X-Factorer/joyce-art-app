# 研究状态

更新：2026-09-19。

- 用户请求：深挖 A-level 艺术培训与 Common Room 商业机会。
- 已完成：核对资格、英国最新考生口径、国内外供给、公开价格、报名限制、升学要求、地方经营条件；记录反方证据和数字矛盾。
- 用户已确认[研究框架](../../docs/research/ALEVEL_ART_HISTORY_RESEARCH_FRAMEWORK.md)，原话“确认”。[正式研究正文](../../docs/research/ALEVEL_ART_HISTORY_BUSINESS_RESEARCH.md)已形成，包含三路径比较、成本测算和执行步骤；内容审计 **PASS**，17 页 PDF 已逐页视觉检查并通过。
- 尚未执行的一手验证：用户/教师/学校访谈、真实报价和付费验证、教师样课、具体中国考点下一考季确认、实际法律适用判断。它们是报告给出的后续业务工作，不是本次公开研究已经证明的结果。
- 用户已授权将本轮文档、研究正文和核验底稿提交并推送至 GitHub，然后结束本轮工作。交付范围为资料归档；没有执行产品开发、部署、对外联系、报名或收款。

## 文件

- [来源清单](sources.json)：简要证据与访问限制，不存网页全文、评论账号或私人信息。
- [市场与课程底稿](scan_2026-09-19.json)
- [竞争与供给底稿](compete_2026-09-19.json)
- [业务假设与后续验证](bizmodel_2026-09-19.json)
- [计算底稿](calculations.md)、[原始输出](calculations.json)、[复算脚本](reproduce_calculations.py)
- [正式报告 PDF](../../docs/research/ALEVEL_ART_HISTORY_BUSINESS_RESEARCH.pdf)、[内容主审](audit_final.md)、[逐页视觉验收](pdf_qa.md)
- [来源审计](audit_sources.md)、[证据标注审计](audit_evidence.md)、[图表审计](audit_charts.md)、[结构审计](audit_structure.md)：均 PASS，无未关闭 HIGH 或 CRITICAL。

## 继续的起点

研究范围已锁定。业务继续的起点是正文第 8 章的第一阶段：核实任务、样课、考试和经营条件，尚未授权对外联系或招生。试教时补充通用 AI／原教师替代测试，并先校准四维量表及具体锚例；它们是主审保留的后续验证项。再次使用市场数字时保留英国 2026 临时统计的 UK Only 范围、2025 原链接访问限制、AAH 百分比冲突及中国具体报名通路缺口。

## 复现与依赖

成本计算见 [unit_economics.md](unit_economics.md)，逐项输入输出见 [unit_economics_operations.json](unit_economics_operations.json)。两个复算脚本使用 Python 标准库，并调用 numeric-discipline 的 numeric_ops.py；默认从当前用户的 .agents/skills 目录定位，也可用 NUMERIC_OPS_PATH 指定安装位置。没有该依赖时可直接阅读原始运算和正文公式，不应声称换一台电脑无安装即可执行。

[assemble_report.py](assemble_report.py) 从 fragments 生成 Markdown 与独立 SVG；[render_report.py](render_report.py) 使用本机 invest-research/report-pdf 技能、BeautifulSoup、pandoc 和 Chrome 输出 PDF。渲染脚本含本机技能路径；正文与 PDF 不依赖这些工具即可阅读。
