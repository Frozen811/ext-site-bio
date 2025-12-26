/**
 * Скрипт автоматической оптимизации изображений
 * Создает WebP, AVIF и оптимизированные JPEG версии в нескольких размерах
 * 
 * Установка зависимостей:
 * npm install sharp
 * 
 * Использование:
 * node optimize-images.js banner banner.jpg
 * node optimize-images.js avatar avatar.jpg
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Конфигурация размеров
const SIZES = {
  banner: [
    { width: 480, height: 150, suffix: '480w', desc: 'Mobile Small' },
    { width: 768, height: 180, suffix: '768w', desc: 'Mobile' },
    { width: 992, height: 280, suffix: '992w', desc: 'Tablet' },
    { width: 1200, height: 350, suffix: '1200w', desc: 'Desktop' },
    { width: 2400, height: 700, suffix: '2400w', desc: 'Desktop 2x' }
  ],
  avatar: [
    { width: 110, height: 110, suffix: '110w', desc: 'Mobile Small' },
    { width: 130, height: 130, suffix: '130w', desc: 'Mobile' },
    { width: 160, height: 160, suffix: '160w', desc: 'Tablet' },
    { width: 180, height: 180, suffix: '180w', desc: 'Desktop' },
    { width: 360, height: 360, suffix: '360w', desc: 'Desktop 2x' }
  ]
};

// Настройки качества
const QUALITY = {
  jpeg: 85,
  webp: 80,
  avif: 65
};

/**
 * Оптимизирует одно изображение в несколько форматов и размеров
 */
