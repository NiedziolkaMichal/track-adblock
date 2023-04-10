import { readResource } from "../util/file";

export async function getResetPasswordTemplate(resetUrl: string) {
  const template = await readResource("email", "resetPassword.html");
  return template.replaceAll("%ABSOLUTE_URL%", process.env.NEXTAUTH_URL || "").replaceAll("%RESET_URL%", resetUrl);
}
