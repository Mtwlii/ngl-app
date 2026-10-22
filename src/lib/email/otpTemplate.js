export function otpEmailTemplate({ name = "", otpCode, expiresInMinutes = 5 }) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your account</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background-color:#4f46e5;padding:24px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:22px;">Verify your account</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 24px;text-align:center;color:#333333;">
                <p style="margin:0 0 8px;font-size:16px;">Hi ${name || "there"},</p>
                <p style="margin:0 0 24px;font-size:15px;color:#555555;">
                  Use the code below to verify your account.
                </p>
                <div style="display:inline-block;background-color:#f0f0ff;border:1px dashed #4f46e5;border-radius:8px;padding:14px 28px;">
                  <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#4f46e5;">${otpCode}</span>
                </div>
                <p style="margin:24px 0 0;font-size:14px;color:#888888;">
                  This code expires in ${expiresInMinutes} minutes.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background-color:#fafafa;text-align:center;font-size:12px;color:#999999;">
                If you didn't request this, you can safely ignore this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}