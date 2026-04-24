# 🚀 LangGraph Templates — Production-Ready Agent Patterns

> **Fecha:** 2026-04-24  
> **Propósito:** Templates LangGraph para agentic workflows production-ready  
> **Stack:** LangGraph +langchain-core

---

## 📦 Installation Status

```bash
✅ agent-eval-harness 0.1.0 installed
✅ langgraph 1.1.9 installed  
✅ langgraph-sdk 0.3.13 installed
```

---

## 🎯 Los 4 Core Patterns

### Pattern 1: Reflection Agent

```python
"""
Reflection Agent — Auto-corrección después de ejecutar.
Usa para: tareas donde el error es costoso.
"""
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o")

reflection_prompt = """Before providing your final answer:
1. Verify your tool calls were successful
2. Check if output matches requirements
3. If uncertain, retry with corrections"""

reflection_agent = create_react_agent(
    model,
    tools=[search_tool, analysis_tool],
    state_modifier=reflection_prompt
)
```

### Pattern 2: Planning Agent

```python
"""
Planning Agent — Descompone tareas complejas en steps.
Usa para: multi-step workflows.
"""
from langgraph.graph import StateGraph, END
from typing import TypedDict

class PlanningState(TypedDict):
    task: str
    plan: list[str]
    current_step: int
    results: dict

def planning_node(state: PlanningState) -> PlanningState:
    """Genera plan de múltiples steps."""
    task = state["task"]
    plan = [
        f"1. Analizar: {task}",
        f"2. Investigar: {task}",
        f"3. Ejecutar: {task}",
        f"4. Validar: {task}"
    ]
    return {"plan": plan, "current_step": 0}

def execution_node(state: PlanningState) -> PlanningState:
    """Ejecuta cada step secuencialmente."""
    step = state["plan"][state["current_step"]]
    # Ejecutar step...
    return {"current_step": state["current_step"] + 1}

workflow = StateGraph(PlanningState)
workflow.add_node("plan", planning_node)
workflow.add_node("execute", execution_node)
workflow.set_entry_point("plan")
workflow.add_edge("plan", "execute")
# Continue until all steps complete
planning_agent = workflow.compile()
```

### Pattern 3: Tool Use Agent

```python
"""
Tool Use Agent — Extiende capacidades con tools externos.
Usa para: necesita datos externos/API.
"""
from langgraph.prebuilt import ToolNode

tools = [search_web, read_file, write_file, execute_command]
tool_node = ToolNode(tools)

tools_agent = create_react_agent(model, tools)

# El agent automáticamente selecciona tool basado en el task
# state input: {"messages": [HumanMessage("busca X y guarda en Y")]}
```

### Pattern 4: Multi-Agent Orchestration

```python
"""
Multi-Agent — Múltiples agentes especializados.
Usa para: sistemas complejos que requieren expertise diverso.
"""
from langgraph.prebuilt import create_react_agent
from langgraph.graph import StateGraph, END

# Especialistas
researcher = create_react_agent(model, tools=[search_tool])
analyst = create_react_agent(model, tools=[analyze_tool])
writer = create_react_agent(model, tools=[write_tool])

class MultiAgentState(TypedDict):
    task: str
    research: dict
    analysis: dict
    final_output: str

def research_node(state: MultiAgentState) -> MultiAgentState:
    result = researcher.invoke({"task": state["task"]})
    return {"research": result}

def analysis_node(state: MultiAgentState) -> MultiAgentState:
    result = analyst.invoke({"data": state["research"]})
    return {"analysis": result}

def writing_node(state: MultiAgentState) -> MultiAgentState:
    output = writer.invoke({
        "task": state["task"],
        "analysis": state["analysis"]
    })
    return {"final_output": output}

# Workflow orchestrator
orchestrator = StateGraph(MultiAgentState)
orchestrator.add_node("research", research_node)
orchestrator.add_node("analysis", analysis_node)  
orchestrator.add_node("write", writing_node)
orchestrator.set_entry_point("research")
orchestrator.add_edge("research", "analysis")
orchestrator.add_edge("analysis", "write")
orchestrator.add_edge("write", END)

multi_agent = orchestrator.compile()
```

---

## 🔧 Configuration avanzada

### Con Memory (Persist sessions)

```python
from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()

agent_with_memory = workflow.compile(
    checkpointer=checkpointer,
    store=...  # Para long-term memory
)
```

### Con Human-in-the-Loop

```python
from langgraph.prebuilt import ToolNode

# Approval required antes de ejecutar tools peligrosas
def human_approval node(state):
    user_confirm = await ask_human("Aprobar esta acción?")
    if not user_confirm:
        raise Exception("Denied by human")
    return state
```

---

## 📋 Quick Start Template

```python
"""
Usage:
from langgraph_templates import create_reflection_agent, create_planning_agent

agent = create_reflection_agent(model, tools=[my_tool])
result = agent.invoke({"messages": [("user", "tu query") ]})
"""
from langgraph.prebuilt import create_react_agent
from langchain_anthropic import ChatAnthropic

def create_reflection_agent(model, tools):
    """Reflection agent template."""
    prompt = """Verifica tu respuesta antes de dar el answer final.
    1. Revisa que completaste el request
    2. Verifica accuracy
    3. Si hay uncertainty, indica"""
    return create_react_agent(model, tools, state_modifier=prompt)

def create_planning_agent(model, tools):
    """Planning agent template."""
    # ... ver arriba
    pass
```

---

## 🧪 Testing con agent-eval-harness

```bash
# Run benchmarks
harness run --benchmark gaia --agent ./my_agent.py

# Evalúa tool success rate
harness eval --metrics tool_success --output results.json
```

---

## 📚 Resources

- **Docs:** langchain.dev/langgraph
- **Examples:** github.com/langchain-ai/langgraph/tree/main/examples
- **agent-eval-harness:** github.com/Siddharth-1001/agent-eval-harness

---

> **Mantainer:** OS Owner  
> **Última actualización:** 2026-04-24