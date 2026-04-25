// ========================================
// 第六週作業：電商 API 資料串接練習
// 執行方式：node homework.js
// 環境需求：Node.js 18+（內建 fetch）
// ========================================

// 載入環境變數
require("dotenv").config({ path: ".env" });

// API 設定（從 .env 讀取）
const API_PATH = process.env.API_PATH;
const BASE_URL = "https://livejs-api.hexschool.io";
const ADMIN_TOKEN = process.env.API_KEY;

// ========================================
// 任務一：基礎 fetch 練習
// ========================================

/**
 * 1. 取得產品列表
 * 使用 fetch 發送 GET 請求
 * @returns {Promise<Array>} - 回傳 products 陣列
 */
async function getProducts() {
	// 請實作此函式
	// 提示：
	// 1. 使用 fetch() 發送 GET 請求
	// 2. 使用 response.json() 解析回應
	// 3. 回傳 data.products

	// catch 擋網路層錯誤
	try {
		const url = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`;
		const response = await fetch(url);
		// 擋 4XX、5XX 錯誤
		if (!response.ok) {
			console.error('Server 回傳錯誤：', response.status); // 開發者除錯用
			return { success: false, error: `HTTP ${response.status}` }; // 呼叫端處理用
			// 或用 throw new Error('錯誤訊息');
		};

		const data = await response.json();
		return data.products;
	} catch (error) {
		console.error('網路層錯誤，取得產品資料失敗')
		return { success: false, error: '網路層錯誤，取得產品資料失敗' };
	}
}

/**
 * 2. 取得購物車列表
 * @returns {Promise<Object>} - 回傳 { carts: [...], total: 數字, finalTotal: 數字 }
 */
async function getCart() {
	// 請實作此函式
	try {
		const url = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`;
		const response = await fetch(url);

		if (!response.ok) {
			console.error('Server 回傳錯誤：', response.status);
			return { success: false, error: `HTTP ${response.status}` };
		}

		const data = await response.json();
		const { carts, total, finalTotal } = data;
		return { carts, total, finalTotal };
	} catch (error) {
		console.error('網路層錯誤，取得購物車資料失敗');
		return { success: false, error: '網路層錯誤，取得購物車資料失敗' };
	}
}

/**
 * 3. 錯誤處理：當 API 回傳錯誤時，回傳錯誤訊息
 * @returns {Promise<Object>} - 回傳 { success: boolean, data?: [...], error?: string }
 */
async function getProductsSafe() {
	// 請實作此函式
	// 提示：
	// 1. 加上 try-catch 處理錯誤
	// 2. 檢查 response.ok 判斷是否成功
	// 3. 成功回傳 { success: true, data: [...] }
	// 4. 失敗回傳 { success: false, error: '錯誤訊息' }
	try {
		const url = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`;
		const response = await fetch(url);

		if (!response.ok) {
			console.error('Server 回傳錯誤：', response.status);
			return { success: true, error: `HTTP 層錯誤：${response.status}`};
		}

		const data = await response.json();
		return { success: true, data: data.products};
	} catch (error) {
		console.error('網路層錯誤')
		return { sucess: false, error: '網路層錯誤'};
	}
}

// ========================================
// 任務二：POST 請求 - 購物車操作
// ========================================

/**
 * 1. 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function addToCart(productId, quantity) {
	// 請實作此函式
	// 提示：
	// 1. 發送 POST 請求
	// 2. body 格式：{ data: { productId: "xxx", quantity: 1 } }
	// 3. 記得設定 headers: { 'Content-Type': 'application/json' }
	// 4. body 要用 JSON.stringify() 轉換
	try {
		const url = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`;
		const fetchOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ data: { productId, quantity} }),
		};
		const response = await fetch(url, fetchOptions);

		if (!response.ok) {
			console.error('Server 回傳錯誤：', response.status);
			return { success: false, error: `HTTP ${response.status}` };
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('網路層錯誤，加入購物車操作失敗');
		return { success: false, error: '網路層錯誤，加入購物車操作失敗' };
	}
}

/**
 * 2. 編輯購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function updateCartItem(cartId, quantity) {
	// 請實作此函式
	// 提示：
	// 1. 發送 PATCH 請求
	// 2. body 格式：{ data: { id: "購物車ID", quantity: 數量 } }
	try {
		const url = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`;
		const fetchOptions = {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ data: { id: cartId, quantity }}),
		}
		const response = await fetch(url, fetchOptions);

		if (!response.ok) {
			console.error('Server 回傳錯誤：', response.status);
			return { success: false, error: `HTTP ${response.status}` };
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('網路層錯誤，編輯購物車商品數量失敗');
		return { success: false, error: '網路層錯誤，編輯購物車商品數量失敗' };
	}
}

/**
 * 3. 刪除購物車特定商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function removeCartItem(cartId) {
	// 請實作此函式
	// 提示：發送 DELETE 請求到 /carts/{id}
	try {
		const url = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts/${cartId}`;
		const fetchOptions = {
			method: 'DELETE',
		}
		const response = await fetch(url, fetchOptions);

		if (!response.ok) {
			console.error('Server 回傳錯誤：', response.status);
			return { success: false, error: `HTTP ${response.status}` };
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('網路層錯誤，刪除購物車特定商品失敗');
		return { success: false, error: '網路層錯誤，刪除購物車特定商品失敗' };
	}
}

/**
 * 4. 清空購物車
 * @returns {Promise<Object>} - 回傳清空後的購物車資料
 */
