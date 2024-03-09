export interface ISendMailOptions {
  to: string;
  from: string;
  subject: string;
  template: string;
  context?: { [x: string]: string };
}

export interface IMailerProvider {
  sendMail(sendMailOptions: ISendMailOptions): Promise<void>;
}
