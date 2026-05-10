import os
from typing import TypedDict, Dict, Any
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

# Define Structured Output Schema
class StrategyPlan(BaseModel):
    day30: str = Field(description="Action plan for the first 30 days")
    day60: str = Field(description="Action plan for days 31-60")
    day90: str = Field(description="Action plan for days 61-90")

class MatchEvaluation(BaseModel):
    score: int = Field(description="Match percentage between 0 and 100")
    matchReason: str = Field(description="A concise, professional explanation of why this candidate is a strong fit based strictly on their resume vs the JD.")
    strategy: StrategyPlan = Field(description="A 30-60-90 day strategic plan tailored to the company's needs based on the JD.")

# Define Graph State
class AgentState(TypedDict):
    jd_text: str
    cv_text: str
    evaluation: Dict[str, Any]

def parse_inputs(state: AgentState):
    # This node could do more advanced text cleaning if necessary
    print("Node: Parsing Inputs")
    return {"jd_text": state["jd_text"].strip(), "cv_text": state["cv_text"].strip()}

def evaluate_match(state: AgentState):
    print("Node: Evaluating Match via LLM")
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)
    structured_llm = llm.with_structured_output(MatchEvaluation)
    
    prompt = f"""
    You are an expert technical recruiter and AI Architect evaluator. 
    Compare the following Job Description (JD) with the candidate's CV.
    
    Candidate CV Context:
    {state['cv_text']}
    
    Job Description:
    {state['jd_text']}
    
    Calculate a realistic match score (0-100%). Explain why the candidate is a fit, highlighting overlaps in technologies (like LangGraph, vLLM, On-Premise AI). Finally, generate a high-impact 30-60-90 day technical strategy based on the JD.
    """
    
    response = structured_llm.invoke(prompt)
    
    return {"evaluation": {
        "score": response.score,
        "matchReason": response.matchReason,
        "strategy": {
            "day30": response.strategy.day30,
            "day60": response.strategy.day60,
            "day90": response.strategy.day90
        }
    }}

# Build Graph
builder = StateGraph(AgentState)
builder.add_node("parse", parse_inputs)
builder.add_node("evaluate", evaluate_match)

builder.set_entry_point("parse")
builder.add_edge("parse", "evaluate")
builder.add_edge("evaluate", END)

graph = builder.compile()

def run_match_agent(jd_text: str, cv_text: str) -> dict:
    if not os.environ.get("OPENAI_API_KEY"):
        raise ValueError("OPENAI_API_KEY is not set.")
    
    initial_state = {"jd_text": jd_text, "cv_text": cv_text}
    result = graph.invoke(initial_state)
    return result["evaluation"]
