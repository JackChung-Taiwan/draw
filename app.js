const examples = [
  {
    id: "line",
    title: "折線圖",
    subtitle: "觀察數值趨勢",
    code: `import matplotlib.pyplot as plt

# 準備資料
months = [1, 2, 3, 4, 5, 6]
sales = [12, 18, 15, 26, 31, 38]

# 畫出折線圖
plt.figure(figsize=(7, 4.5))
plt.plot(months, sales, marker="o", linewidth=2.5)
plt.title("Monthly Sales")
plt.xlabel("Month")
plt.ylabel("Sales")
plt.xticks(months)
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()`
  },
  {
    id: "bar",
    title: "長條圖",
    subtitle: "比較不同類別",
    code: `import matplotlib.pyplot as plt

subjects = ["Chinese", "English", "Math", "Science"]
scores = [86, 92, 78, 89]

plt.figure(figsize=(7, 4.5))
plt.bar(subjects, scores)
plt.title("Subject Scores")
plt.xlabel("Subject")
plt.ylabel("Score")
plt.ylim(0, 100)
plt.grid(axis="y", alpha=0.25)
plt.tight_layout()
plt.show()`
  },
  {
    id: "scatter",
    title: "散佈圖",
    subtitle: "找出資料關係",
    code: `import matplotlib.pyplot as plt

study_hours = [1, 2, 2.5, 3, 4, 5, 6, 7]
scores = [52, 61, 66, 70, 76, 84, 90, 94]

plt.figure(figsize=(7, 4.5))
plt.scatter(study_hours, scores, s=90, alpha=0.8)
plt.title("Study Time and Score")
plt.xlabel("Study Hours")
plt.ylabel("Score")
plt.grid(alpha=0.25)
plt.tight_layout()
plt.show()`
  },
  {
    id: "pie",
    title: "圓餅圖",
    subtitle: "呈現所占比例",
    code: `import matplotlib.pyplot as plt

activities = ["Study", "Exercise", "Games", "Sleep"]
hours = [6, 2, 4, 12]

plt.figure(figsize=(6, 6))
plt.pie(hours, labels=activities, autopct="%1.0f%%", startangle=90)
plt.title("A Day in 24 Hours")
plt.axis("equal")
plt.tight_layout()
plt.show()`
  },
  {
    id: "sine",
    title: "函數曲線",
    subtitle: "畫出正弦波",
    code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 300)
y1 = np.sin(x)
y2 = np.cos(x)

plt.figure(figsize=(7, 4.5))
plt.plot(x, y1, label="sin(x)", linewidth=2.4)
plt.plot(x, y2, label="cos(x)", linewidth=2.4)
plt.title("Sine and Cosine")
plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid(alpha=0.25)
plt.tight_layout()
plt.show()`
  },
  {
    id: "heart",
    title: "愛心曲線",
    subtitle: "數學也能畫畫",
    code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 2 * np.pi, 800)
x = 16 * np.sin(t) ** 3
y = 13 * np.cos(t) - 5 * np.cos(2*t) - 2 * np.cos(3*t) - np.cos(4*t)

plt.figure(figsize=(6, 6))
plt.plot(x, y, linewidth=3)
plt.fill(x, y, alpha=0.25)
plt.title("Heart Curve")
plt.axis("equal")
plt.axis("off")
plt.tight_layout()
plt.show()`
  },
  {
    id: "spiral",
    title: "螺旋圖案",
    subtitle: "極座標創作",
    code: `import numpy as np
import matplotlib.pyplot as plt

theta = np.linspace(0, 10 * np.pi, 1200)
r = theta
x = r * np.cos(theta)
y = r * np.sin(theta)

plt.figure(figsize=(6, 6))
plt.plot(x, y, linewidth=2)
plt.title("Math Spiral")
plt.axis("equal")
plt.axis("off")
plt.tight_layout()
plt.show()`
  },
  {
    id: "histogram",
    title: "直方圖",
    subtitle: "觀察資料分布",
    code: `import numpy as np
import matplotlib.pyplot as plt

# 固定亂數種子，讓每次結果相同
np.random.seed(7)
data = np.random.normal(loc=70, scale=10, size=300)

plt.figure(figsize=(7, 4.5))
plt.hist(data, bins=12, edgecolor="white")
plt.title("Score Distribution")
plt.xlabel("Score")
plt.ylabel("Students")
plt.grid(axis="y", alpha=0.2)
plt.tight_layout()
plt.show()`
  }
];

