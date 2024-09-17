import winston from "winston";

export class MyLogger {
  private logger: winston.Logger;

  public constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL ?? "info",
      transports: [new winston.transports.Console()],
    });
  }

  /**
   * 開発環境でのみ出力したい内容を出力する
   */
  public debug(message: string, extra: object = {}) {
    this.logger.debug(message, { extra: extra });
  }

  /**
   * エラーではないが、調査の際に必要となるようなログを出力する
   * 本番環境でも出力される
   */
  public info(message: string, extra: object = {}) {
    this.logger.info(message, { extra: extra });
  }

  /**
   * アラートを鳴らすほどではないが、検知しておきたいエラーなどを出力する
   */
  public warn(message: string, extra: object = {}) {
    this.logger.warn(message, { extra: extra });
  }

  /**
   * アラートを鳴らすべきエラーログを出力する
   */
  public error(message: string, extra: object = {}) {
    this.logger.error(message, { extra: extra });
  }
}