async function clearCart() {
	// 請實作此函式
	// 提示：發送 DELETE 請求到 /carts
	try {
		const url = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`;
		const fetchOptions = {
			method: 'DELETE',
		};
		const response = await fetch(url, fetchOptions);

		if (!response.ok) {
			console.error('Server 回傳錯誤：', response.status);
			return { success: false, error: `HTTP ${response.status}` };
		};

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('網路層錯誤，清空購物車操作失敗');
		return { success: false, error: '網路層錯誤，清空購物車操作失敗' };
	}
}

// ========================================
// HTTP 知識測驗 (額外練習)
// ========================================

/*
請回答以下問題（可以寫在這裡或另外繳交）：

1. HTTP 狀態碼的分類（1xx, 2xx, 3xx, 4xx, 5xx 各代表什麼）
   答：
	 1xx：資訊、請求處理中
	 2xx：請求成功
	 3xx：重新導向
	 4xx：用戶端錯誤（前端/用戶 -> 修改請求內容）
	 5xx：伺服器端錯誤（後端 -> 後端修復）

2. GET、POST、PATCH、PUT、DELETE 的差異
   答：
	 GET： 取得資料 HTTP 的方法
	 POST： 送出（新增）資料 HTTP 的方法
	 PATCH：修改（部分）資料 HTTP 的方法
	 PUT： 整份取代 HTTP 的方法
	 DELETE：刪除資料 HTTP 的方法

3. 什麼是 RESTful API？
   答：
	 RESTful API 是指，一種設計 API 的風格規範，讓前後端溝通有統一的規則。
	 RESTful 是 2000 年由 Roy Fielding 提出的設計風格，意指「符合 REST 設計風格的」：
	 	1. URL 路徑：代表資源，用名詞。（/products,  /carts, /user/345/orders）
		2. HTTP 方法：代表動作，用動詞（ GET/POST/PUT/PATCH/DELETE）
		3. HTTP 狀態碼：代表結果 (2xx/4xx/5xx)
		4. 回傳格式：通常是 JSON

		=> RESTful API 的核心概念： 用 HTTP 方法 + URL 來表達網路請求的操作，讓 API 具備統一性與易讀性，以便利前後端溝通與操作。


*/

// ========================================
// 匯出函式供測試使用
// ========================================
module.exports = {
	API_PATH,
	BASE_URL,
	ADMIN_TOKEN,
	getProducts,
	getCart,
	getProductsSafe,
	addToCart,
	updateCartItem,
	removeCartItem,
	clearCart,
};

// ========================================
// 直接執行測試
// ========================================
if (require.main === module) {
	async function runTests() {
		console.log("=== 第六週作業測試 ===\n");
		console.log("API_PATH:", API_PATH);
		console.log("");

		if (!API_PATH) {
			console.log("請先在 .env 檔案中設定 API_PATH！");
			return;
		}

		// 任務一測試
		console.log("--- 任務一：基礎 fetch ---");
		try {
			const products = await getProducts();
			console.log(
				"getProducts:",
				products ? `成功取得 ${products.length} 筆產品` : "回傳 undefined",
			);
		} catch (error) {
			console.log("getProducts 錯誤:", error.message);
		}

		try {
			const cart = await getCart();
			console.log(
				"getCart:",
				cart ? `購物車有 ${cart.carts?.length || 0} 筆商品` : "回傳 undefined",
			);
		} catch (error) {
			console.log("getCart 錯誤:", error.message);
		}

		try {
			const result = await getProductsSafe();
			console.log(
				"getProductsSafe:",
				result?.success ? "成功" : result?.error || "回傳 undefined",
			);
		} catch (error) {
			console.log("getProductsSafe 錯誤:", error.message);
		}

		// 任務二測試
		console.log("--- 任務二：POST 請求 - 購物車操作 ---");

		try {
			const result = await addToCart('zA28CGucDW3PMdFK5frW', 3);
			console.log(
				"addToCart:",
				result,
			);
		} catch (error) {
			console.log("addToCart 錯誤:", error.message);
		}

		try {
			const result = await updateCartItem('JWwXbDdlOnrXbExDt49S', 1);
			console.log(
				"updateCartItem:",
				result,
			);
		} catch (error) {
			console.log("updateCartItem 錯誤:", error.message);
		}

		try {
			const result = await removeCartItem('JWwXbDdlOnrXbExDt49S');
			console.log(
				"removeCartItem:",
				result,
			);
		} catch (error) {
			console.log("removeCartItem 錯誤:", error.message);
		}

		try {
			const result = await clearCart();
			console.log(
				"clearCart:",
				result,
			);
		} catch (error) {
			console.log("clearCart 錯誤:", error.message);
		}

		console.log("\n=== 測試結束 ===");
		console.log("\n提示：執行 node test.js 進行完整驗證");
	}

	runTests();
}
