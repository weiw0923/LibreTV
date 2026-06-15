// LibreTV Worker - static files from GitHub + proxy handler

// --- Proxy constants ---
var MEDIA_FILE_EXTENSIONS = [
    '.mp4', '.webm', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.f4v', '.m4v', '.3gp', '.3g2', '.ts', '.mts', '.m2ts',
    '.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac', '.wma', '.alac', '.aiff', '.opus',
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg', '.avif', '.heic'
];
var MEDIA_CONTENT_TYPES = ['video/', 'audio/', 'image/'];
var IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg', '.avif', '.heic'];

var PASSWORD = typeof PASSWORD !== 'undefined' ? PASSWORD : 'uiriamu'; // 从环境变量读取，默认 uiriamu
var PASSWORD_HASH = ''; // 运行时计算
var GITHUB_RAW = 'https://raw.githubusercontent.com/weiw0923/LibreTV/main';
var CACHE_TTL = 86400;
var MAX_RECURSION = 5;

var MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webmanifest': 'application/manifest+json',
};

addEventListener('fetch', function(event) {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    var url = new URL(request.url);
    var path = url.pathname;

    // Handle CORS preflight for all paths
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // Handle /proxy/ paths
    if (path.startsWith('/proxy/')) {
        return handleProxy(request, url);
    }

    // Serve static files from GitHub raw
    return serveStatic(path, request);
}

// --- Static file serving ---

async function serveStatic(path, request) {
    var filePath = (path === '/' || path === '') ? '/index.html' : path;

    var ext = '';
    for (var key in MIME_TYPES) {
        if (MIME_TYPES.hasOwnProperty(key) && filePath.endsWith(key)) {
            ext = key;
            break;
        }
    }
    var contentType = MIME_TYPES[ext] || 'application/octet-stream';

    var fetchUrl = GITHUB_RAW + filePath;
    var response = await fetch(fetchUrl, {
        headers: { 'User-Agent': 'LibreTV-Worker' }
    });

    if (!response.ok) {
        return new Response('Not Found', { status: 404 });
    }

    // 去掉 GitHub raw 的危险头部（CSP、CORS 限制等）
    var unsafeHeaders = ['content-security-policy', 'x-content-type-options', 'x-frame-options',
                         'cross-origin-resource-policy', 'cross-origin-opener-policy',
                         'strict-transport-security', 'access-control-allow-origin',
                         'vary', 'via', 'x-cache', 'x-cache-hits', 'source-age'];
    var headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cache-Control', 'public, max-age=14400');

    // Inject PASSWORD for HTML pages - 从环境变量读取
    if (contentType.includes('text/html')) {
        var pwd = typeof PASSWORD !== 'undefined' ? PASSWORD : 'uiriamu';
        var hash = await sha256Hex(pwd);
        var html = await response.text();
        html = html.replace(
            'window.__ENV__.PASSWORD = "{{PASSWORD}}";',
            'window.__ENV__.PASSWORD = "' + hash + '";'
        );
        return new Response(html, { headers: headers });
    }

    return new Response(response.body, { headers: headers });
}

// --- Proxy handler ---

async function handleProxy(request, url) {
    var pwd = typeof PASSWORD !== 'undefined' ? PASSWORD : 'uiriamu';
    var targetUrl = getTargetUrlFromPath(url.pathname);

    if (!targetUrl) {
        return new Response('Invalid proxy path', { status: 400, headers: corsHeaders() });
    }

    // Check if this is an image request or douban domain - skip auth
    var isImage = false;
    var targetHost = targetUrl.toLowerCase();
    for (var i = 0; i < IMAGE_EXTENSIONS.length; i++) {
        var p = targetHost.split('?')[0];
        if (p.endsWith(IMAGE_EXTENSIONS[i])) {
            isImage = true;
            break;
        }
    }
    // 豆瓣域名免鉴权（前端不再传 auth 参数）
    var isDouban = targetHost.indexOf('douban') >= 0 || targetHost.indexOf('doubanio') >= 0;

    // 图片直接透传，不做文本处理
    if (isImage) {
        try {
            var originalReferer = request.headers.get('Referer') || '';
            var imgResponse = await fetchImage(targetUrl, originalReferer);
            return imgResponse;
        } catch (err) {
            return new Response('Proxy error: ' + err.message, {
                status: 500, headers: corsHeaders()
            });
        }
    }

    if (!isImage && !isDouban) {
        var authValid = await validateAuth(request);
        if (!authValid) {
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
                status: 401,
                headers: mergeHeaders(corsHeaders(), { 'Content-Type': 'application/json' })
            });
        }
    }

    try {
        var originalReferer = request.headers.get('Referer') || '';
        var result = await fetchContent(targetUrl, originalReferer);
        var content = result.content;
        var contentType = result.contentType;
        var responseHeaders = result.responseHeaders;
        var finalHeaders = new Headers();
        finalHeaders.set('Access-Control-Allow-Origin', '*');
        finalHeaders.set('Cache-Control', 'public, max-age=' + CACHE_TTL);
        finalHeaders.set('Content-Type', contentType);

        if (isM3u8Content(content, contentType)) {
            var processed = await processM3u8(targetUrl, content, 0);
            return new Response(processed, {
                headers: {
                    'Content-Type': 'application/vnd.apple.mpegurl',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'public, max-age=' + CACHE_TTL
                }
            });
        }

        return new Response(content, { headers: finalHeaders });
    } catch (err) {
        return new Response('Proxy error: ' + err.message, {
            status: 500,
            headers: corsHeaders()
        });
    }
}

