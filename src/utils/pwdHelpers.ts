import { compare, hash } from "bcrypt";

const protectPwd = async (pwd: string): Promise<string> => {
  const saltRounds = 10;
  const protectedPwd = await hash(pwd, saltRounds);
  return protectedPwd;
};

const comparePwd = async (
  rawPwd: string,
  protectedPwd: string,
): Promise<boolean> => {
  return await compare(rawPwd, protectedPwd);
};

export { protectPwd, comparePwd };
