# 四周服务：计算底稿

全部金额为人民币。所有输入均为分析用假设，不是市场报价、实际成本或利润预测。正文引用本文件时须保留此说明。

固定工时：直播4、备课4、第二教师复核2、班务2、招生4。每名学生另计4次反馈，每次默认30分钟，再加沟通0.5小时。首次增加课程开发12小时和额外招生8小时。劳动按300元/小时机会成本计；这是用于检验的取值，并非教师工资行情。

每生现金预算100元，每期技术预算300元；收入留5%作为折扣、退款、支付成本的组合预算占位，非已验证费率。未计税额、办学条件取得成本、机构分成和产品开发，考费另行由考点确认。

| 情景 | 人数 | 单价 | 重复开班工时 | 重复开班税前余量 | 首期税前余量 |
| --- | --- | --- | --- | --- | --- |
| 价格1980 | 6 | 1980 | 31 | 1086.00 | -4914.00 |
| 主方案2480 | 6 | 2480 | 31 | 3936.00 | -2064.00 |
| 价格2980 | 6 | 2980 | 31 | 6786.00 | 786.00 |
| 仅4名学员 | 4 | 2480 | 26 | 924.00 | -5076.00 |
| 每稿60分钟 | 6 | 2480 | 43 | 336.00 | -5664.00 |
| 教师500元每小时 | 6 | 2480 | 31 | -2264.00 | -12264.00 |

六人班重复开班保本价约 1789.47 元，计首次额外投入后约 2842.11 元；均为上述条件内的税前试算下限。

## 可复算命令

```sh
python3 ir_cache/alevel-art-history/reproduce_unit_economics.py
```

所有运算的实际命令参数、标准输入与原始输出见 [完整运算记录](unit_economics_operations.json)。下列原样逐项保留，供审计，非阅读报告所必需。

### 价格1980 / 应收

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"1980\",\"6\"]}\n", "stdout": "{\"result_decimal\": \"11880\", \"dp_id\": \"dp_computed_afe6bb89\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 价格1980 / 扣预算预留后收入

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"11880\",\"0.95\"]}\n", "stdout": "{\"result_decimal\": \"11286\", \"dp_id\": \"dp_computed_bcce6145\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 价格1980 / 每生批改分钟

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"4\",\"30\"]}\n", "stdout": "{\"result_decimal\": \"120\", \"dp_id\": \"dp_computed_f4825d5d\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 价格1980 / 每生批改小时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"ratio\",\"numerator\":\"120\",\"denominator\":\"60\"}\n", "stdout": "{\"result_decimal\": \"2\", \"dp_id\": \"dp_computed_1c4cc918\", \"rule_id\": \"T4-ratio\", \"op\": \"ratio\"}\n", "exit_code": 0}
```

### 价格1980 / 每生工时含沟通

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"2\",\"0.5\"]}\n", "stdout": "{\"result_decimal\": \"2.5\", \"dp_id\": \"dp_computed_397f8f3e\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 价格1980 / 全班随人数变动工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"2.5\",\"6\"]}\n", "stdout": "{\"result_decimal\": \"15\", \"dp_id\": \"dp_computed_76d50562\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 价格1980 / 重复开班总工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"16\",\"15\"]}\n", "stdout": "{\"result_decimal\": \"31\", \"dp_id\": \"dp_computed_8a4fccde\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 价格1980 / 计入机会成本的劳动费用

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"31\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"9300\", \"dp_id\": \"dp_computed_9a6ed2bf\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 价格1980 / 材料等现金成本

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"100\",\"6\"]}\n", "stdout": "{\"result_decimal\": \"600\", \"dp_id\": \"dp_computed_a2dec171\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 价格1980 / 重复开班经济成本

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"9300\",\"600\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"10200\", \"dp_id\": \"dp_computed_ca156048\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 价格1980 / 重复开班税前余量

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"diff_check\",\"a\":\"11286\",\"b\":\"10200\"}\n", "stdout": "{\"result_decimal\": \"1086\", \"dp_id\": \"dp_computed_9d53c71f\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"diff_check\"}\n", "exit_code": 0}
```

