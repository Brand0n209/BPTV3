export type User = {
  userId: string;
  role: "admin" | "advisor" | "technician" | "customer";
  firstName?: string;
};

export type Session = {
  user: User;
};

export type Submission = {
  [key: string]: string;
  "First Name": string;
  "Last Name": string;
  "Phone Number": string;
  "Email": string;
  "Referral": string;
  "Address": string;
  "City": string;
  "Home Stories": string;
  "Lighting Options": string;
  "Lighting Sides": string;
  "Pref Service Date (LIGHTING)": string;
  "Measure": string;
  "Lighting notes": string;
  "Solar Selected Services": string;
  "Pref Service Date (SOLAR)": string;
  "Solar Panels": string;
  "Solar notes": string;
  "Gutter Selected Service": string;
  "Pref Service Date (GUTTER)": string;
  "Gutter notes": string;
  "Stage": string;
  "Sub Date": string;
};