function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
    };
}

function mergeHeaders(a, b) {
    var result = {};
    for (var key in a) result[key] = a[key];
    for (var key in b) result[key] = b[key];
    return result;
}

function getTargetUrlFromPath(pathname) {
    var encoded = pathname.replace(/^\/proxy\//, '');
    if (!encoded) return null;
    try {
        // 如果 pathname 包含 %2F (/) 说明 Cloudflare 没有解码，直接用
        // 否则尝试解码
        var decoded;
        if (encoded.indexOf('%') >= 0) {
            decoded = decodeURIComponent(encoded);
        } else {
            decoded = encoded;
        }
        if (!decoded.match(/^https?:\/\//i)) {
            if (encoded.match(/^https?:\/\//i)) decoded = encoded;
            else return null;
        }
        // 用 URL 构造函数确保 URL 中的非 ASCII 字符被正确编码
        var urlObj = new URL(decoded);
        return urlObj.toString();
    } catch(e) {
        return null;
    }
}

async function validateAuth(request) {
    var url = new URL(request.url);
    var authHash = url.searchParams.get('auth');
    var timestamp = url.searchParams.get('t');
    var pwd = typeof PASSWORD !== 'undefined' ? PASSWORD : 'uiriamu';
    if (!pwd) return false;

    var serverHash = await sha256Hex(pwd);

    if (!authHash || authHash !== serverHash) return false;

    if (timestamp) {
        var now = Date.now();
        if (now - parseInt(timestamp) > 600000) return false;
    }
    return true;
}

async function sha256Hex(str) {
    var encoder = new TextEncoder();
    var data = encoder.encode(str);
    var hashBuffer = await crypto.subtle.digest('SHA-256', data);
    var hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
}

async function fetchContent(targetUrl, referer) {
    var reqHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
    };
    // 自动设置 Referer：如果目标域名包含 douban，用 douban.com
    // 浏览器端禁止 JS 修改 Referer 头，所以不能依赖浏览器传入
    if (targetUrl.indexOf('douban') >= 0) {
        reqHeaders['Referer'] = 'https://movie.douban.com/';
    } else if (referer) {
        reqHeaders['Referer'] = referer;
    }
    var response = await fetch(targetUrl, { headers: reqHeaders });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    var content = await response.text();
    var contentType = response.headers.get('Content-Type') || '';
    return { content: content, contentType: contentType, responseHeaders: response.headers };
}

// 图片直接透传，不做文本处理（二进制数据用 text() 会损坏）
async function fetchImage(targetUrl, referer) {
    var reqHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8',
    };
    if (targetUrl.indexOf('douban') >= 0) {
        reqHeaders['Referer'] = 'https://movie.douban.com/';
    } else if (referer) {
        reqHeaders['Referer'] = referer;
    }
    var response = await fetch(targetUrl, { headers: reqHeaders });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    var headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
    headers.set('Content-Length', response.headers.get('Content-Length') || '');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cache-Control', 'public, max-age=' + CACHE_TTL);
    return new Response(response.body, { headers: headers });
}

function isM3u8Content(content, contentType) {
    if (contentType && (contentType.indexOf('mpegurl') >= 0 || contentType.indexOf('x-mpegurl') >= 0)) return true;
    return content && content.trim().indexOf('#EXTM3U') === 0;
}

function getBaseUrl(urlStr) {
    try {
        var p = new URL(urlStr);
        var pathParts = p.pathname.split('/');
        pathParts.pop();
        return p.origin + pathParts.join('/') + '/';
    } catch(e) {
        var lastSlash = urlStr.lastIndexOf('/');
        return lastSlash > urlStr.indexOf('://') + 2 ? urlStr.substring(0, lastSlash + 1) : urlStr + '/';
    }
}

function resolveUrl(baseUrl, relativeUrl) {
    if (relativeUrl.match(/^https?:\/\//i)) return relativeUrl;
    try {
        return new URL(relativeUrl, baseUrl).toString();
    } catch(e) {
        if (relativeUrl.startsWith('/')) {
            var u = new URL(baseUrl);
            return u.origin + relativeUrl;
        }
        return baseUrl.replace(/\/[^/]*$/, '/') + relativeUrl;
    }
}

function rewriteUrlToProxy(targetUrl) {
    return '/proxy/' + encodeURIComponent(targetUrl);
}

function processKeyLine(line, baseUrl) {
    return line.replace(/URI="([^"]+)"/, function(match, uri) {
        return 'URI="' + rewriteUrlToProxy(resolveUrl(baseUrl, uri)) + '"';
    });
}

function processMapLine(line, baseUrl) {
    return line.replace(/URI="([^"]+)"/, function(match, uri) {
        return 'URI="' + rewriteUrlToProxy(resolveUrl(baseUrl, uri)) + '"';
    });
}

