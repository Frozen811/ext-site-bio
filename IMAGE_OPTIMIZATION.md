# Руководство по оптимизации изображений

## 📸 Текущее состояние

Сайт использует изображения с внешнего хостинга (i.ibb.co). Реализованы следующие оптимизации:

- ✅ `<picture>` элемент для адаптивных изображений
- ✅ `loading="lazy"` для отложенной загрузки
- ✅ `decoding="async"` для асинхронного декодирования
- ✅ Атрибуты `width` и `height` для предотвращения CLS
- ✅ CSS медиа-запросы для разных размеров экранов
- ✅ `object-fit: cover` для правильного масштабирования

## 🎯 Рекомендуемые размеры изображений

### Баннер (dossier-banner)
| Устройство | Размер экрана | Рекомендуемый размер | Формат |
|-----------|---------------|---------------------|--------|
| Mobile    | ≤480px        | 480×150px           | WebP   |
| Mobile    | ≤768px        | 768×180px           | WebP   |
| Tablet    | ≤992px        | 992×280px           | WebP   |
| Desktop   | >992px        | 1200×350px          | WebP   |
| Desktop 2x| >992px @2x    | 2400×700px          | WebP   |

### Аватар (avatar)
| Устройство | Размер экрана | Рекомендуемый размер | Формат |
|-----------|---------------|---------------------|--------|
| Mobile    | ≤480px        | 110×110px           | WebP   |
| Mobile    | ≤768px        | 130×130px           | WebP   |
| Tablet    | ≤992px        | 160×160px           | WebP   |
| Desktop   | >992px        | 180×180px           | WebP   |
| Desktop 2x| >992px @2x    | 360×360px           | WebP   |

## 🚀 Как оптимизировать изображения

### 1. Используйте современные форматы

**WebP** - сжимает на 25-35% лучше чем JPEG:

```bash
# Конвертация JPEG в WebP
cwebp input.jpg -q 80 -o output.webp

# Конвертация PNG в WebP
cwebp input.png -q 80 -o output.webp
```

**AVIF** - сжимает на 50% лучше чем JPEG (новейший формат):

```bash
# Конвертация в AVIF
avifenc --min 20 --max 63 input.jpg output.avif
```

### 2. Создайте несколько версий

```bash
# Пример создания версий для баннера
convert banner.jpg -resize 480x150^ -gravity center -extent 480x150 banner-480w.jpg
convert banner.jpg -resize 768x180^ -gravity center -extent 768x180 banner-768w.jpg
convert banner.jpg -resize 992x280^ -gravity center -extent 992x280 banner-992w.jpg
convert banner.jpg -resize 1200x350^ -gravity center -extent 1200x350 banner-1200w.jpg
convert banner.jpg -resize 2400x700^ -gravity center -extent 2400x700 banner-2400w.jpg
```

### 3. Оптимизируйте качество

```bash
# JPEG оптимизация (качество 80-85%)
jpegoptim --max=85 --strip-all image.jpg

# PNG оптимизация
optipng -o7 image.png
pngquant --quality=65-80 image.png

# WebP оптимизация (качество 80%)
cwebp -q 80 input.jpg -o output.webp
```

## 📝 Обновленный HTML с WebP

### Пример для баннера с WebP и AVIF:

```html
<div class="dossier-banner">
  <picture>
    <!-- AVIF для современных браузеров -->
    <source 
      type="image/avif"
      media="(max-width: 480px)" 
      srcset="images/banner-480w.avif">
    <source 
      type="image/avif"
      media="(max-width: 768px)" 
      srcset="images/banner-768w.avif">
    <source 
      type="image/avif"
      media="(max-width: 992px)" 
      srcset="images/banner-992w.avif">
    <source 
      type="image/avif"
      srcset="images/banner-1200w.avif 1x, images/banner-2400w.avif 2x">
    
    <!-- WebP для большинства браузеров -->
    <source 
      type="image/webp"
      media="(max-width: 480px)" 
      srcset="images/banner-480w.webp">
    <source 
      type="image/webp"
      media="(max-width: 768px)" 
      srcset="images/banner-768w.webp">
    <source 
      type="image/webp"
      media="(max-width: 992px)" 
      srcset="images/banner-992w.webp">
    <source 
      type="image/webp"
      srcset="images/banner-1200w.webp 1x, images/banner-2400w.webp 2x">
    
    <!-- JPEG fallback для старых браузеров -->
    <source 
      media="(max-width: 480px)" 
      srcset="images/banner-480w.jpg">
    <source 
      media="(max-width: 768px)" 
      srcset="images/banner-768w.jpg">
    <source 
      media="(max-width: 992px)" 
      srcset="images/banner-992w.jpg">
    
    <img 
      src="images/banner-1200w.jpg" 
      srcset="images/banner-1200w.jpg 1x, images/banner-2400w.jpg 2x"
      alt="EXTREME Banner" 
      loading="lazy" 
      decoding="async"
      width="1200" 
      height="350">
  </picture>
</div>
```

### Пример для аватара:

