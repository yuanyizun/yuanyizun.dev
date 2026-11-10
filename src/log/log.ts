type LogContext = Record<string, string | number | boolean | null>;

function write(
  level: "error" | "warn" | "info",
  event: string,
  context?: LogContext,
) {
  const payload = context ? { event, ...context } : { event };
  console[level](JSON.stringify(payload));
}

export const log = {
  error(event: string, context?: LogContext) {
    write("error", event, context);
  },
  warn(event: string, context?: LogContext) {
    write("warn", event, context);
  },
  info(event: string, context?: LogContext) {
    write("info", event, context);
  },
};