### 价格1980 / 首期额外开发与招生

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"20\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"6000\", \"dp_id\": \"dp_computed_20ad70cf\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 价格1980 / 首期税前余量

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"diff_check\",\"a\":\"1086\",\"b\":\"6000\"}\n", "stdout": "{\"result_decimal\": \"-4914\", \"dp_id\": \"dp_computed_5a6a56fe\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"diff_check\"}\n", "exit_code": 0}
```

### 价格1980 / 首期总工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"31\",\"20\"]}\n", "stdout": "{\"result_decimal\": \"51\", \"dp_id\": \"dp_computed_60de6e4e\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 主方案2480 / 应收

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"2480\",\"6\"]}\n", "stdout": "{\"result_decimal\": \"14880\", \"dp_id\": \"dp_computed_bdb5becb\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 主方案2480 / 扣预算预留后收入

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"14880\",\"0.95\"]}\n", "stdout": "{\"result_decimal\": \"14136\", \"dp_id\": \"dp_computed_79afe875\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 主方案2480 / 每生批改分钟

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"4\",\"30\"]}\n", "stdout": "{\"result_decimal\": \"120\", \"dp_id\": \"dp_computed_769b2384\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 主方案2480 / 每生批改小时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"ratio\",\"numerator\":\"120\",\"denominator\":\"60\"}\n", "stdout": "{\"result_decimal\": \"2\", \"dp_id\": \"dp_computed_ff4e263b\", \"rule_id\": \"T4-ratio\", \"op\": \"ratio\"}\n", "exit_code": 0}
```

### 主方案2480 / 每生工时含沟通

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"2\",\"0.5\"]}\n", "stdout": "{\"result_decimal\": \"2.5\", \"dp_id\": \"dp_computed_dd423023\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 主方案2480 / 全班随人数变动工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"2.5\",\"6\"]}\n", "stdout": "{\"result_decimal\": \"15\", \"dp_id\": \"dp_computed_2a8eacf1\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 主方案2480 / 重复开班总工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"16\",\"15\"]}\n", "stdout": "{\"result_decimal\": \"31\", \"dp_id\": \"dp_computed_069ac7fe\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 主方案2480 / 计入机会成本的劳动费用

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"31\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"9300\", \"dp_id\": \"dp_computed_2bd1502a\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 主方案2480 / 材料等现金成本

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"100\",\"6\"]}\n", "stdout": "{\"result_decimal\": \"600\", \"dp_id\": \"dp_computed_1c91f29a\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 主方案2480 / 重复开班经济成本

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"9300\",\"600\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"10200\", \"dp_id\": \"dp_computed_7f7480c5\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 主方案2480 / 重复开班税前余量

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"diff_check\",\"a\":\"14136\",\"b\":\"10200\"}\n", "stdout": "{\"result_decimal\": \"3936\", \"dp_id\": \"dp_computed_10a6151e\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"diff_check\"}\n", "exit_code": 0}
```

### 主方案2480 / 首期额外开发与招生

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"20\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"6000\", \"dp_id\": \"dp_computed_a4c741ad\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 主方案2480 / 首期税前余量

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"diff_check\",\"a\":\"3936\",\"b\":\"6000\"}\n", "stdout": "{\"result_decimal\": \"-2064\", \"dp_id\": \"dp_computed_0d4d3287\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"diff_check\"}\n", "exit_code": 0}
```

