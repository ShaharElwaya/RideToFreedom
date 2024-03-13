import { createMeeting } from "@/DB/meeting";

export default async function handler(req, res) {
  try {
    console.log("Trying to create a meeting..");
    const test = await createMeeting(req.body);
    res.status(200).json(test);
  } catch (err) {
    res.status(500).json(err);
  }
}
