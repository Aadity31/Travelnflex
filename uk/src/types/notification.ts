export type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "booking" | "reminder" | "update" | "promo";
};
