import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

export const IMAGE_MAX_WIDTH = 1600;
export const THUMB_WIDTH = 480;

export interface ProcessedImage {
  path: string;
  thumbPath: string;
  width: number;
  height: number;
}

/** 转为 webp 大图与缩略图，写入 <uploadDir>/works/，返回公开路径 */
export async function processImage(input: Buffer, uploadDir: string, key: string): Promise<ProcessedImage> {
  const dir = join(uploadDir, "works");
  await mkdir(dir, { recursive: true });
  const base = sharp(input, { failOn: "none" }).rotate();
  const large = await base
    .clone()
    .resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });
  const thumb = await base
    .clone()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer();
  await writeFile(join(dir, `${key}.webp`), large.data);
  await writeFile(join(dir, `${key}-thumb.webp`), thumb);
  return {
    path: `/uploads/works/${key}.webp`,
    thumbPath: `/uploads/works/${key}-thumb.webp`,
    width: large.info.width,
    height: large.info.height
  };
}
