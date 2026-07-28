// 获取当前URL的参数，并将它们传递给player.html

// 将 /s=keyword 路径形式的搜索URL规范化为 /?s=keyword 查询串形式。
// 原因: CF Worker 把 /s=xxx 当静态文件去 GitHub raw 拉取 -> 404; / 永远返回 index.html,
// 前端 index-page.js 会读取 ?s= 自动重搜。规范化后 lastPageUrl / returnUrl 都可被直接加载。
// 逐层解码以兼容多重编码的输入(详见 player.js 同名函数注释)。
function normalizeSearchUrl(rawUrl) {
    if (!rawUrl) return rawUrl;
    let url = rawUrl;
    for (let i = 0; i < 3; i++) {
        if (/^https?:\/\//i.test(url) || url.charAt(0) === '/') break;
        try {
            const next = decodeURIComponent(url);
            if (next === url) break;
            url = next;
        } catch (e) { break; }
    }
    try {
        const u = new URL(url, window.location.origin);
        if (u.pathname.startsWith('/s=')) {
            const keyword = decodeURIComponent(u.pathname.slice(3));
            u.pathname = '/';
            u.searchParams.set('s', keyword);
            return u.toString();
        }
    } catch (e) {
        // 解析失败则原样返回
    }
    return url;
}

window.onload = function() {
    // 获取当前URL的查询参数
    const currentParams = new URLSearchParams(window.location.search);
    
    // 创建player.html的URL对象
    const playerUrlObj = new URL("player.html", window.location.origin);
    
    // 更新状态文本
    const statusElement = document.getElementById('redirect-status');
    const manualRedirect = document.getElementById('manual-redirect');
    let statusMessages = [
        "准备视频数据中...",
        "正在加载视频信息...",
        "即将开始播放...",
    ];
    let currentStatus = 0;
    
    // 状态文本动画
    let statusInterval = setInterval(() => {
        if (currentStatus >= statusMessages.length) {
            currentStatus = 0;
        }
        if (statusElement) {
            statusElement.textContent = statusMessages[currentStatus];
            statusElement.style.opacity = 0.7;
            setTimeout(() => {
                if (statusElement) statusElement.style.opacity = 1;
            }, 300);
        }
        currentStatus++;
    }, 1000);
    
    // 确保保留所有原始参数
    currentParams.forEach((value, key) => {
        playerUrlObj.searchParams.set(key, value);
    });
    
    // 获取来源URL (如果存在)
    const referrer = document.referrer;
    
    // 获取当前URL中的返回URL参数（如果有）
    const backUrl = currentParams.get('back');
    
    // 确定返回URL的优先级：1. 指定的back参数 2. referrer 3. 搜索页面
    let returnUrl = '';
    if (backUrl) {
        // 有显式指定的返回URL
        // currentParams.get('back') 已解码一次,不能再 decodeURIComponent(否则二次解码)
        returnUrl = backUrl;
    } else if (referrer && (referrer.includes('/s=') || referrer.includes('?s='))) {
        // 来源是搜索页面
        returnUrl = referrer;
    } else if (referrer && referrer.trim() !== '') {
        // 如果有referrer但不是搜索页，也使用它
        returnUrl = referrer;
    } else {
        // 默认回到首页
        returnUrl = '/';
    }

    // 规范化搜索URL: /s=keyword -> /?s=keyword,避免Worker把 /s=xxx 当静态文件拉取而404
    returnUrl = normalizeSearchUrl(returnUrl);

    // 将返回URL添加到player.html的参数中
    if (!playerUrlObj.searchParams.has('returnUrl')) {
        // searchParams.set 本身会编码,不要再 encodeURIComponent(否则双重编码,
        // goBack 端 urlParams.get 只解一次会拿到还编码着的值 -> 当相对路径解析 -> 404)
        playerUrlObj.searchParams.set('returnUrl', returnUrl);
    }
    
    // 同时保存在localStorage中，作为备用
    localStorage.setItem('lastPageUrl', returnUrl);
    
    // 标记来自搜索页面
    if (returnUrl.includes('/s=') || returnUrl.includes('?s=')) {
        localStorage.setItem('cameFromSearch', 'true');
        localStorage.setItem('searchPageUrl', returnUrl);
    }
    
    // 获取最终的URL字符串
    const finalPlayerUrl = playerUrlObj.toString();
    
    // 更新手动重定向链接
    if (manualRedirect) {
        manualRedirect.href = finalPlayerUrl;
    }

    // 更新meta refresh标签
    const metaRefresh = document.querySelector('meta[http-equiv="refresh"]');
    if (metaRefresh) {
        metaRefresh.content = `3; url=${finalPlayerUrl}`;
    }
    
    // 重定向到播放器页面
    setTimeout(() => {
        clearInterval(statusInterval);
        window.location.href = finalPlayerUrl;
    }, 2800); // 稍微早于meta refresh的时间，确保我们的JS控制重定向
};