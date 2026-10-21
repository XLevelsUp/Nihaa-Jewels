// Finds whichever file has been dropped into a page's image folder for a slot, so swapping a placeholder for a photograph needs no code change.

import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

import { HOME_SLOTS, type HomeSlotKey, type ImageSlotSpec, type ResolvedSlot } from '@/constants/homepageImages';
import { ABOUT_SLOTS, type AboutSlotKey } from '@/constants/aboutImages';

const EXTENSIONS = ['webp', 'avif', 'jpg', 'jpeg', 'png', 'webm', 'mp4'];

function resolve(spec: ImageSlotSpec, folder: string): ResolvedSlot {
  const dir = path.join(process.cwd(), 'public', 'images', folder);
  const ext = EXTENSIONS.find((e) => fs.existsSync(path.join(dir, `${spec.file}.${e}`)));
  return { ...spec, src: ext ? `/images/${folder}/${spec.file}.${ext}` : null };
}

export function homeSlot(key: HomeSlotKey): ResolvedSlot {
  return resolve(HOME_SLOTS[key], 'home');
}

export function aboutSlot(key: AboutSlotKey): ResolvedSlot {
  return resolve(ABOUT_SLOTS[key], 'about');
}
