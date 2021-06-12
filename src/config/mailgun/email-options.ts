export interface EmailOptions {
    from: string;
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    template?: string;
    'user-variables'?: any;
    'h:X-Mailgun-Variables'?: any;
    'X-Mailgun-Variables'?: any;
    attachment?;
    'recipient-variables'?: {
      [alumno: string]: any,
    };
}