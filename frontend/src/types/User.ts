export interface User {
  id: string;
  email: string;
  name: string;
  role: "consumer" | "store" | "delivery";
}
