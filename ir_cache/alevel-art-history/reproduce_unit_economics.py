"""四周教学试点的敏感性模型。所有输入为方案假设，不是市场测得数据。"""
import json, subprocess, sys, os
from pathlib import Path
from decimal import Decimal, ROUND_HALF_UP
ROOT = Path(__file__).resolve().parent
CLI = Path(os.environ.get("NUMERIC_OPS_PATH", str(Path.home() / ".agents/skills/numeric-discipline/scripts/numeric_ops.py")))
logs = []
def calc(label, op, **kw):
    payload = {"op": op, **{k: ([str(v) for v in val] if isinstance(val,list) else str(val)) for k,val in kw.items()}}
    raw = json.dumps(payload, separators=(",", ":"))
    argv = [sys.executable, str(CLI), "--needs-ops"]
    p = subprocess.run(argv, input=raw+"\n", text=True, capture_output=True, check=True)
    result = json.loads(p.stdout)
    if "error" in result:
        raise ValueError(result)
    logs.append({"label":label, "argv":argv, "stdin":raw+"\n", "stdout":p.stdout, "exit_code":p.returncode})
    return result["result_decimal"]
def model(name, price, n="6", minutes="30", rate="300"):
    def c(s,op,**kw): return calc(name+" / "+s,op,**kw)
    revenue=c("应收","product",values=[price,n])
    net=c("扣预算预留后收入","product",values=[revenue,"0.95"])
    feedback_minutes=c("每生批改分钟","product",values=["4",minutes])
    feedback_hours=c("每生批改小时","ratio",numerator=feedback_minutes,denominator="60")
    variable_hours=c("每生工时含沟通","sum_check",values=[feedback_hours,"0.5"])
    all_variable_hours=c("全班随人数变动工时","product",values=[variable_hours,n])
    total_hours=c("重复开班总工时","sum_check",values=["16",all_variable_hours])
    labor=c("计入机会成本的劳动费用","product",values=[total_hours,rate])
    per_student_cash=c("材料等现金成本","product",values=["100",n])
    total_cost=c("重复开班经济成本","sum_check",values=[labor,per_student_cash,"300"])
    surplus=c("重复开班税前余量","diff_check",a=net,b=total_cost)
    initial=c("首期额外开发与招生","product",values=["20",rate])
    first=c("首期税前余量","diff_check",a=surplus,b=initial)
    first_hours=c("首期总工时","sum_check",values=[total_hours,"20"])
    return {"name":name,"price":price,"students":n,"feedback_minutes_each":minutes,"hourly_cost":rate,
            "revenue":revenue,"revenue_after_reserve":net,"repeat_hours":total_hours,"first_hours":first_hours,
            "repeat_economic_cost":total_cost,"repeat_surplus":surplus,"first_extra_cost":initial,"first_surplus":first}
scenarios = [
    model("价格1980","1980"), model("主方案2480","2480"), model("价格2980","2980"),
    model("仅4名学员","2480",n="4"), model("每稿60分钟","2480",minutes="60"),
    model("教师500元每小时","2480",rate="500")
]
baseline = scenarios[1]
net_n=calc("六人班保本价分母","product",values=["6","0.95"])
repeat_floor=calc("六人重复开班保本价","ratio",numerator=baseline["repeat_economic_cost"],denominator=net_n)
first_cost=calc("六人首期总经济成本","sum_check",values=[baseline["repeat_economic_cost"],baseline["first_extra_cost"]])
first_floor=calc("六人首期保本价","ratio",numerator=first_cost,denominator=net_n)
fixed_hours=calc("固定工时核对","sum_check",values=["4","4","2","2","4"])
budget_hours_cost=calc("80小时机会成本上限参考","product",values=["80","300"])
result={
 "status":"illustrative_assumptions_not_observed_market_data",
 "scope":"4周；4次60分钟课；每人2篇短文首稿和修改稿共4次反馈；建议人数上限6",
 "assumptions":{
  "fixed_hours":{"live":"4","prep":"4","independent_review":"2","cohort_admin":"2","recruitment":"4"},
  "variable":{"feedback_count":"4","minutes_each":"30","communication_hours_each":"0.5"},
  "labor_hourly_opportunity_cost_cny":"300",
  "cash_cost_per_learner_cny":"100","cohort_tech_cash_cny":"300",
  "revenue_reserve_ratio":"0.05",
  "first_extra_hours":{"initial_curriculum":"12","additional_recruitment":"8"},
  "warning":"预留不是已知手续费或退款率；现金项也是预算占位。未含税额、资质成本、第三方机构分成、平台开发和考费，需报价后重算。"
 },
 "scenarios":scenarios,
 "break_even_price_six":{"repeat":repeat_floor,"first":first_floor},
 "budget_hours_opportunity_cost":budget_hours_cost}
(ROOT/"unit_economics.json").write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n")
(ROOT/"unit_economics_operations.json").write_text(json.dumps(logs,ensure_ascii=False,indent=2)+"\n")
def money(x): return str(Decimal(x).quantize(Decimal("0.01"),rounding=ROUND_HALF_UP))
md=["# 四周服务：计算底稿","", "全部金额为人民币。所有输入均为分析用假设，不是市场报价、实际成本或利润预测。正文引用本文件时须保留此说明。","",
"固定工时：直播4、备课4、第二教师复核2、班务2、招生4。每名学生另计4次反馈，每次默认30分钟，再加沟通0.5小时。首次增加课程开发12小时和额外招生8小时。劳动按300元/小时机会成本计；这是用于检验的取值，并非教师工资行情。","",
"每生现金预算100元，每期技术预算300元；收入留5%作为折扣、退款、支付成本的组合预算占位，非已验证费率。未计税额、办学条件取得成本、机构分成和产品开发，考费另行由考点确认。","",
"| 情景 | 人数 | 单价 | 重复开班工时 | 重复开班税前余量 | 首期税前余量 |","| --- | --- | --- | --- | --- | --- |"]
for s in scenarios:
    md.append(f'| {s["name"]} | {s["students"]} | {s["price"]} | {s["repeat_hours"]} | {money(s["repeat_surplus"])} | {money(s["first_surplus"])} |')
md.extend(["",f'六人班重复开班保本价约 {money(repeat_floor)} 元，计首次额外投入后约 {money(first_floor)} 元；均为上述条件内的税前试算下限。',"",
"## 可复算命令","", "```sh","python3 ir_cache/alevel-art-history/reproduce_unit_economics.py","```","",
"所有运算的实际命令参数、标准输入与原始输出见 [完整运算记录](unit_economics_operations.json)。下列原样逐项保留，供审计，非阅读报告所必需。",""])
for row in logs:
    md.extend(["### "+row["label"],"", "```json",json.dumps({"argv":row["argv"],"stdin":row["stdin"],"stdout":row["stdout"],"exit_code":row["exit_code"]},ensure_ascii=False),"```",""])
(ROOT/"unit_economics.md").write_text("\n".join(md)+"\n")
print(json.dumps({"scenarios":scenarios,"break_even":result["break_even_price_six"],"operations_logged":len(logs)},ensure_ascii=False,indent=2))
