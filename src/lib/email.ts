import { Resend } from "resend";
import { env } from "./env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping email send");
    return null;
  }

  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    replyTo,
  });

  if (error) throw new Error(error.message);
  return data;
}
