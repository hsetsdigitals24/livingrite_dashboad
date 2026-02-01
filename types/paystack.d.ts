
declare module '@paystack/inline-js' {
  export default class PaystackPop {
    newTransaction(options: {
      key: string;
      email: string;
      amount: number;
      currency: string;
      reference: string;
      metadata?: {
        bookingId: string | number;
        clientName: string;
        custom_fields?: {
          display_name: string;
          variable_name: string;
          value?: string | number;
        }[];
      };
      onSuccess: (transaction: { reference: string }) => void;
      onCancel: () => void;
    }): void;
  }
}