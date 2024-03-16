// google/index.js

import { createMeeting } from "@/DB/meeting";

export default async function handler(req, res) {
  try {
    console.log("Trying to create a meeting..");
    const meeting = await createMeeting(req.body);
    res.status(200).json(meeting);
  } catch (err) {
    res.status(500).json(err);
  }
}
