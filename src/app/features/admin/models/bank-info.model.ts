export interface BankInfoResponse {
  id: string;
  bankName: string;
  accountHolder: string;
  iban: string;
  motive: string;
  note?: string;
}