### 主方案2480 / 首期总工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"31\",\"20\"]}\n", "stdout": "{\"result_decimal\": \"51\", \"dp_id\": \"dp_computed_8a22f435\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 价格2980 / 应收

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"2980\",\"6\"]}\n", "stdout": "{\"result_decimal\": \"17880\", \"dp_id\": \"dp_computed_c2cc4235\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 价格2980 / 扣预算预留后收入

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"17880\",\"0.95\"]}\n", "stdout": "{\"result_decimal\": \"16986\", \"dp_id\": \"dp_computed_370f54b8\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 价格2980 / 每生批改分钟

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"4\",\"30\"]}\n", "stdout": "{\"result_decimal\": \"120\", \"dp_id\": \"dp_computed_72e8d03e\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 价格2980 / 每生批改小时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"ratio\",\"numerator\":\"120\",\"denominator\":\"60\"}\n", "stdout": "{\"result_decimal\": \"2\", \"dp_id\": \"dp_computed_2494f7fb\", \"rule_id\": \"T4-ratio\", \"op\": \"ratio\"}\n", "exit_code": 0}
```

### 价格2980 / 每生工时含沟通

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"2\",\"0.5\"]}\n", "stdout": "{\"result_decimal\": \"2.5\", \"dp_id\": \"dp_computed_8c27857b\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 价格2980 / 全班随人数变动工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"2.5\",\"6\"]}\n", "stdout": "{\"result_decimal\": \"15\", \"dp_id\": \"dp_computed_a9f9f189\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 价格2980 / 重复开班总工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"16\",\"15\"]}\n", "stdout": "{\"result_decimal\": \"31\", \"dp_id\": \"dp_computed_8d80a881\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 价格2980 / 计入机会成本的劳动费用

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"31\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"9300\", \"dp_id\": \"dp_computed_f4571f5e\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 价格2980 / 材料等现金成本

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"100\",\"6\"]}\n", "stdout": "{\"result_decimal\": \"600\", \"dp_id\": \"dp_computed_983a1c9f\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 价格2980 / 重复开班经济成本

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"9300\",\"600\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"10200\", \"dp_id\": \"dp_computed_e0c9ef93\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 价格2980 / 重复开班税前余量

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"diff_check\",\"a\":\"16986\",\"b\":\"10200\"}\n", "stdout": "{\"result_decimal\": \"6786\", \"dp_id\": \"dp_computed_6c0b24e0\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"diff_check\"}\n", "exit_code": 0}
```

### 价格2980 / 首期额外开发与招生

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"20\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"6000\", \"dp_id\": \"dp_computed_b61a8fda\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 价格2980 / 首期税前余量

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"diff_check\",\"a\":\"6786\",\"b\":\"6000\"}\n", "stdout": "{\"result_decimal\": \"786\", \"dp_id\": \"dp_computed_b79795ad\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"diff_check\"}\n", "exit_code": 0}
```

### 价格2980 / 首期总工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"31\",\"20\"]}\n", "stdout": "{\"result_decimal\": \"51\", \"dp_id\": \"dp_computed_79f62c3b\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 仅4名学员 / 应收

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"2480\",\"4\"]}\n", "stdout": "{\"result_decimal\": \"9920\", \"dp_id\": \"dp_computed_7771cdb2\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 仅4名学员 / 扣预算预留后收入

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"9920\",\"0.95\"]}\n", "stdout": "{\"result_decimal\": \"9424\", \"dp_id\": \"dp_computed_9f5cf736\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 仅4名学员 / 每生批改分钟

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"4\",\"30\"]}\n", "stdout": "{\"result_decimal\": \"120\", \"dp_id\": \"dp_computed_0300cafe\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 仅4名学员 / 每生批改小时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"ratio\",\"numerator\":\"120\",\"denominator\":\"60\"}\n", "stdout": "{\"result_decimal\": \"2\", \"dp_id\": \"dp_computed_7b6ca3ed\", \"rule_id\": \"T4-ratio\", \"op\": \"ratio\"}\n", "exit_code": 0}
```

### 仅4名学员 / 每生工时含沟通

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"2\",\"0.5\"]}\n", "stdout": "{\"result_decimal\": \"2.5\", \"dp_id\": \"dp_computed_eba10067\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 仅4名学员 / 全班随人数变动工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"2.5\",\"4\"]}\n", "stdout": "{\"result_decimal\": \"10.0\", \"dp_id\": \"dp_computed_d451c646\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 仅4名学员 / 重复开班总工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"16\",\"10.0\"]}\n", "stdout": "{\"result_decimal\": \"26\", \"dp_id\": \"dp_computed_1e3e1d99\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 仅4名学员 / 计入机会成本的劳动费用

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"26\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"7800\", \"dp_id\": \"dp_computed_979ca12f\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 仅4名学员 / 材料等现金成本

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"100\",\"4\"]}\n", "stdout": "{\"result_decimal\": \"400\", \"dp_id\": \"dp_computed_da3b128a\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 仅4名学员 / 重复开班经济成本

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"7800\",\"400\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"8500\", \"dp_id\": \"dp_computed_d4316c68\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 仅4名学员 / 重复开班税前余量

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"diff_check\",\"a\":\"9424\",\"b\":\"8500\"}\n", "stdout": "{\"result_decimal\": \"924\", \"dp_id\": \"dp_computed_6d21de0e\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"diff_check\"}\n", "exit_code": 0}
```

### 仅4名学员 / 首期额外开发与招生

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"20\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"6000\", \"dp_id\": \"dp_computed_f6dae805\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 仅4名学员 / 首期税前余量

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"diff_check\",\"a\":\"924\",\"b\":\"6000\"}\n", "stdout": "{\"result_decimal\": \"-5076\", \"dp_id\": \"dp_computed_fbc33d41\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"diff_check\"}\n", "exit_code": 0}
```

