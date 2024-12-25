import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();



const TOKEN = "e4f11264d13a2250d8b7bb17652e4447";

export const client = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};
