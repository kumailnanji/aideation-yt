/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { User } from "@clerk/nextjs/api";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/lib/db";
import { $users } from "@/lib/db/schema"
import { eq } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs";

// these keys are not returned by the webhooks.
type UnwantedKeys =
  | "emailAddresses"
  | "firstName"
  | "lastName"
  | "primaryEmailAddressId"
  | "primaryPhoneNumberId"
  | "phoneNumbers";

// object with data returned from webhook.
// can verify this in Clerk dashboard webhook logs.
interface UserInterface extends Omit<User, UnwantedKeys> {
  email_addresses: {
    email_address: string;
    id: string;
  }[];
  username: string;
  primary_email_address_id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
}

export const runtime = "edge";

const webhookSecret: string = process.env.WEBHOOK_SECRET || "";

/**
 * This API Route will be hit by the Clerk webhook whenever a user
 * is created, updated or deleted.
 */
export async function POST(req: Request) {
  const payload = await req.json();
  const payloadString = JSON.stringify(payload);
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixIdTimeStamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");
  if (!svixId || !svixIdTimeStamp || !svixSignature) {
    console.log("svixId", svixId);
    console.log("svixIdTimeStamp", svixIdTimeStamp);
    console.log("svixSignature", svixSignature);
    return new Response("Error occured", {
      status: 400,
    });
  }
  const svixHeaders = {
    "svix-id": svixId,
    "svix-timestamp": svixIdTimeStamp,
    "svix-signature": svixSignature,
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;
  try {
    evt = wh.verify(payloadString, svixHeaders) as Event;
  } catch (_) {
    console.log("error");
    return new Response("Error occured", {
      status: 400,
    });
  }
  // Handle the webhook
  const eventType: EventType = evt.type;
  if (eventType === "user.created" || eventType === "user.updated") {
    const {
      id,
      first_name: firstName,
      username,
      image_url: imageUrl,
      email_addresses,
      primary_email_address_id,
      last_name: lastName,
    } = evt.data;

    const emailObject = email_addresses?.find((email) => {
      return email.id === primary_email_address_id;
    });
    if (!emailObject) {
      return new Response("Error locating user", {
        status: 400,
      });
    }

    const primaryEmail = emailObject.email_address;

    const exists = await db.query.$users.findFirst({
      where: eq($users.id, id),
    });

    // If the user already exists in the database, we only update it.
    if (!!exists) {
      await db.insert($users).values({
        id,
        name: firstName as string
      });

      const createdUser = await db.query.$users.findFirst({
        where: eq($users.id, id),
      });

      /**
       * After a user is created in the database, we get the database id
       * and assign it to the clerk user object's metadata, so we can easily
       * access it anywhere.
       */
      if (createdUser) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            databaseId: createdUser.id,
          },
        });
      }
    }
  }
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    await db.delete($users).where(eq($users.id, id));
  }

  return new Response("", {
    status: 201,
  });
}

type Event = {
  data: UserInterface;
  object: "event";
  type: EventType;
};

type EventType = "user.created" | "user.updated" | "user.deleted" | "*";