import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const signInFacebook = async () => {
    const data = await authClient.signIn.social({
        provider: "facebook"
    })
    return data;
}

export type Session = typeof authClient.$Infer.Session;