### 仅4名学员 / 首期总工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"26\",\"20\"]}\n", "stdout": "{\"result_decimal\": \"46\", \"dp_id\": \"dp_computed_dff0e190\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 每稿60分钟 / 应收

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"2480\",\"6\"]}\n", "stdout": "{\"result_decimal\": \"14880\", \"dp_id\": \"dp_computed_94d0de16\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 每稿60分钟 / 扣预算预留后收入

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"14880\",\"0.95\"]}\n", "stdout": "{\"result_decimal\": \"14136\", \"dp_id\": \"dp_computed_cd144ae4\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 每稿60分钟 / 每生批改分钟

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"4\",\"60\"]}\n", "stdout": "{\"result_decimal\": \"240\", \"dp_id\": \"dp_computed_98c11bfd\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 每稿60分钟 / 每生批改小时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"ratio\",\"numerator\":\"240\",\"denominator\":\"60\"}\n", "stdout": "{\"result_decimal\": \"4\", \"dp_id\": \"dp_computed_44a7196c\", \"rule_id\": \"T4-ratio\", \"op\": \"ratio\"}\n", "exit_code": 0}
```

### 每稿60分钟 / 每生工时含沟通

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"4\",\"0.5\"]}\n", "stdout": "{\"result_decimal\": \"4.5\", \"dp_id\": \"dp_computed_90ea0573\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 每稿60分钟 / 全班随人数变动工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"4.5\",\"6\"]}\n", "stdout": "{\"result_decimal\": \"27\", \"dp_id\": \"dp_computed_17b6b5b7\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 每稿60分钟 / 重复开班总工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"16\",\"27\"]}\n", "stdout": "{\"result_decimal\": \"43\", \"dp_id\": \"dp_computed_37257c61\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 每稿60分钟 / 计入机会成本的劳动费用

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"43\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"12900\", \"dp_id\": \"dp_computed_48f6ca22\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 每稿60分钟 / 材料等现金成本

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"100\",\"6\"]}\n", "stdout": "{\"result_decimal\": \"600\", \"dp_id\": \"dp_computed_bd5ec52d\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 每稿60分钟 / 重复开班经济成本

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"12900\",\"600\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"13800\", \"dp_id\": \"dp_computed_fcfd2062\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 每稿60分钟 / 重复开班税前余量

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"diff_check\",\"a\":\"14136\",\"b\":\"13800\"}\n", "stdout": "{\"result_decimal\": \"336\", \"dp_id\": \"dp_computed_cd3eb0f0\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"diff_check\"}\n", "exit_code": 0}
```

### 每稿60分钟 / 首期额外开发与招生

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"20\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"6000\", \"dp_id\": \"dp_computed_87d8ba4a\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 每稿60分钟 / 首期税前余量

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"diff_check\",\"a\":\"336\",\"b\":\"6000\"}\n", "stdout": "{\"result_decimal\": \"-5664\", \"dp_id\": \"dp_computed_c09ca96e\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"diff_check\"}\n", "exit_code": 0}
```

### 每稿60分钟 / 首期总工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"43\",\"20\"]}\n", "stdout": "{\"result_decimal\": \"63\", \"dp_id\": \"dp_computed_fbc91297\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 教师500元每小时 / 应收

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"2480\",\"6\"]}\n", "stdout": "{\"result_decimal\": \"14880\", \"dp_id\": \"dp_computed_a5bc486e\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 教师500元每小时 / 扣预算预留后收入

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"14880\",\"0.95\"]}\n", "stdout": "{\"result_decimal\": \"14136\", \"dp_id\": \"dp_computed_8fc85917\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 教师500元每小时 / 每生批改分钟

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"4\",\"30\"]}\n", "stdout": "{\"result_decimal\": \"120\", \"dp_id\": \"dp_computed_fbadf4e0\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 教师500元每小时 / 每生批改小时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"ratio\",\"numerator\":\"120\",\"denominator\":\"60\"}\n", "stdout": "{\"result_decimal\": \"2\", \"dp_id\": \"dp_computed_316186eb\", \"rule_id\": \"T4-ratio\", \"op\": \"ratio\"}\n", "exit_code": 0}
```

