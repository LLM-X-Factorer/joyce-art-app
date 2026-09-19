# A-level 艺术史研究：计算底稿

日期：2026-09-19。市场核算，不是收入预测。输入来源见 [来源清单](sources.json)。

C01 使用同一变化率公式核对六年累计变化，不表示年度增长率；不因工具操作名为 yoy 改变口径。C02/C03 的 2025 数字来自 AAH 附表及 Pearson 搜索索引，原 PDF 地址直接访问为 404；与 2026 最新官方临时统计对比时保留这一限制。

## C01 AAH 附表 2019 到 2025 变化；非逐年同比

实际命令参数：

```json
["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"]
```

标准输入：

```json
{"op":"yoy","base_val":"483","current_val":"838"}
```

原始输出：

```json
{"result_decimal": "73.49896480331262939958592133", "dp_id": "dp_computed_c979db58", "rule_id": "T5-yoy", "op": "yoy"}
```

## C02 2025 到 2026 英国 9HT0 考生变化；2025 直接原链接不可读

实际命令参数：

```json
["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"]
```

标准输入：

```json
{"op":"yoy","base_val":"838","current_val":"715"}
```

原始输出：

```json
{"result_decimal": "-14.67780429594272076372315036", "dp_id": "dp_computed_7df94fd3", "rule_id": "T5-yoy", "op": "yoy"}
```

## C03 2026 减 2025 考生人数差

实际命令参数：

```json
["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"]
```

标准输入：

```json
{"op":"diff_check","a":"715","b":"838"}
```

原始输出：

```json
{"result_decimal": "-123", "dp_id": "dp_computed_7e515dd1", "rule_id": "T1-sum_or_diff_equals", "op": "diff_check"}
```
