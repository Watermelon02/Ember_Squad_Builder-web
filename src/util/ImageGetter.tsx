const imageCache = new Map<string, HTMLImageElement>();

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn("图片加载失败:", src);
      // 使用 canvas 生成占位图
      const placeholder = document.createElement("canvas");
      placeholder.width = 100;
      placeholder.height = 100;
      const ctx = placeholder.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ccc";
        ctx.fillRect(0, 0, placeholder.width, placeholder.height);
        ctx.fillStyle = "#000";
        ctx.font = "12px sans-serif";
        ctx.fillText("No Img", 10, 50);
      }
      const phImg = new Image();
      phImg.src = placeholder.toDataURL();
      resolve(phImg); // 直接返回占位图
    };
    img.src = src;
  });
};

export async function getImage(src: string) {
  if (imageCache.has(src)) return imageCache.get(src)!;

  const img = await loadImage(src); // 如果失败会返回占位图
  imageCache.set(src, img);
  return img;
}