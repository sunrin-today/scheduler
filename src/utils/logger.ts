import chalk from "chalk";
import process from "process";

type LogType = "info" | "error" | "warn";

export class Logger {
  private log(message: string, scope: LogType): string {
    switch (scope) {
      case "info":
        return `${chalk.green(`[App] ` + process.pid)} - ${new Date().toISOString()} ${chalk.green(message)}`;
      case "error":
        return `${chalk.red(`[App] ` + process.pid)} - ${new Date().toISOString()} ${chalk.red(message)}`;
      case "warn":
        return `${chalk.yellow(`[App] ` + process.pid)} - ${new Date().toISOString()} ${chalk.yellow(message)}`;
      default:
        return "error: unsupported log type";
    }
  }

  public info(message: string): void {
    console.log(this.log(message, "info"));
  }

  public error(message: string): void {
    console.error(this.log(message, "error"));
  }

  public warn(message: string): void {
    console.warn(this.log(message, "warn"));
  }
}
