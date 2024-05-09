import prisma from "~/lib/db";
import bcrypt from "bcrypt";
import fs from "fs/promises";

type SaveSettingsReq = {
  username?: string;
  password?: string;
  nickname?: string;
  avatarUrl?: string;
  slogan?: string;
  coverUrl?: string;
  enableS3: boolean;
  domain: string;
  bucket: string;
  region: string;
  accessKey: string;
  secretKey: string;
  endpoint: string;
  thumbnailSuffix: string;
  title: string;
  favicon: string;
  css: string;
  js: string;
  beianNo: string;
  config: string;
};

export default defineEventHandler(async (event) => {
  const { username, password, nickname, avatarUrl, slogan, coverUrl,config, ...rest } =
    (await readBody(event)) as SaveSettingsReq;

  const updated = {} as SaveSettingsReq;
  if (password) updated.password = bcrypt.hashSync(password, 10);
  updated.username = username || "admin";
  updated.nickname = nickname || "Jerry";
  updated.avatarUrl =
    avatarUrl ||
    "https://images.kingwrcy.cn/memo/20240386211829TtcOUOMaXyITlTkxhSjp";
  updated.slogan = slogan || "星垂平野阔，月涌大江流。";
  updated.coverUrl =
    coverUrl ||
    "https://images.unsplash.com/photo-1711299253442-de19d4dacaae?q=80&w=3500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  await prisma.user.update({
    where: {
      id: 1,
    },
    data: { ...updated, ...rest },
  });

  await fs.writeFile(`${process.env.CONFIG_FILE}`, config);

  return {
    success: true,
  };
});
