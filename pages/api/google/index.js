import { createMeeting } from "@/DB/meeting";

export default async function handler(req, res) {
    const test = await createMeeting(req.body);
    res.status(200).json(test)
    console.log("I am roni")
}