function processMediaPlaylist(url, content) {
    var baseUrl = getBaseUrl(url);
    var lines = content.split('\n');
    var output = [];
    for (var i = 0; i < lines.length; i++) {
        var t = lines[i].trim();
        if (!t && i === lines.length - 1) { output.push(lines[i]); continue; }
        if (!t) continue;
        if (t.indexOf('#EXT-X-KEY') === 0) { output.push(processKeyLine(t, baseUrl)); continue; }
        if (t.indexOf('#EXT-X-MAP') === 0) { output.push(processMapLine(t, baseUrl)); continue; }
        if (t.indexOf('#') === 0) { output.push(lines[i]); continue; }
        output.push(rewriteUrlToProxy(resolveUrl(baseUrl, t)));
    }
    return output.join('\n');
}

async function processM3u8(url, content, depth) {
    if (depth > MAX_RECURSION) return content;
    if (content.indexOf('#EXT-X-STREAM-INF') >= 0 || content.indexOf('#EXT-X-MEDIA:') >= 0) {
        return processMasterPlaylist(url, content, depth);
    }
    return processMediaPlaylist(url, content);
}

async function processMasterPlaylist(url, content, depth) {
    var baseUrl = getBaseUrl(url);
    var bestBandwidth = -1;
    var bestUrl = '';

    var lines = content.split('\n');
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].indexOf('#EXT-X-STREAM-INF') === 0) {
            var bwMatch = lines[i].match(/BANDWIDTH=(\d+)/);
            var bw = bwMatch ? parseInt(bwMatch[1], 10) : 0;
            for (var j = i + 1; j < lines.length; j++) {
                var l = lines[j].trim();
                if (l && l.indexOf('#') !== 0) {
                    if (bw >= bestBandwidth) {
                        bestBandwidth = bw;
                        bestUrl = resolveUrl(baseUrl, l);
                    }
                    i = j;
                    break;
                }
            }
        }
    }

    if (!bestUrl) {
        for (var k = 0; k < lines.length; k++) {
            var t = lines[k].trim();
            if (t && t.indexOf('#') !== 0 && (t.indexOf('.m3u8') >= 0)) {
                bestUrl = resolveUrl(baseUrl, t);
                break;
            }
        }
    }

    if (!bestUrl) return processMediaPlaylist(url, content);

    var fetched = await fetchContent(bestUrl, '');
    if (!isM3u8Content(fetched.content, fetched.contentType)) {
        return processMediaPlaylist(bestUrl, fetched.content);
    }
    return processM3u8(bestUrl, fetched.content, depth + 1);
}
