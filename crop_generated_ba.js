import { Jimp } from 'jimp';

async function processGeneratedImages() {
  const images = [
    {
      name: 'whitening',
      path: 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\1ffccc7f-0f56-4e29-82cd-433579049e29\\whitening_split_1779542299676.png'
    },
    {
      name: 'implants',
      path: 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\1ffccc7f-0f56-4e29-82cd-433579049e29\\implants_split_1779542385289.png'
    },
    {
      name: 'ortho',
      path: 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\1ffccc7f-0f56-4e29-82cd-433579049e29\\ortho_split_1779542478534.png'
    }
  ];

  const cropY = 128;
  const cropH = 768;
  const cropW = 1024;
  const halfW = 512;

  // Inpaint a thin vertical line of width ~8px at x = 512
  function inpaintLine(image) {
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const cx = 512;
    const inpaintHalfW = 6; // cover 12px around center to be 100% safe
    
    for (let row = 0; row < height; row++) {
      const leftX = cx - inpaintHalfW;
      const rightX = cx + inpaintHalfW;
      
      const colorLeftVal = image.getPixelColor(Math.max(0, leftX - 2), row);
      const colorRightVal = image.getPixelColor(Math.min(width - 1, rightX + 2), row);
      
      const colorLeft = {
        r: (colorLeftVal >> 24) & 0xFF,
        g: (colorLeftVal >> 16) & 0xFF,
        b: (colorLeftVal >> 8) & 0xFF,
        a: colorLeftVal & 0xFF
      };
      const colorRight = {
        r: (colorRightVal >> 24) & 0xFF,
        g: (colorRightVal >> 16) & 0xFF,
        b: (colorRightVal >> 8) & 0xFF,
        a: colorRightVal & 0xFF
      };
      
      for (let col = leftX; col <= rightX; col++) {
        const t = (col - leftX) / (rightX - leftX || 1);
        const r = Math.round(colorLeft.r * (1 - t) + colorRight.r * t);
        const g = Math.round(colorLeft.g * (1 - t) + colorRight.g * t);
        const b = Math.round(colorLeft.b * (1 - t) + colorRight.b * t);
        const a = Math.round(colorLeft.a * (1 - t) + colorRight.a * t);
        
        const newColor = ((r << 24) | (g << 16) | (b << 8) | a) >>> 0;
        image.setPixelColor(newColor, col, row);
      }
    }
  }

  // Remove any text/badges at the bottom by duplicating pixels from y=720 downwards
  function removeBottomText(image) {
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    for (let xCoord = 0; xCoord < width; xCoord++) {
      const sourceColor = image.getPixelColor(xCoord, 715);
      for (let yCoord = 716; yCoord < height; yCoord++) {
        image.setPixelColor(sourceColor, xCoord, yCoord);
      }
    }
  }

  for (const imgConfig of images) {
    const srcImage = await Jimp.read(imgConfig.path);
    
    // Crop the core 1024x768 region
    const cropped = srcImage.clone().crop({ x: 0, y: cropY, w: cropW, h: cropH });
    
    // 1. Crop left half (Before)
    const leftHalf = cropped.clone().crop({ x: 0, y: 0, w: halfW, h: cropH });
    // 2. Crop right half (After)
    const rightHalf = cropped.clone().crop({ x: halfW, y: 0, w: halfW, h: cropH });
    
    // Create Before image (Left + Mirrored Left)
    const beforeImg = new Jimp({ width: cropW, height: cropH });
    beforeImg.blit({ src: leftHalf, x: 0, y: 0 });
    const leftHalfMirrored = leftHalf.clone().flip({ horizontal: true, vertical: false });
    beforeImg.blit({ src: leftHalfMirrored, x: halfW, y: 0 });
    inpaintLine(beforeImg);
    removeBottomText(beforeImg);
    // Resize down to 400x300 for web performance
    beforeImg.resize({ w: 400, h: 300 });
    await beforeImg.write(`public/before_${imgConfig.name}.png`);
    
    // Create After image (Mirrored Right + Right)
    const afterImg = new Jimp({ width: cropW, height: cropH });
    const rightHalfMirrored = rightHalf.clone().flip({ horizontal: true, vertical: false });
    afterImg.blit({ src: rightHalfMirrored, x: 0, y: 0 });
    afterImg.blit({ src: rightHalf, x: halfW, y: 0 });
    inpaintLine(afterImg);
    removeBottomText(afterImg);
    // Resize down to 400x300 for web performance
    afterImg.resize({ w: 400, h: 300 });
    await afterImg.write(`public/after_${imgConfig.name}.png`);
    
    console.log(`Successfully generated and cleaned before_${imgConfig.name}.png and after_${imgConfig.name}.png`);
  }
}

processGeneratedImages().catch(console.error);
