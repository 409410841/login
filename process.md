# 雲端即時任務管理與分析平台（Cloud Task & Analytics System）

## 一、專題概述

本專題使用 Google Cloud Platform 建構一套具備高擴展性與即時性的任務管理系統，整合使用者管理、任務操作、即時更新與數據分析功能，並透過雲端服務實現高可用性與分散式架構。

本系統旨在展示完整後端開發能力，包含 API 設計、資料庫架構、身份驗證、非同步處理與雲端部署。

---

## 二、系統架構設計

### （一）雲端服務架構

本系統採用以下 GCP 服務進行部署與管理：

* 運算平台：Cloud Run
* 關聯式資料庫：Cloud SQL（PostgreSQL）
* NoSQL 資料庫（選用）：Firestore
* 身份驗證服務：Firebase Authentication
* 訊息佇列系統：Cloud Pub/Sub
* 檔案儲存：Cloud Storage
* API 管理（進階）：API Gateway

---

## 三、系統流程說明

### （一）使用者操作流程

1. 使用者進入系統並進行註冊或登入
2. 系統透過 Firebase Authentication 驗證身份
3. 登入成功後，後端產生 JWT Token
4. 使用者攜帶 Token 呼叫後端 API
5. 後端驗證 Token 並回傳對應資料

---

### （二）任務管理流程

1. 使用者發送建立任務請求（POST /tasks）
2. 後端驗證使用者身份與權限
3. 將任務資料寫入 Cloud SQL
4. 回傳建立成功訊息與任務 ID

任務更新流程：

1. 使用者發送更新請求（PATCH /tasks/{id}）
2. 後端執行資料更新（含狀態與指派人）
3. 系統記錄操作日誌（task_logs）
4. 若有訂閱機制，觸發即時更新事件

---

### （三）即時更新流程（選用進階）

1. 使用者訂閱任務更新（WebSocket / SSE）
2. 當任務資料變動時，後端觸發事件
3. 系統將更新推送至所有訂閱用戶
4. 前端即時更新畫面內容

---

### （四）檔案上傳流程

1. 使用者請求上傳檔案
2. 後端產生 Signed URL
3. 使用者直接上傳至 Cloud Storage
4. 系統回傳檔案存取 URL 並記錄至資料庫

---

### （五）非同步處理流程（重點）

1. 任務建立或更新後，後端發送訊息至 Pub/Sub
2. Subscriber 接收訊息並執行對應任務，例如：

   * 發送 Email 通知
   * 任務到期提醒
   * 寫入分析資料
3. 系統支援失敗重試與錯誤處理機制

---

### （六）數據分析流程

1. 系統持續收集任務操作記錄（task_logs）
2. 將資料存入資料庫或分析系統
3. 後端定期進行資料聚合（Aggregation）
4. 提供 API 給前端 Dashboard 使用
5. 顯示內容包含：

   * 任務完成數量
   * 使用者效率
   * 任務平均處理時間

---

## 四、後端技術設計

### （一）API 設計原則

* 採用 RESTful API 架構
* 使用 JSON 作為資料交換格式
* 實作標準 HTTP 狀態碼

範例：

POST /tasks
GET /tasks
GET /tasks/{id}
PATCH /tasks/{id}
DELETE /tasks/{id}

---

### （二）資料庫設計

#### users 表

* id
* email
* role

#### tasks 表

* id
* title
* status
* assigned_to
* created_at

#### task_logs 表（進階）

* id
* task_id
* action
* timestamp

---

## 五、系統部署流程

1. 開發後端 API 並進行容器化（Docker）
2. 將映像檔上傳至 Container Registry
3. 部署至 Cloud Run
4. 建立並連接 Cloud SQL 資料庫
5. 設定 Pub/Sub 與相關訂閱服務
6. 完成整體系統整合與測試

---

## 六、專題特色與技術亮點

* 使用雲端原生架構（Cloud-Native Architecture）
* 實作 JWT 身份驗證與 RBAC 權限控制
* 導入非同步訊息佇列（Pub/Sub）
* 支援即時資料更新機制
* 建立可擴展與高可用系統架構
* 整合數據分析功能提升系統價值

---

## 七、未來擴展方向

* 微服務架構拆分（Microservices Architecture）
* 導入 CI/CD 自動部署流程
* 加入快取機制（如 Redis）提升效能
