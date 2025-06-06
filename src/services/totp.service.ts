import speakeasy from "speakeasy";
import qrcode from "qrcode";

export async function generateTOTPSecret(username: string) {
  const secret = speakeasy.generateSecret({
    name: `TODO App (${username})`,
  });
  const otpauthUrl = secret.otpauth_url;
  if (!otpauthUrl) {
    throw new Error("Failed to generate otpauth URL.");
  }
  const qrCodeDataURL = await qrcode.toDataURL(otpauthUrl);
  return {
    ascii: secret.ascii,
    base32: secret.base32,
    otpauthUrl,
    qrCodeDataURL,
  };
}

export function verifyTOTPToken(secret: string, token: string) {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  });
}
