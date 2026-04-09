const imageCache = new Map<string, HTMLImageElement>();

const loadImage = (src: string): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn("图片加载失败:", src);
      resolve(null); // ← 失败返回 null，不返回占位图
    };
    img.src = src;
  });
};

export async function getImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) return imageCache.get(src)!;

  const img = await loadImage(src);

  if (img) {
    imageCache.set(src, img); // ← 只缓存成功的图片
    return img;
  }

  // 失败时生成占位图，但【不缓存】，下次导出会重新请求
  return createPlaceholder();
}

function createPlaceholder(): HTMLImageElement {
  const placeholder = document.createElement("canvas");
  placeholder.width = 100;
  placeholder.height = 100;
  const ctx = placeholder.getContext("2d")!;
  ctx.fillStyle = "#ccc";
  ctx.fillRect(0, 0, 100, 100);
  ctx.fillStyle = "#000";
  ctx.font = "12px sans-serif";
  ctx.fillText("No Img", 10, 50);

  const phImg = new Image();
  phImg.src = placeholder.toDataURL();
  return phImg;
}