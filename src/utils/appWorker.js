import dayjs from "dayjs";

class AppWorker {
  getDateSuperScript(date) {
    date = String(date);
    switch (date) {
      case date.endsWith("1"):
        return date + "st";
      case date.endsWith("2"):
        return date + "nd";
      case date.endsWith("3"):
        return date + "rd";
      default:
        return date + "th";
    }
  }

  getDiffPercentage(current, previous) {
    return Number(((current - previous) / previous) * 100).toFixed(2);
  }

  getPercentage(part, total) {
    return Number((part / total) * 100).toFixed(2);
  }

  getTimeAgo(previousDate, currentDate, exactTime = true) {
    const now = dayjs(currentDate || new Date());
    const past = dayjs(previousDate);
    const diff = now - past; // Difference in milliseconds

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30; // Approximate a month as 30 days
    const year = day * 365; // Approximate a year as 365 days

    if (diff < minute) {
      return exactTime
        ? diff < second
          ? "just now"
          : "< 1 minute ago"
        : "today";
    }
    if (diff < hour) {
      const minutes = Math.floor(diff / minute);
      return exactTime
        ? minutes === 1
          ? "1 minute ago"
          : `${minutes} minutes ago`
        : "today";
    }
    if (diff < day) {
      const hours = Math.floor(diff / hour);
      return exactTime
        ? hours === 1
          ? "1 hour ago"
          : `${hours} hours ago`
        : "today";
    }
    const yesterday = dayjs(currentDate).set("date", now.date() - 1);
    if (past.isSame(yesterday, "day")) {
      return "yesterday";
    }
    if (diff < week) {
      const days = Math.floor(diff / day);
      return days === 1 ? "1 day ago" : `${days} days ago`;
    }
    if (diff < month) {
      const weeks = Math.floor(diff / week);
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }
    if (diff < year) {
      const months = Math.floor(diff / month);
      return months === 1 ? "1 month ago" : `${months} months ago`;
    }

    const years = Math.floor(diff / year);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }

