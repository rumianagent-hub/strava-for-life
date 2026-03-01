import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { format, subDays } from "date-fns";

admin.initializeApp();
const db = admin.firestore();

function dateStr(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function todayInTimezone(tz: string): string {
  try {
    return new Date().toLocaleDateString("en-CA", { timeZone: tz });
  } catch {
    return format(new Date(), "yyyy-MM-dd");
  }
}

interface GoalSummary {
  title: string;
  checkedInDays: number;
  currentStreak: number;
  bestStreak: number;
}

// ─── Weekly Summary Email ──────────────────────────────────────────────────────
// Runs every Sunday at 9am UTC (5am Montreal time).
// Requires RESEND_API_KEY environment variable to actually send emails.
export const weeklySummaryEmail = onSchedule(
  { schedule: "0 9 * * 0", timeZone: "UTC" },
  async () => {
    const resendApiKey = process.env.RESEND_API_KEY || "";

    if (!resendApiKey) {
      logger.info("weeklySummaryEmail: RESEND_API_KEY not set — skipping.");
      return;
    }

    const usersSnap = await db
      .collection("users")
      .where("settings.weeklyEmailEnabled", "==", true)
      .get();

    if (usersSnap.empty) {
      logger.info("weeklySummaryEmail: No users with weekly email enabled.");
      return;
    }

    const now = new Date();
    const last7Days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      last7Days.push(dateStr(subDays(now, i)));
    }

    for (const userDoc of usersSnap.docs) {
      const userData = userDoc.data();
      const uid = userDoc.id;
      const email = userData.email as string;
      const displayName = (userData.displayName as string) || "there";
      const timezone = (userData.timezone as string) || "America/Montreal";
      const today = todayInTimezone(timezone);

      if (!email) continue;

      const goalsSnap = await db
        .collection("goals")
        .where("ownerUid", "==", uid)
        .where("status", "==", "active")
        .get();

      if (goalsSnap.empty) continue;

      const goalSummaries: GoalSummary[] = [];

      for (const goalDoc of goalsSnap.docs) {
        const goal = goalDoc.data();
        let checkedInDays = 0;

        for (const day of last7Days) {
          const checkinSnap = await goalDoc.ref
            .collection("checkins")
            .doc(day)
            .get();
          if (checkinSnap.exists && checkinSnap.data()?.done) {
            checkedInDays++;
          }
        }

        goalSummaries.push({
          title: goal.title as string,
          checkedInDays,
          currentStreak: (goal.currentStreak as number) || 0,
          bestStreak: (goal.bestStreak as number) || 0,
        });
      }

      const emailHtml = buildEmailHtml(displayName, goalSummaries, today);

      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Strava for Life <noreply@stravaforlife.app>",
            to: email,
            subject: "Your weekly habit summary 🔥",
            html: emailHtml,
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          logger.error(`Failed to send email to ${email}: ${err}`);
        } else {
          logger.info(`Weekly email sent to ${email}`);
        }
      } catch (err) {
        logger.error(`Error sending email to ${email}:`, err);
      }
    }
  }
);

function buildEmailHtml(
  name: string,
  goals: GoalSummary[],
  today: string
): string {
  const rows = goals
    .map(
      (g) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
        <strong style="color:#111827;">${g.title}</strong>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;text-align:center;">
        ${g.checkedInDays}/7 days
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;text-align:center;">
        🔥 ${g.currentStreak}
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;text-align:center;">
        🏆 ${g.bestStreak}
      </td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;background:#f9fafb;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
    <div style="background:#111827;padding:24px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:20px;">🔥 Strava for Life</h1>
      <p style="color:#9ca3af;margin:8px 0 0;font-size:14px;">Weekly Habit Summary</p>
    </div>
    <div style="padding:24px;">
      <p style="color:#111827;font-size:16px;">Hey ${name}! Here's your week in review (week of ${today}).</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="color:#6b7280;text-align:left;">
            <th style="padding-bottom:8px;">Goal</th>
            <th style="padding-bottom:8px;text-align:center;">Last 7 Days</th>
            <th style="padding-bottom:8px;text-align:center;">Streak</th>
            <th style="padding-bottom:8px;text-align:center;">Best</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="margin-top:24px;text-align:center;">
        <a href="https://strava-for-life-mvp.web.app/app"
          style="background:#111827;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
          View Dashboard
        </a>
      </div>
    </div>
    <div style="padding:16px;text-align:center;border-top:1px solid #f3f4f6;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">
        You're receiving this because you enabled weekly summaries.
        Your data is private and secure.
      </p>
    </div>
  </div>
</body>
</html>
`;
}
