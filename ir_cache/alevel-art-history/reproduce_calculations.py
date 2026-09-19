"""核对研究中的两个增长率；只使用 Python 标准库和已安装的数字纪律脚本。"""
import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCRIPT = Path(os.environ.get("NUMERIC_OPS_PATH", str(Path.home() / ".agents/skills/numeric-discipline/scripts/numeric_ops.py")))
CASES = [
    {"id": "C01", "purpose": "AAH 附表 2019 到 2025 变化；非逐年同比",
     "source_ids": ["S03"],
     "input": {"op": "yoy", "base_val": "483", "current_val": "838"}},
    {"id": "C02", "purpose": "2025 到 2026 英国 9HT0 考生变化；2025 直接原链接不可读",
     "source_ids": ["S02", "S03", "S19"],
     "input": {"op": "yoy", "base_val": "838", "current_val": "715"}},
    {"id": "C03", "purpose": "2026 减 2025 考生人数差",
     "source_ids": ["S02", "S03", "S19"],
     "input": {"op": "diff_check", "a": "715", "b": "838"}},
]
if not SCRIPT.is_file():
    raise SystemExit("缺少原始计算脚本，请先定位 numeric-discipline；不静默更换公式。")
records = []
md = ["# A-level 艺术史研究：计算底稿", "", "日期：2026-09-19。市场核算，不是收入预测。输入来源见 [来源清单](sources.json)。",
      "", "C01 使用同一变化率公式核对六年累计变化，不表示年度增长率；不因工具操作名为 yoy 改变口径。C02/C03 的 2025 数字来自 AAH 附表及 Pearson 搜索索引，原 PDF 地址直接访问为 404；与 2026 最新官方临时统计对比时保留这一限制。", ""]
for case in CASES:
    raw_input = json.dumps(case["input"], ensure_ascii=False, separators=(",", ":"))
    cmd = [sys.executable, str(SCRIPT), "--needs-ops"]
    proc = subprocess.run(cmd, input=raw_input + "\n", text=True, capture_output=True, check=True)
    parsed = json.loads(proc.stdout)
    if "error" in parsed:
        raise RuntimeError(parsed)
    record = {**case, "command_argv": cmd, "stdin": raw_input + "\n", "stdout": proc.stdout, "exit_code": proc.returncode}
    records.append(record)
    md.extend(["## " + case["id"] + " " + case["purpose"], "", "实际命令参数：", "", "```json", json.dumps(cmd, ensure_ascii=False), "```", "", "标准输入：", "", "```json", raw_input, "```", "", "原始输出：", "", "```json", proc.stdout.rstrip("\n"), "```", ""])
    print(case["id"], proc.stdout.strip())
(ROOT / "calculations.json").write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n")
(ROOT / "calculations.md").write_text("\n".join(md) + "\n")
