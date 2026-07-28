// 全局常量配置
const PROXY_URL = '/proxy/';    // 适用于 Cloudflare, Netlify (带重写), Vercel (带重写)
// const HOPLAYER_URL = 'https://hoplayer.com/index.html';
const SEARCH_HISTORY_KEY = 'videoSearchHistory';
const MAX_HISTORY_ITEMS = 5;

// 密码保护配置
// 注意：PASSWORD 环境变量是必需的，所有部署都必须设置密码以确保安全
const PASSWORD_CONFIG = {
    localStorageKey: 'passwordVerified',  // 存储验证状态的键名
    verificationTTL: 90 * 24 * 60 * 60 * 1000  // 验证有效期（90天，约3个月）
};

// 网站信息配置
const SITE_CONFIG = {
    name: 'LibreTV',
    url: 'https://libretv.is-an.org',
    description: '免费在线视频搜索与观看平台',
    logo: 'image/logo.png',
    version: '1.1.0',
    build: '202607181901'
};

// API站点配置
const API_SITES = {
    '155': {
        api: 'https://155api.com/api.php/provide/vod',
        name: '155资源',
    },
    '36717': {
        api: 'http://www.36717.info/api.php/provide/vod',
        name: '麻豆视频',
    },
    hhzy: {
        api: 'https://hhzyapi.com/api.php/provide/vod/',
        name: '豪华资源',
    },
    kuaichezy: {
        api: 'https://caiji.kuaichezy.org/api.php/provide/vod/',
        name: '快车资源',
    },
    lziapi: {
        api: 'https://cj.lziapi.com/api.php/provide/vod/',
        name: '影视工厂',
    },
    hongniuzy2: {
        api: 'https://www.hongniuzy2.com/api.php/provide/vod/',
        name: '红牛资源',
    },
    xinlang: {
        api: 'https://api.xinlangapi.com/xinlangapi.php/provide/vod/',
        name: '新浪点播',
    },
    ukuapi: {
        api: 'https://api.ukuapi.com/api.php/provide/vod/',
        name: 'U酷资源',
    },
    ckzy: {
        api: 'https://ckzy.me/api.php/provide/vod/',
        name: 'CK资源',
    },
    s1080zyku: {
        api: 'https://api.1080zyku.com/inc/api_mac10.php/',
        name: '1080资源库',
    },
    p2100: {
        api: 'https://p2100.net/api.php/provide/vod/',
        name: '飘零资源',
    },
    subocaiji: {
        api: 'https://subocaiji.com/api.php/provide/vod/',
        name: '速播资源',
    },
    wolongzyw: {
        api: 'https://collect.wolongzyw.com/api.php/provide/vod/',
        name: '卧龙资源2',
    },
    maotaizy: {
        api: 'https://caiji.maotaizy.cc/api.php/provide/vod/',
        name: '茅台资源',
    },
    ikunzy: {
        api: 'https://ikunzyapi.com/api.php/provide/vod/',
        name: 'iKun资源',
    },
    wwzy: {
        api: 'https://wwzy.tv/api.php/provide/vod/',
        name: '旺旺短剧',
    },
    wujin: {
        api: 'https://api.wujinapi.me/api.php/provide/vod/',
        name: '无尽资源',
    },
    apibdzy: {
        api: 'https://api.apibdzy.com/api.php/provide/vod/',
        name: '百度云资源',
    },
    zuid: {
        api: 'https://api.zuidapi.com/api.php/provide/vod/',
        name: '最大资源',
    },
    mdzy: {
        api: 'https://www.mdzyapi.com/api.php/provide/vod/',
        name: '魔都资源',
    },
    mozhuazy: {
        api: 'https://mozhuazy.com/api.php/provide/vod/',
        name: '魔爪资源',
    },
    dbzy: {
        api: 'https://dbzy.tv/api.php/provide/vod/',
        name: '豆瓣资源',
    },
    wolongzyw2: {
        api: 'https://wolongzyw.com/api.php/provide/vod/',
        name: '卧龙资源',
    },
    s360zy: {
        api: 'https://360zy.com/api.php/provide/vod/',
        name: '360资源',
    },
    tyyszy: {
        api: 'https://tyyszy.com/api.php/provide/vod/',
        name: '天涯资源',
    },
    bfzy: {
        api: 'https://bfzyapi.com/api.php/provide/vod/',
        name: '暴风资源',
    },
    dyttzy: {
        api: 'https://caiji.dyttzyapi.com/api.php/provide/vod/',
        name: '电影天堂资源',
    },
    rycj: {
        api: 'http://cj.rycjapi.com/api.php/provide/vod/',
        name: '如意资源',
    },
    jszy: {
        api: 'https://jszyapi.com/api.php/provide/vod/',
        name: '极速资源',
    },
    ffzy5: {
        api: 'http://ffzy5.tv/api.php/provide/vod/',
        name: '非凡影视',
    },
    iqiyizy: {
        api: 'https://www.iqiyizyapi.com/api.php/provide/vod',
        name: 'iqiyi资源',
    },
    wyvod: {
        api: 'https://www.wyvod.com/api.php/provide/vod',
        name: '无忧影视',
    },
    jkunzy: {
        api: 'https://www.jkunzyapi.com/api.php/provide/vod',
        name: 'JKUN资源站',
    },
    heiliaozy: {
        api: 'https://heiliaozyapi.com/api.php/provide/vod',
        name: 'heiliaoz资源',
    },
    jusj: {
        api: 'https://cj.jusj.top/api.php/provide/vod',
        name: '奇妙官采',
    },
    md: {
        api: 'https://md91.cc/api.php/provide/vod',
        name: '麻豆视频',
    },
    maoyan: {
        api: 'https://api.maoyanapi.top/api.php/provide/vod',
        name: 'maoyan资源',
    },
    chujia: {
        api: 'http://chujia.cc/api.php/provide/vod',
        name: '爱豆传媒',
    },
    bt: {
        api: 'http://bt4.cc/api.php/provide/vod',
        name: '麻豆视频',
    },
    xiaomaomi: {
        api: 'http://zy.xiaomaomi.cc/api.php/provide/vod',
        name: '小猫咪采集',
    },
    ip1501099444: {
        api: 'http://150.109.94.44:1112/api.php/provide/vod',
        name: '網頁版',
    },
    zitv: {
        api: 'http://www.zitv.cc/api.php/provide/vod',
        name: '官方资源网',
    },
    yayazy: {
        api: 'https://yayazy2.com/api.php/provide/vod',
        name: '丫丫资源网',
    },
    sdzy: {
        api: 'https://xsd.sdzyapi.com/api.php/provide/vod',
        name: 'sdzy资源',
    },
    xingba: {
        api: 'https://xingba222.com/api.php/provide/vod',
        name: '杏吧资源站',
    },
    moduzy: {
        api: 'https://www.moduzy.com/api.php/provide/vod',
        name: '魔都资源网',
    },
    lovedan: {
        api: 'https://www.lovedan.net/api.php/provide/vod',
        name: '艾旦影视',
    },
    jingpinx: {
        api: 'https://www.jingpinx.com/api.php/provide/vod',
        name: '精品x资源采集',
    },
    huya: {
        api: 'https://www.huyaapi.com/api.php/provide/vod',
        name: 'huya资源',
    },
    thzy: {
        api: 'https://thzy1.me/api.php/provide/vod',
        name: '桃花资源采集',
    },
    suoni: {
        api: 'https://suoniapi.com/api.php/provide/vod',
        name: 'suoni资源',
    },
    slapibf: {
        api: 'https://slapibf.com/api.php/provide/vod',
        name: 'slapibf资源',
    },
    shayu: {
        api: 'https://shayuapi.com/api.php/provide/vod',
        name: '鲨鱼资源',
    },
    senlinzy: {
        api: 'https://senlinzy2.com/api.php/provide/vod',
        name: '森林资源',
    },
    apiyhzy: {
        api: 'https://m3u8.apiyhzy.com/api.php/provide/vod',
        name: 'apiyhzy资源',
    },
    lzizy: {
        api: 'https://lzizy1.com/api.php/provide/vod',
        name: '量子资源网',
    },
    lb: {
        api: 'https://lbapi9.com/api.php/provide/vod',
        name: 'lb资源',
    },
    jyzy: {
        api: 'https://jyzyapi.com/provide/vod',
        name: 'jyzy资源',
    },
    fqzy: {
        api: 'https://fqzy.me/api.php/provide/vod',
        name: '番茄资源',
    },
    lzcaiji: {
        api: 'https://cj.lzcaiji.com/api.php/provide/vod',
        name: 'lzcaiji资源',
    },
    modu: {
        api: 'https://caiji.moduapi.cc/api.php/provide/vod',
        name: '魔都资源网',
    },
    xiaojizy: {
        api: 'https://api.xiaojizy.live/provide/vod',
        name: '小鸡资源采集站',
    },
    wsyzy: {
        api: 'https://api.wsyzy.net/api.php/provide/vod',
        name: '无水印资源网',
    },
    niuniuzy: {
        api: 'https://api.niuniuzy.me/api.php/provide/vod',
        name: '牛牛资源网',
    },
    apilj: {
        api: 'https://apilj.com/api.php/provide/vod',
        name: 'apilj资源',
    },
    guangsu: {
        api: 'https://api.guangsuapi.com/api.php/provide/vod',
        name: 'guangsu资源',
    },
    dou: {
        api: 'https://api.douapi.cc/api.php/provide/vod',
        name: 'dou资源',
    },
    dd: {
        api: 'https://api.ddapi.cc/api.php/provide/vod',
        name: 'dd资源',
    },
    aosikazy: {
        api: 'https://aosikazy2.com/api.php/provide/vod',
        name: '奥斯卡资源网',
    },
    '360zyzz': {
        api: 'https://360zyzz.com/api.php/provide/vod',
        name: '360zyzz资源',
    },
    lbapiby: {
        api: 'http://lbapiby.com/api.php/provide/vod',
        name: 'lbapiby资源',
    },
    fh: {
        api: 'http://fhapi9.com/api.php/provide/vod',
        name: 'fh资源',
    },
    '11bat': {
        api: 'http://api.11bat.com/api.php/provide/vod',
        name: '辣椒资源',
    },
    ip154219117232: {
        api: 'http://154.219.117.232:9981/jacloudapi.php/provide/vod',
        name: '建安资源站',
    },
    yutuzy: {
        api: 'https://yutuzy3.com/api.php/provide/vod',
        name: '玉兔资源网',
    },
    apiyutu: {
        api: 'https://apiyutu.com/api.php/provide/vod',
        name: '玉兔资源网',
    },
    apilsbzy: {
        api: 'https://apilsbzy1.com/api.php/provide/vod',
        name: '玉兔资源网',
    },
    naixxzy: {
        api: 'https://Naixxzy.com/api.php/provide/vod',
        name: '奶香香资源',
        adult: true
    },
    madouse: {
        api: 'http://www.madouse.la/api.php/provide/vod',
        name: '爱豆传媒',
        adult: true
    },
    '91md': {
        api: 'https://91md.me/api.php/provide/vod',
        name: '麻豆视频',
        adult: true
    },
    '9191md': {
        api: 'http://www.9191md.me/api.php/provide/vod',
        name: '麻豆视频',
        adult: true
    },
    lajiaozy: {
        api: 'http://www.lajiaozy18.com/api.php/provide/vod',
        name: '辣椒资源',
        adult: true
    },
    xxavs: {
        api: 'https://xxavs.com/api.php/provide/vod',
        name: 'XXAVS资源',
        adult: true
    },
    hsckzy: {
        api: 'https://hsckzy.vip/api.php/provide/vod',
        name: '黄色仓库资源站',
        adult: true
    },
    apidanaizi: {
        api: 'https://apidanaizi.com/api.php/provide/vod',
        name: 'apidanai资源',
        adult: true
    },
    aibozy: {
        api: 'https://aibozy.site/api.php/provide/vod',
        name: '爱播资源',
        adult: true
    },
    '91av': {
        api: 'https://91av.cyou/api.php/provide/vod',
        name: '91视频',
        adult: true
    },
    sex8zy: {
        api: 'https://sex8zy7.com/api.php/provide/vod',
        name: '杏吧资源站',
        adult: true
    },
    souavzyw: {
        api: 'https://api.souavzyw.net/api.php/provide/vod',
        name: '搜av',
        adult: true
    },
    souavzy: {
        api: 'https://api.souavzy.vip/api.php/provide/vod',
        name: '搜AV资源网',
        adult: true
    },
    testSource: {
        api: 'https://www.example.com/api.php/provide/vod',
        name: '空内容测试源',
        adult: true
    },
};

