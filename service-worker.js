// ========== Service Worker for 阳光夏威夷 ==========
// 支持离线访问和缓存

const CACHE_NAME = 'hawaii-game-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/mobile.html',
  '/css/mobile.css',
  '/css/style.css',
  '/js/core.js',
  '/js/utils.js',
  '/js/game.js',
  '/js/entry.js',
  '/js/config.js',
  '/manifest.json'
];

// 安装事件 - 缓存资源
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker 安装中...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ 缓存资源:', ASSETS_TO_CACHE);
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('✅ Service Worker 安装完成');
        return self.skipWaiting();
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker 激活中...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ 删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker 激活完成');
        return self.clients.claim();
      })
  );
});

// 请求拦截 - 优先使用缓存
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果缓存中有，返回缓存
        if (response) {
          console.log('📦 从缓存加载:', event.request.url);
          return response;
        }
        
        // 否则从网络加载
        console.log('🌐 从网络加载:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // 如果是有效响应，克隆并缓存
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
      .catch((error) => {
        console.error('❌ 加载失败:', error);
        // 可以返回一个离线页面
      })
  );
});
