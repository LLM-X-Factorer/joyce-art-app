"""从唯一分章目录组装报告，并输出适用于 GitHub 的独立 SVG。"""
from pathlib import Path
import subprocess, re
ROOT=Path(__file__).resolve().parents[2]
CACHE=ROOT/"ir_cache/alevel-art-history"
REPORT=ROOT/"docs/research/ALEVEL_ART_HISTORY_BUSINESS_RESEARCH.md"
cmd=["python3","/Users/liu/.agents/skills/invest-research/scripts/build_report.py",str(CACHE),
     "--title","A-level 艺术史：商业机会与执行方案",
     "--subtitle","Common Room · 中国大陆及海外华语学生 · 公开资料研究与试点建议",
     "-o",str(REPORT)]
p=subprocess.run(cmd,text=True,capture_output=True,check=True)
(CACHE/"build.log").write_text(p.stdout+p.stderr)
print(p.stdout)
s=REPORT.read_text()
assets=REPORT.parent/"assets"
assets.mkdir(exist_ok=True)
def chart(m):
    (assets/"alevel-cohort-costs.svg").write_text(m.group(1))
    return "![六人班的收入与成本，全部为方案假设](assets/alevel-cohort-costs.svg)"
s,count=re.subn(r"<figure[^>]*>(<svg.*?</svg>)</figure>",chart,s,flags=re.S)
assert count==1,count
s=s.replace("这句话的「依据有多硬」","这句话的依据性质").replace("我们的判断（押的注）","研究判断或建议").replace("公司自己的说法（还没核实）","机构或受访者的说法（未独立核实）")
REPORT.write_text(s)
print("Externalized chart:",count)
