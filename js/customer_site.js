const CUSTOMER_SITES = {
    // 已合并进 config.js 的 API_SITES（29 个干净源），此处留空
};

// 调用全局方法合并
if (window.extendAPISites) {
    window.extendAPISites(CUSTOMER_SITES);
} else {
    console.error("错误：请先加载 config.js！");
}
