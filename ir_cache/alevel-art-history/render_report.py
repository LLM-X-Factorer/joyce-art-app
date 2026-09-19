"""使用 deep_render 生成报告；在项目内修正通用模板封面与目录，保留技能原件。"""
from pathlib import Path
import subprocess,re,sys,importlib.util
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[2]
MD=ROOT/"docs/research/ALEVEL_ART_HISTORY_BUSINESS_RESEARCH.md"
HTML=MD.with_suffix(".html"); PDF=MD.with_suffix(".pdf")
SKILL=Path("/Users/liu/.agents/skills/report-pdf")
subprocess.run(["python3",str(SKILL/"scripts/deep_render.py"),str(MD),
                "-o",str(PDF),"--title","A-level 艺术史：商业机会与执行方案","--html-only"],check=True)
html=HTML.read_text()
for a,b in [
 ("投 资 研 究 报 告","产 品 与 商 业 研 究"),
 ("INVESTMENT RESEARCH","PRODUCT &amp; BUSINESS RESEARCH"),
 ("投资研究报告","产品与商业研究"),
 ("机密 · 投资决策内部参考","Common Room · 研究与试点建议"),
 ("· 投研报告","· 商业研究"),
 ("颜色＝这句话「依据有多硬」，不代表利好或利空","颜色表示依据性质，不代表好坏")]:
 html=html.replace(a,b)
soup=BeautifulSoup(html,"html.parser")
soup.select_one(".cover-sub").string="从需求证据走向首个付费试点"
soup.select_one(".cover-title").string="A-level 艺术史"
parts=soup.select(".cpart")
for node,(ran,title) in zip(parts,[("第 1–3 章","需求、资格与市场"),("第 4–6 章","竞争、产品与成本"),("第 7–9 章","开发、执行与证据")]):
 node.select_one(".cpart-rg").string=ran
 node.select_one(".cpart-tt").string=title
chapters=re.findall(r"^## (\d+)\. (.+)$",MD.read_text(),re.M)
toc=soup.select_one(".toc");toc.clear()
for n,title in chapters:
 li=soup.new_tag("li")
 num=soup.new_tag("span",attrs={"class":"tn"});num.string=n.zfill(2)
 tt=soup.new_tag("span",attrs={"class":"tt"});tt.string=title
 li.append(num);li.append(tt);toc.append(li)
toc["class"]=["report-toc"]
for el in soup.select(".toc-page,.appendix"):
 el["class"]=[c for c in el.get("class",[]) if c not in ["toc-page","appendix"]]
# 不改 .chap/.chap-badge 几何；仅移除不必要的强制分页 class。
style=soup.new_tag("style")
style.string="""
.cover-title{font-size:44pt}
.cover-sub{font-size:20pt;max-width:160mm}
body{line-height:1.72}
p{margin:6.5pt 0}
h3{margin-top:18pt}
.report-toc{columns:2;column-gap:12mm;margin:6pt 0 12pt;list-style:none;padding:0}
.report-toc li{break-inside:avoid;padding:5px 0;border-bottom:1px dashed #ddd;display:flex;gap:8px;align-items:baseline;font-size:9.4pt;line-height:1.5}
.report-toc .tn{color:#A77E4F;font-family:Georgia,serif;font-weight:700}
.report-toc .tt{flex:1}
img{max-width:100%;height:auto}
"""
soup.head.append(style)
HTML.write_text(str(soup))
spec=importlib.util.spec_from_file_location("local_md2pdf",SKILL/"scripts/md2pdf.py")
mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
for browser in mod.CHROME_PATHS:
 if Path(browser).exists() and mod.chrome_to_pdf(HTML,PDF,browser):
  print("Rendered:",PDF);break
else:
 raise SystemExit("Chrome PDF 输出失败，未交付旧 PDF")
