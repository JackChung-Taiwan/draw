# Python 畫圖實驗室

可直接在瀏覽器執行 Python 的互動式 Matplotlib 教學網站。

## 主要功能

- 使用 Pyodide 在瀏覽器執行 Python，不需要安裝環境
- 即時預覽 Matplotlib 圖表
- 8 組可修改範例：折線圖、長條圖、散佈圖、圓餅圖、函數曲線、愛心曲線、螺旋圖案、直方圖
- 支援執行、停止、還原、複製程式、下載 `.py` 與下載圖表 PNG
- 響應式版面，支援桌面、平板與手機
- 程式在 Web Worker 中執行，避免較長運算鎖住整個頁面

## 使用方式

1. 開啟 `index.html`。
2. 等待右上角顯示「Python 已就緒」。
3. 從左側選擇範例。
4. 修改程式碼後按「執行程式」，或使用 `Ctrl + Enter` / `Command + Enter`。

## GitHub Pages 發布

在儲存庫的 **Settings → Pages**，將來源設定為 **Deploy from a branch**，選擇 `main` 分支與根目錄 `/ (root)`，儲存後即可發布網站。

## 使用技術

HTML、CSS、JavaScript、Pyodide、Python、Matplotlib、NumPy。