// 定义合并方法
function extendAPISites(newSites) {
    Object.assign(API_SITES, newSites);
}

// 暴露到全局
window.API_SITES = API_SITES;
window.extendAPISites = extendAPISites;


// 添加聚合搜索的配置选项
const AGGREGATED_SEARCH_CONFIG = {
    enabled: true,             // 是否启用聚合搜索
    timeout: 8000,            // 单个源超时时间（毫秒）
    maxResults: 10000,          // 最大结果数量
    parallelRequests: true,   // 是否并行请求所有源
    showSourceBadges: true    // 是否显示来源徽章
};

// 抽象API请求配置
const API_CONFIG = {
    search: {
        // 只拼接参数部分，不再包含 /api.php/provide/vod/
        path: '?ac=videolist&wd=',
        pagePath: '?ac=videolist&wd={query}&pg={page}',
        maxPages: 50, // 最大获取页数
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'application/json'
        }
    },
    detail: {
        // 只拼接参数部分
        path: '?ac=videolist&ids=',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'application/json'
        }
    }
};

// 优化后的正则表达式模式
const M3U8_PATTERN = /\$https?:\/\/[^"'\s]+?\.m3u8/g;

// 添加自定义播放器URL
const CUSTOM_PLAYER_URL = 'player.html'; // 使用相对路径引用本地player.html

// 增加视频播放相关配置
const PLAYER_CONFIG = {
    autoplay: true,
    allowFullscreen: true,
    width: '100%',
    height: '600',
    timeout: 15000,  // 播放器加载超时时间
    filterAds: true,  // 是否启用广告过滤
    autoPlayNext: true,  // 默认启用自动连播功能
    adFilteringEnabled: true, // 默认开启分片广告过滤
    adFilteringStorage: 'adFilteringEnabled' // 存储广告过滤设置的键名
};

// 增加错误信息本地化
const ERROR_MESSAGES = {
    NETWORK_ERROR: '网络连接错误，请检查网络设置',
    TIMEOUT_ERROR: '请求超时，服务器响应时间过长',
    API_ERROR: 'API接口返回错误，请尝试更换数据源',
    PLAYER_ERROR: '播放器加载失败，请尝试其他视频源',
    UNKNOWN_ERROR: '发生未知错误，请刷新页面重试'
};

// 添加进一步安全设置
const SECURITY_CONFIG = {
    enableXSSProtection: true,  // 是否启用XSS保护
    sanitizeUrls: true,         // 是否清理URL
    maxQueryLength: 100,        // 最大搜索长度
    // allowedApiDomains 不再需要，因为所有请求都通过内部代理
};

// 添加多个自定义API源的配置
const CUSTOM_API_CONFIG = {
    separator: ',',           // 分隔符
    maxSources: 5,            // 最大允许的自定义源数量
    testTimeout: 5000,        // 测试超时时间(毫秒)
    namePrefix: 'Custom-',    // 自定义源名称前缀
    validateUrl: true,        // 验证URL格式
    cacheResults: true,       // 缓存测试结果
    cacheExpiry: 5184000000,  // 缓存过期时间(2个月)
    adultPropName: 'isAdult' // 用于标记成人内容的属性名
};

// 隐藏内置黄色采集站API的变量
const HIDE_BUILTIN_ADULT_APIS = false;