### 教师500元每小时 / 每生工时含沟通

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"2\",\"0.5\"]}\n", "stdout": "{\"result_decimal\": \"2.5\", \"dp_id\": \"dp_computed_1bdc9b5d\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 教师500元每小时 / 全班随人数变动工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"2.5\",\"6\"]}\n", "stdout": "{\"result_decimal\": \"15\", \"dp_id\": \"dp_computed_f3604b5b\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 教师500元每小时 / 重复开班总工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"16\",\"15\"]}\n", "stdout": "{\"result_decimal\": \"31\", \"dp_id\": \"dp_computed_82d8e160\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 教师500元每小时 / 计入机会成本的劳动费用

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"31\",\"500\"]}\n", "stdout": "{\"result_decimal\": \"15500\", \"dp_id\": \"dp_computed_d14801f6\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 教师500元每小时 / 材料等现金成本

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"100\",\"6\"]}\n", "stdout": "{\"result_decimal\": \"600\", \"dp_id\": \"dp_computed_63abfdce\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 教师500元每小时 / 重复开班经济成本

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"15500\",\"600\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"16400\", \"dp_id\": \"dp_computed_739ba9a5\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 教师500元每小时 / 重复开班税前余量

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"diff_check\",\"a\":\"14136\",\"b\":\"16400\"}\n", "stdout": "{\"result_decimal\": \"-2264\", \"dp_id\": \"dp_computed_0bce6c14\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"diff_check\"}\n", "exit_code": 0}
```

### 教师500元每小时 / 首期额外开发与招生

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"20\",\"500\"]}\n", "stdout": "{\"result_decimal\": \"10000\", \"dp_id\": \"dp_computed_0f5634cc\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 教师500元每小时 / 首期税前余量

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"diff_check\",\"a\":\"-2264\",\"b\":\"10000\"}\n", "stdout": "{\"result_decimal\": \"-12264\", \"dp_id\": \"dp_computed_a80be7a3\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"diff_check\"}\n", "exit_code": 0}
```

### 教师500元每小时 / 首期总工时

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"31\",\"20\"]}\n", "stdout": "{\"result_decimal\": \"51\", \"dp_id\": \"dp_computed_5100a9c4\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 六人班保本价分母

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"6\",\"0.95\"]}\n", "stdout": "{\"result_decimal\": \"5.7\", \"dp_id\": \"dp_computed_fdc78085\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```

### 六人重复开班保本价

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"ratio\",\"numerator\":\"10200\",\"denominator\":\"5.7\"}\n", "stdout": "{\"result_decimal\": \"1789.473684210526315789473684\", \"dp_id\": \"dp_computed_086956f2\", \"rule_id\": \"T4-ratio\", \"op\": \"ratio\"}\n", "exit_code": 0}
```

### 六人首期总经济成本

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"10200\",\"6000\"]}\n", "stdout": "{\"result_decimal\": \"16200\", \"dp_id\": \"dp_computed_de0c27a2\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 六人首期保本价

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"ratio\",\"numerator\":\"16200\",\"denominator\":\"5.7\"}\n", "stdout": "{\"result_decimal\": \"2842.105263157894736842105263\", \"dp_id\": \"dp_computed_a25cf6b0\", \"rule_id\": \"T4-ratio\", \"op\": \"ratio\"}\n", "exit_code": 0}
```

### 固定工时核对

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"sum_check\",\"values\":[\"4\",\"4\",\"2\",\"2\",\"4\"]}\n", "stdout": "{\"result_decimal\": \"16\", \"dp_id\": \"dp_computed_d820b72d\", \"rule_id\": \"T1-sum_or_diff_equals\", \"op\": \"sum_check\"}\n", "exit_code": 0}
```

### 80小时机会成本上限参考

```json
{"argv": ["/opt/homebrew/opt/python@3.14/bin/python3.14", "/Users/liu/.agents/skills/numeric-discipline/scripts/numeric_ops.py", "--needs-ops"], "stdin": "{\"op\":\"product\",\"values\":[\"80\",\"300\"]}\n", "stdout": "{\"result_decimal\": \"24000\", \"dp_id\": \"dp_computed_d2f25170\", \"rule_id\": \"T6-product\", \"op\": \"product\"}\n", "exit_code": 0}
```
