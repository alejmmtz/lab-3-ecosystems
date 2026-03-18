export interface Store {
  id: number;
  name: string;
  info?: string | null;
  address?: string | null;
  status: "open" | "closed";
  ownerId: string;
}