const editor = document.getElementById("codeEditor");
const exampleList = document.getElementById("exampleList");
const runBtn = document.getElementById("runBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadCodeBtn = document.getElementById("downloadCodeBtn");
const downloadChartBtn = document.getElementById("downloadChartBtn");
const chartImage = document.getElementById("chartImage");
const previewPlaceholder = document.getElementById("previewPlaceholder");
const consoleOutput = document.getElementById("consoleOutput");
const runtimeStatus = document.getElementById("runtimeStatus");
const executionTime = document.getElementById("executionTime");
const lineCount = document.getElementById("lineCount");
const toast = document.getElementById("toast");

let currentExample = examples[0];
let worker = null;
let runtimeReady = false;
let runStartedAt = 0;
let lastChartData = "";
let toastTimer = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function setRuntimeStatus(text, state = "loading") {
  runtimeStatus.textContent = text;
  runtimeStatus.classList.toggle("ready", state === "ready");
  runtimeStatus.classList.toggle("error", state === "error");
}

function updateLineCount() {
  const lines = editor.value.split("\n").length;
  lineCount.textContent = `${lines} 行`;
}

function renderExamples() {
  exampleList.innerHTML = "";
  examples.forEach((example) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "example-btn" + (example.id === currentExample.id ? " active" : "");
    button.innerHTML = `<span>${example.title}</span><small>${example.subtitle}</small>`;
    button.addEventListener("click", () => selectExample(example.id));
    exampleList.appendChild(button);
  });
}

function selectExample(id) {
  currentExample = examples.find((item) => item.id === id) || examples[0];
  editor.value = currentExample.code;
  updateLineCount();
  renderExamples();
  clearPreview("已載入「" + currentExample.title + "」範例，按下執行查看結果。", false);
}

function clearPreview(message, isError = false) {
  chartImage.style.display = "none";
  chartImage.removeAttribute("src");
  previewPlaceholder.style.display = "block";
  previewPlaceholder.innerHTML = `<strong>${isError ? "程式執行失敗" : "等待執行"}</strong>${message}`;
  consoleOutput.textContent = message;
  consoleOutput.classList.toggle("error", isError);
  downloadChartBtn.disabled = true;
  lastChartData = "";
}

function createWorker() {
  if (worker) worker.terminate();
  runtimeReady = false;
  runBtn.disabled = true;
  stopBtn.disabled = true;
  setRuntimeStatus("正在載入 Python 環境");
  consoleOutput.classList.remove("error");
  consoleOutput.textContent = "首次載入需要下載 Python 與 Matplotlib 套件，請稍候…";

  const workerCode = `
    let pyodide = null;
    const cdnOptions = [
      { version: "314.0.2", base: "https://cdn.jsdelivr.net/pyodide/v314.0.2/full/" },
      { version: "0.27.7", base: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/" }
    ];

    async function initRuntime() {
      let lastError = null;
      for (const option of cdnOptions) {
        try {
          importScripts(option.base + "pyodide.js");
          pyodide = await loadPyodide({ indexURL: option.base });
          await pyodide.loadPackage(["matplotlib", "numpy"]);
          self.postMessage({ type: "ready", version: option.version });
          return;
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError || new Error("無法載入 Pyodide");
    }

    async function runCode(code) {
      pyodide.globals.set("USER_CODE", code);
      const resultJson = await pyodide.runPythonAsync(\`
import io
import json
import base64
import traceback
import contextlib
import matplotlib
matplotlib.use("agg")
import matplotlib.pyplot as plt

plt.close("all")
_stdout = io.StringIO()
_stderr = io.StringIO()
_result = {"ok": True, "stdout": "", "stderr": "", "image": ""}

try:
    _namespace = {"__name__": "__main__"}
    with contextlib.redirect_stdout(_stdout), contextlib.redirect_stderr(_stderr):
        exec(compile(USER_CODE, "<student-code>", "exec"), _namespace)
    if plt.get_fignums():
        _buffer = io.BytesIO()
        plt.gcf().savefig(_buffer, format="png", dpi=145, bbox_inches="tight", facecolor="white")
        _result["image"] = base64.b64encode(_buffer.getvalue()).decode("ascii")
except Exception:
    _result["ok"] = False
    _result["stderr"] = traceback.format_exc()
finally:
    _result["stdout"] = _stdout.getvalue()
    if not _result["stderr"]:
        _result["stderr"] = _stderr.getvalue()
    plt.close("all")

json.dumps(_result)
      \`);
      return JSON.parse(resultJson);
    }

    self.onmessage = async (event) => {
      const { type, code } = event.data;
      try {
        if (type === "init") await initRuntime();
        if (type === "run") {
          const result = await runCode(code);
          self.postMessage({ type: "result", result });
        }
      } catch (error) {
        self.postMessage({ type: "fatal", message: error?.stack || String(error) });
      }
    };
  `;

  const blob = new Blob([workerCode], { type: "text/javascript" });
  worker = new Worker(URL.createObjectURL(blob));

  worker.onmessage = (event) => {
    const data = event.data;
    if (data.type === "ready") {
      runtimeReady = true;
      runBtn.disabled = false;
      setRuntimeStatus(`Python 已就緒 · Pyodide ${data.version}`, "ready");
      consoleOutput.textContent = "環境載入完成。請按「執行程式」開始。";
    }

    if (data.type === "result") {
      const elapsed = ((performance.now() - runStartedAt) / 1000).toFixed(2);
      executionTime.textContent = `執行 ${elapsed} 秒`;
      runBtn.disabled = false;
      stopBtn.disabled = true;
      setRuntimeStatus("Python 已就緒", "ready");

      if (!data.result.ok) {
        clearPreview("請查看下方錯誤訊息並修正程式。", true);
        consoleOutput.textContent = data.result.stderr || "未知錯誤";
        return;
      }

      consoleOutput.classList.remove("error");
      consoleOutput.textContent = data.result.stdout || "程式執行成功，沒有文字輸出。";

      if (data.result.image) {
        lastChartData = data.result.image;
        chartImage.src = `data:image/png;base64,${data.result.image}`;
        chartImage.style.display = "block";
        previewPlaceholder.style.display = "none";
        downloadChartBtn.disabled = false;
      } else {
        clearPreview("程式執行成功，但尚未建立 Matplotlib 圖表。請確認有使用 plt.plot()、plt.bar() 等函式。", false);
      }
    }

    if (data.type === "fatal") {
      runtimeReady = false;
      runBtn.disabled = true;
      stopBtn.disabled = true;
      setRuntimeStatus("載入或執行失敗", "error");
      clearPreview("無法載入 Python 執行環境，請確認網路連線後重新整理頁面。", true);
      consoleOutput.textContent = data.message;
    }
  };

  worker.onerror = (event) => {
    runtimeReady = false;
    runBtn.disabled = true;
    stopBtn.disabled = true;
    setRuntimeStatus("Python 環境發生錯誤", "error");
    clearPreview("執行器發生錯誤，請重新整理頁面。", true);
    consoleOutput.textContent = event.message || "Web Worker 發生未知錯誤";
  };

  worker.postMessage({ type: "init" });
}

