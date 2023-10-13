import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { uploadFileToFirebase } from "@/lib/firebase";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import formidable from 'formidable';
import { IncomingMessage } from "http";


export async function POST(req: IncomingMessage,res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void | PromiseLike<void>; new(): any; }; }; }) {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing the form.' });
    }

    const noteId = fields;
    const file = files.file;

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const notes = await db
      .select()
      .from($notes)
      .where(eq($notes.id, parseInt(noteId)));
      console.log ("IM HERE 3")

    // if (!notes[0].imageUrl) {
    //   return new NextResponse("no image url", { status: 400 });
    // }

    const firebase_url = await uploadFileToFirebase(file, notes[0].name);

    // update the note with the firebase url
    await db
      .update($notes)
      .set({ imageUrl: firebase_url })
      .where(eq($notes.id, parseInt(noteId)));

    return new NextResponse("ok", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("error", { status: 500 });
  }
}
