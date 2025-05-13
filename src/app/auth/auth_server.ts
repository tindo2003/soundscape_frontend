import { jwtVerify } from "jose";
import { cache } from "react";
import { redirect } from "next/navigation";
import { SessionToken } from "@/types/auth";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET;
// console.log("secretKey", secretKey);
const key = new TextEncoder().encode(secretKey);
// console.log("key", key);

export async function decrypt(
    session: string | undefined = ""
): Promise<SessionToken | null> {
    try {
        // console.log("session", session);
        const { payload } = await jwtVerify(session, key, {
            algorithms: ["HS256"],
        });
        // You can assert the type if you're sure the payload matches SessionToken.
        return payload as SessionToken;
    } catch (error) {
        console.error("Failed to decrypt session", error);
        return null;
    }
}

export async function verifySession() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userid) {
        redirect("/login");
    }

    // Return the full session, including spotifyid (which may be null)
    return session;
}