function runCode() {
  if (!runtimeReady || !worker) return;
  runStartedAt = performance.now();
  runBtn.disabled = true;
  stopBtn.disabled = false;
  downloadChartBtn.disabled = true;
  setRuntimeStatus("程式執行中");
  executionTime.textContent = "執行中…";
  consoleOutput.classList.remove("error");
  consoleOutput.textContent = "正在執行程式…";
  chartImage.style.display = "none";
  previewPlaceholder.style.display = "block";
  previewPlaceholder.innerHTML = "<strong>正在產生圖表</strong>請稍候，複雜的圖形可能需要較長時間。";
  worker.postMessage({ type: "run", code: editor.value });
}

function stopCode() {
  if (!worker) return;
  worker.terminate();
  worker = null;
  executionTime.textContent = "已停止";
  clearPreview("程式已停止。執行環境正在重新載入。", false);
  showToast("已停止執行");
  createWorker();
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(editor.value);
    showToast("程式碼已複製");
  } catch {
    editor.select();
    document.execCommand("copy");
    showToast("程式碼已複製");
  }
}

function downloadText(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadChart() {
  if (!lastChartData) return;
  const link = document.createElement("a");
  link.href = `data:image/png;base64,${lastChartData}`;
  link.download = `python-${currentExample.id}-chart.png`;
  link.click();
}

editor.addEventListener("input", updateLineCount);
editor.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.value = editor.value.slice(0, start) + "    " + editor.value.slice(end);
    editor.selectionStart = editor.selectionEnd = start + 4;
    updateLineCount();
  }
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    runCode();
  }
});

runBtn.addEventListener("click", runCode);
stopBtn.addEventListener("click", stopCode);
resetBtn.addEventListener("click", () => {
  editor.value = currentExample.code;
  updateLineCount();
  showToast("範例已還原");
});
copyBtn.addEventListener("click", copyCode);
downloadCodeBtn.addEventListener("click", () => downloadText(`python-${currentExample.id}.py`, editor.value, "text/x-python;charset=utf-8"));
downloadChartBtn.addEventListener("click", downloadChart);

selectExample("line");
createWorker();
