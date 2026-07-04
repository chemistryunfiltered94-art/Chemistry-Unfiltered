"use client";

import { useMemo } from "react";

/** activityLog-এর সর্বোচ্চ count অনুযায়ী ৫টা ধাপে ভাগ করে রঙ ঠিক করে */
function intensityClass(count: number, max: number): string {
  if (count === 0) return "bg-white/5";
  const ratio = max > 0 ? count / max : 0;
  if (ratio > 0.75) return "bg-violet-400";
  if (ratio > 0.5)  return "bg-violet-500";
  if (ratio > 0.25) return "bg-violet-600/80";
  return "bg-violet-700/60";
}

const WEEKDAY_LABELS = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];
const MONTH_LABELS_BN = [
  "জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে",
];

export default function ActivityHeatmap({
  activityLog,
  weeks = 52,
}: {
  activityLog: Record<string, number>;
  weeks?: number;
}) {
  const { columns, monthMarkers, activeDays, totalCount, maxCount } = useMemo(() => {
    // আজকের তারিখ থেকে পিছনে গিয়ে (weeks * 7) দিনের একটা ফ্ল্যাট লিস্ট বানাই,
    // তারপর সপ্তাহ-ভিত্তিক কলামে ভাগ করি (রবিবার = সপ্তাহের প্রথম দিন)।
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // সবচেয়ে সাম্প্রতিক রবিবার পর্যন্ত পিছিয়ে গিয়ে গ্রিড শুরু করি, যাতে
    // প্রতিটা কলাম ঠিক এক সপ্তাহ (রবি-শনি) represent করে।
    const endOfGrid = new Date(today);
    endOfGrid.setDate(endOfGrid.getDate() + (6 - today.getDay())); // চলতি সপ্তাহের শনিবার
    const totalDays = weeks * 7;
    const startOfGrid = new Date(endOfGrid);
    startOfGrid.setDate(startOfGrid.getDate() - totalDays + 1);

    const days: { date: string; count: number; inFuture: boolean }[] = [];
    let maxCount = 0;
    let active = 0;
    let total = 0;

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startOfGrid);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const count = activityLog[dateStr] || 0;
      const inFuture = d > today;
      if (count > 0) { active += 1; total += count; }
      if (count > maxCount) maxCount = count;
      days.push({ date: dateStr, count, inFuture });
    }

    // ৭টা করে সারিতে ভেঙে কলাম (সপ্তাহ) বানাই
    const cols: { date: string; count: number; inFuture: boolean }[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      cols.push(days.slice(i, i + 7));
    }

    // মাস-লেবেল: যে কলামে মাসের ১ তারিখ পড়েছে, সেখানে লেবেল বসাই
    const markers: { colIndex: number; label: string }[] = [];
    let lastMonth = -1;
    cols.forEach((col, idx) => {
      const firstOfMonthDay = col.find((d) => new Date(d.date).getDate() <= 7);
      if (firstOfMonthDay) {
        const m = new Date(firstOfMonthDay.date).getMonth();
        if (m !== lastMonth) {
          markers.push({ colIndex: idx, label: MONTH_LABELS_BN[m] });
          lastMonth = m;
        }
      }
    });

    return { columns: cols, monthMarkers: markers, activeDays: active, totalCount: total, maxCount };
  }, [activityLog, weeks]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-3 text-xs text-slate-400">
        <span>গত {weeks} সপ্তাহে <span className="text-white font-semibold">{activeDays.toLocaleString("bn-BD")}</span> দিন সক্রিয়</span>
        <span>মোট <span className="text-white font-semibold">{totalCount.toLocaleString("bn-BD")}</span> কাজ</span>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <div className="inline-block min-w-full">
          {/* মাস-লেবেল সারি */}
          <div className="flex gap-1 mb-1 pl-7">
            {columns.map((_, idx) => {
              const marker = monthMarkers.find((m) => m.colIndex === idx);
              return (
                <div key={idx} className="w-3 flex-shrink-0 text-[9px] text-slate-500">
                  {marker ? marker.label : ""}
                </div>
              );
            })}
          </div>

          <div className="flex gap-1">
            {/* বার-লেবেল কলাম (শুধু রবি/বুধ/শুক্র দেখাই, ঘিঞ্জি এড়াতে) */}
            <div className="flex flex-col gap-1 mr-1 flex-shrink-0 w-6">
              {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                <div key={d} className="h-3 text-[9px] text-slate-500 flex items-center">
                  {d % 2 === 1 ? WEEKDAY_LABELS[d].slice(0, 2) : ""}
                </div>
              ))}
            </div>

            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-1 flex-shrink-0">
                {col.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.count.toLocaleString("bn-BD")} কাজ`}
                    className={`w-3 h-3 rounded-sm ${
                      day.inFuture ? "bg-transparent" : intensityClass(day.count, maxCount)
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3 justify-end text-[10px] text-slate-500">
        <span>কম</span>
        <span className="w-3 h-3 rounded-sm bg-white/5" />
        <span className="w-3 h-3 rounded-sm bg-violet-700/60" />
        <span className="w-3 h-3 rounded-sm bg-violet-600/80" />
        <span className="w-3 h-3 rounded-sm bg-violet-500" />
        <span className="w-3 h-3 rounded-sm bg-violet-400" />
        <span>বেশি</span>
      </div>
    </div>
  );
}