```html
<div class="avatar-wrapper">
  <picture>
    <!-- AVIF -->
    <source 
      type="image/avif"
      media="(max-width: 480px)" 
      srcset="images/avatar-110w.avif">
    <source 
      type="image/avif"
      media="(max-width: 768px)" 
      srcset="images/avatar-130w.avif">
    <source 
      type="image/avif"
      srcset="images/avatar-180w.avif 1x, images/avatar-360w.avif 2x">
    
    <!-- WebP -->
    <source 
      type="image/webp"
      media="(max-width: 480px)" 
      srcset="images/avatar-110w.webp">
    <source 
      type="image/webp"
      media="(max-width: 768px)" 
      srcset="images/avatar-130w.webp">
    <source 
      type="image/webp"
      srcset="images/avatar-180w.webp 1x, images/avatar-360w.webp 2x">
    
    <!-- JPEG fallback -->
    <img 
      src="images/avatar-180w.jpg" 
      srcset="images/avatar-180w.jpg 1x, images/avatar-360w.jpg 2x"
      alt="EXTREME Avatar" 
      class="avatar" 
      loading="lazy" 
      decoding="async"
      width="180" 
      height="180">
  </picture>
</div>
```

## 🛠️ Автоматизация с помощью скриптов

### Node.js скрипт для автоматической оптимизации:

```javascript
// optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
  banner: [
    { width: 480, height: 150, suffix: '480w' },
    { width: 768, height: 180, suffix: '768w' },
    { width: 992, height: 280, suffix: '992w' },
    { width: 1200, height: 350, suffix: '1200w' },
    { width: 2400, height: 700, suffix: '2400w' }
  ],
  avatar: [
    { width: 110, height: 110, suffix: '110w' },
    { width: 130, height: 130, suffix: '130w' },
    { width: 160, height: 160, suffix: '160w' },
    { width: 180, height: 180, suffix: '180w' },
    { width: 360, height: 360, suffix: '360w' }
  ]
};

async function optimizeImage(inputPath, outputDir, sizes, type) {
  const filename = path.parse(inputPath).name;
  
  for (const size of sizes) {
    // WebP
    await sharp(inputPath)
      .resize(size.width, size.height, { fit: 'cover', position: 'center' })
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, `${filename}-${size.suffix}.webp`));
    
    // AVIF
    await sharp(inputPath)
      .resize(size.width, size.height, { fit: 'cover', position: 'center' })
      .avif({ quality: 65 })
      .toFile(path.join(outputDir, `${filename}-${size.suffix}.avif`));
    
    // JPEG fallback
    await sharp(inputPath)
      .resize(size.width, size.height, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85, progressive: true })
      .toFile(path.join(outputDir, `${filename}-${size.suffix}.jpg`));
    
    console.log(`✅ Создано: ${filename}-${size.suffix} (WebP, AVIF, JPEG)`);
  }
}

// Использование:
// node optimize-images.js banner.jpg images banner
// node optimize-images.js avatar.jpg images avatar
```

### Установка зависимостей:

```bash
npm install sharp
```

## 📊 Ожидаемая экономия трафика

| Устройство | Оригинал | После оптимизации | Экономия |
|-----------|----------|-------------------|----------|
| Mobile    | ~500KB   | ~50-80KB (WebP)   | 84-90%   |
| Tablet    | ~800KB   | ~100-150KB (WebP) | 81-87%   |
| Desktop   | ~1.2MB   | ~200-300KB (WebP) | 75-83%   |
| Desktop 2x| ~2.5MB   | ~400-600KB (WebP) | 76-84%   |

## ✅ Чек-лист оптимизации

- [x] Использовать `<picture>` элемент
- [x] Добавить `loading="lazy"`
- [x] Добавить `decoding="async"`
- [x] Указать `width` и `height`
- [ ] Конвертировать в WebP
- [ ] Конвертировать в AVIF
- [ ] Создать версии для разных размеров
- [ ] Создать версии для Retina (@2x)
- [ ] Настроить CDN с автоматической оптимизацией
- [ ] Добавить HTTP/2 Push для критичных изображений

## 🌐 CDN решения с автоматической оптимизацией

Для максимальной автоматизации рассмотрите:

1. **Cloudflare Images** - автоматическая оптимизация и адаптация
2. **imgix** - трансформация изображений на лету
3. **Cloudinary** - AI-оптимизация и автоматический формат
4. **ImageKit.io** - real-time оптимизация

### Пример использования Cloudinary:

```html
<img 
  src="https://res.cloudinary.com/demo/image/upload/w_480,h_150,c_fill,f_auto,q_auto/banner.jpg"
  srcset="
    https://res.cloudinary.com/demo/image/upload/w_480,h_150,c_fill,f_auto,q_auto/banner.jpg 480w,
    https://res.cloudinary.com/demo/image/upload/w_768,h_180,c_fill,f_auto,q_auto/banner.jpg 768w,
    https://res.cloudinary.com/demo/image/upload/w_1200,h_350,c_fill,f_auto,q_auto/banner.jpg 1200w"
  sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px"
  alt="EXTREME Banner"
  loading="lazy">
```

## 🎓 Дополнительные ресурсы

- [WebP Documentation](https://developers.google.com/speed/webp)
- [AVIF Documentation](https://avif.io/)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)