  getDashboardData = async (statistics) => {
    return new Promise((resolve, reject) => {
      try {
        const date = dayjs("2024-08-15");
        const today = date.format("YYYY-MM-DD");
        const week = `${dayjs(date)
          .set("date", date.date() - date.day())
          .format("YYYY-MM-DD")}/${dayjs(date)
          .set("date", date.date() - date.day() + 6)
          .format("YYYY-MM-DD")}`;
        const month = date.month();
        const year = date.year();

        let data = {};

        if (statistics.all) {
          const { all, ...rest } = statistics;
          let pie = [];
          let line = {
            lables: [],
            data: [],
          };

          Object.keys(all.expenses || {}).forEach((expense) => {
            pie.push({
              id: pie.length,
              label: `${
                expense.charAt(0).toUpperCase() + expense.substring(1)
              } ${this.getPercentage(all.expenses[expense].total, all.total)}%`,
              value: all.expenses[expense].total,
            });
          });

          Object.keys(rest).forEach((year) => {
            line.lables.push(year);
            line.data.push(rest[year].total);
          });

          data = { "all time": { pie, line, total: all.total } };
        } else {
          resolve(data);
        }

        if (statistics[year]) {
          const { total, entries, expenses, ...rest } = statistics[year];
          let pie = [];
          let line = {
            lables: [],
            data: [],
          };

          Object.keys(statistics[year].expenses).forEach((expense) => {
            pie.push({
              id: pie.length,
              label: `${
                expense.charAt(0).toUpperCase() + expense.substring(1)
              } ${this.getPercentage(
                statistics[year].expenses[expense].total,
                statistics[year].total
              )}%`,
              value: statistics[year].expenses[expense].total,
            });
          });

          Object.keys(rest).forEach((month) => {
            line.lables.push(dayjs(date).set("month", month).format("MMM"));
            line.data.push(statistics[year][month].total);
          });

          const previousYear = year - 1;
          data = {
            ...data,
            "this year": {
              pie,
              line,
              total: statistics[year].total,
              stat: statistics[previousYear]
                ? {
                    percent: this.getDiffPercentage(
                      statistics[year].total,
                      statistics[previousYear].total
                    ),
                    title: "Last Year",
                  }
                : undefined,
            },
          };
        } else {
          resolve(data);
        }

        if (statistics[year][month]) {
          const { total, entries, expenses, ...rest } = statistics[year][month];
          let pie = [];
          let line = {
            lables: [],
            data: [],
          };

          Object.keys(statistics[year][month].expenses).forEach((expense) => {
            pie.push({
              id: pie.length,
              label: `${
                expense.charAt(0).toUpperCase() + expense.substring(1)
              } ${this.getPercentage(
                statistics[year][month].expenses[expense].total,
                statistics[year][month].total
              )}%`,
              value: statistics[year][month].expenses[expense].total,
            });
          });

          Object.keys(rest).forEach((week) => {
            let [weekStart, weekEnd] = week.split("/");
            weekStart = dayjs(weekStart);
            weekEnd = dayjs(weekEnd);
            line.lables.push(
              `${
                weekStart.format("MMM") +
                " " +
                this.getDateSuperScript(weekStart.date())
              } - ${
                weekEnd.format("MMM") +
                " " +
                this.getDateSuperScript(weekEnd.date())
              }`
            );
            line.data.push(statistics[year][month][week].total);
          });

          const previousMonth = month - 1;

          data = {
            ...data,
            "this month": {
              pie,
              line,
              total: statistics[year][month].total,
              stat: statistics[year][previousMonth]
                ? {
                    percent: this.getDiffPercentage(
                      statistics[year][month].total,
                      statistics[year][previousMonth].total
                    ),
                    title: "Last Month",
                  }
                : undefined,
            },
          };
        } else {
          resolve(data);
        }

        if (statistics[year][month][week]) {
          const { total, entries, expenses, ...rest } =
            statistics[year][month][week];
          console.log(rest);
          let pie = [];
          let line = {
            lables: [],
            data: [],
          };

          Object.keys(statistics[year][month][week].expenses).forEach(
            (expense) => {
              pie.push({
                id: pie.length,
                label: `${
                  expense.charAt(0).toUpperCase() + expense.substring(1)
                } ${this.getPercentage(
                  statistics[year][month][week].expenses[expense].total,
                  statistics[year][month][week].total
                )}%`,
                value: statistics[year][month][week].expenses[expense].total,
              });
            }
          );

          Object.keys(rest).forEach((day) => {
            line.lables.push(this.getTimeAgo(day, today, false, true));
            line.data.push(statistics[year][month][week][day].total);
          });

          let [weekStart, weekEnd] = week.split("/");
          weekStart = dayjs(weekStart);
          weekEnd = dayjs(weekEnd);

          const previousWeek = `${weekStart
            .set("date", weekStart.date() - 7)
            .format("YYYY-MM-DD")}/${weekEnd
            .set("date", weekEnd.date() - 7)
            .format("YYYY-MM-DD")}`;

          console.log(previousWeek, week);
          data = {
            ...data,
            "this week": {
              pie,
              line,
              total: statistics[year][month][week].total,
              stat: statistics[year][month][previousWeek]
                ? {
                    percent: this.getDiffPercentage(
                      statistics[year][month][week].total,
                      statistics[year][month][previousWeek].total
                    ),
                    title: "Last Week",
                  }
                : undefined,
            },
          };
        } else {
          resolve(data);
        }

        if (statistics[year][month][week][today]) {
          let pie = [];
          let line = data["this week"].line;

          Object.keys(statistics[year][month][week][today].expenses).forEach(
            (expense) => {
              pie.push({
                id: pie.length,
                label: `${
                  expense.charAt(0).toUpperCase() + expense.substring(1)
                } ${this.getPercentage(
                  statistics[year][month][week][today].expenses[expense].total,
                  statistics[year][month][week][today].total
                )}%`,
                value:
                  statistics[year][month][week][today].expenses[expense].total,
              });
            }
          );

          const yesterday = dayjs(today)
            .set("date", date.date() - 1)
            .format("YYYY-MM-DD");

          data = {
            ...data,
            today: {
              pie,
              line,
              total: statistics[year][month][week][today].total,
              stat: statistics[year][month][week][yesterday]
                ? {
                    percent: this.getDiffPercentage(
                      statistics[year][month][week][today].total,
                      statistics[year][month][week][yesterday].total
                    ),
                    title: "Yesterday",
                  }
                : undefined,
            },
          };
        }

        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  };
}
export default AppWorker;