async function optimizeImage(inputPath, outputDir, sizes, type) {
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Файл не найден: ${inputPath}`);
    return;
  }

  // Создаем директорию если не существует
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = path.parse(inputPath).name;
  const startTime = Date.now();
  
  console.log(`\n🖼️  Обработка ${type}: ${filename}`);
  console.log('━'.repeat(60));

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const size of sizes) {
    console.log(`\n📐 ${size.desc} (${size.width}×${size.height}):`);

    try {
      // Получаем размер оригинала (только для первого размера)
      if (sizes.indexOf(size) === 0) {
        const originalStats = fs.statSync(inputPath);
        totalOriginalSize = originalStats.size;
      }

      // WebP
      const webpPath = path.join(outputDir, `${filename}-${size.suffix}.webp`);
      await sharp(inputPath)
        .resize(size.width, size.height, { fit: 'cover', position: 'center' })
        .webp({ quality: QUALITY.webp, effort: 6 })
        .toFile(webpPath);
      const webpStats = fs.statSync(webpPath);
      console.log(`  ✅ WebP: ${(webpStats.size / 1024).toFixed(1)} KB`);
      totalOptimizedSize += webpStats.size;

      // AVIF
      const avifPath = path.join(outputDir, `${filename}-${size.suffix}.avif`);
      await sharp(inputPath)
        .resize(size.width, size.height, { fit: 'cover', position: 'center' })
        .avif({ quality: QUALITY.avif, effort: 6 })
        .toFile(avifPath);
      const avifStats = fs.statSync(avifPath);
      console.log(`  ✅ AVIF: ${(avifStats.size / 1024).toFixed(1)} KB`);
      totalOptimizedSize += avifStats.size;

      // JPEG
      const jpegPath = path.join(outputDir, `${filename}-${size.suffix}.jpg`);
      await sharp(inputPath)
        .resize(size.width, size.height, { fit: 'cover', position: 'center' })
        .jpeg({ quality: QUALITY.jpeg, progressive: true, mozjpeg: true })
        .toFile(jpegPath);
      const jpegStats = fs.statSync(jpegPath);
      console.log(`  ✅ JPEG: ${(jpegStats.size / 1024).toFixed(1)} KB`);
      totalOptimizedSize += jpegStats.size;

    } catch (error) {
      console.error(`  ❌ Ошибка: ${error.message}`);
    }
  }

  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
  const savings = ((1 - totalOptimizedSize / (totalOriginalSize * sizes.length)) * 100).toFixed(1);

  console.log('\n━'.repeat(60));
  console.log(`✨ Готово за ${elapsedTime}s`);
  console.log(`💾 Оригинал: ${(totalOriginalSize / 1024).toFixed(1)} KB × ${sizes.length} = ${(totalOriginalSize * sizes.length / 1024).toFixed(1)} KB`);
  console.log(`💾 Оптимизировано: ${(totalOptimizedSize / 1024).toFixed(1)} KB`);
  console.log(`📊 Экономия: ${savings}%`);
  console.log('━'.repeat(60));
}

/**
 * Генерирует HTML код для использования оптимизированных изображений
 */
function generateHTML(type, filename, outputDir) {
  const sizes = SIZES[type];
  const relativePath = path.relative(process.cwd(), outputDir);
  
  console.log('\n📝 HTML код для использования:\n');
  console.log('<picture>');
  
  // AVIF sources
  console.log('  <!-- AVIF (лучшее сжатие) -->');
  sizes.slice(0, -1).forEach(size => {
    const breakpoint = size.width;
    console.log(`  <source type="image/avif" media="(max-width: ${breakpoint}px)" srcset="${relativePath}/${filename}-${size.suffix}.avif">`);
  });
  const desktopSize = sizes[sizes.length - 2];
  const retinaSize = sizes[sizes.length - 1];
  console.log(`  <source type="image/avif" srcset="${relativePath}/${filename}-${desktopSize.suffix}.avif 1x, ${relativePath}/${filename}-${retinaSize.suffix}.avif 2x">\n`);
  
  // WebP sources
  console.log('  <!-- WebP (хорошее сжатие) -->');
  sizes.slice(0, -1).forEach(size => {
    const breakpoint = size.width;
    console.log(`  <source type="image/webp" media="(max-width: ${breakpoint}px)" srcset="${relativePath}/${filename}-${size.suffix}.webp">`);
  });
  console.log(`  <source type="image/webp" srcset="${relativePath}/${filename}-${desktopSize.suffix}.webp 1x, ${relativePath}/${filename}-${retinaSize.suffix}.webp 2x">\n`);
  
  // JPEG fallback
  console.log('  <!-- JPEG (fallback) -->');
  console.log(`  <img`);
  console.log(`    src="${relativePath}/${filename}-${desktopSize.suffix}.jpg"`);
  console.log(`    srcset="${relativePath}/${filename}-${desktopSize.suffix}.jpg 1x, ${relativePath}/${filename}-${retinaSize.suffix}.jpg 2x"`);
  console.log(`    alt="${type === 'banner' ? 'EXTREME Banner' : 'EXTREME Avatar'}"`);
  console.log(`    ${type === 'avatar' ? 'class="avatar"' : ''}`);
  console.log(`    loading="lazy"`);
  console.log(`    decoding="async"`);
  console.log(`    width="${desktopSize.width}"`);
  console.log(`    height="${desktopSize.height}">`);
  console.log('</picture>\n');
}

// Главная функция
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('📚 Использование: node optimize-images.js <type> <input_file> [output_dir]');
    console.log('\nТипы:');
    console.log('  banner - Для баннера (1200×350 и т.д.)');
    console.log('  avatar - Для аватара (180×180 и т.д.)');
    console.log('\nПримеры:');
    console.log('  node optimize-images.js banner banner.jpg');
    console.log('  node optimize-images.js avatar avatar.jpg images/');
    process.exit(1);
  }

  const [type, inputPath, outputDir = 'images'] = args;

  if (!SIZES[type]) {
    console.error(`❌ Неизвестный тип: ${type}. Используйте: banner или avatar`);
    process.exit(1);
  }

  try {
    // Проверяем наличие sharp
    require.resolve('sharp');
  } catch (e) {
    console.error('❌ Модуль sharp не установлен!');
    console.error('Установите его командой: npm install sharp');
    process.exit(1);
  }

  await optimizeImage(inputPath, outputDir, SIZES[type], type);
  
  const filename = path.parse(inputPath).name;
  generateHTML(type, filename, outputDir);
}

// Запускаем
main().catch(error => {
  console.error('\n❌ Критическая ошибка:', error);
  process.exit(1);
});

