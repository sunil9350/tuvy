export type UserMeResponse =
  | {
      authenticated: true;
      provider: "auth0" | "phone";
      user: {
        id: string;
        name: string | null;
        email: string | null;
        phoneE164: string | null;
        dateOfBirth: string | null;
        lastSeenAt: string | null;
        profileDismissedAt: string | null;
        profileFormSavedAt: string | null;
      };
      prefill: {
        name: string;
        email: string;
        phone: string;
        dateOfBirth: string;
      };
      /** Google / email sign-in: email is tied to the account */
      emailReadOnly: boolean;
      /** Phone OTP sign-in: number is tied to the account */
      phoneReadOnly: boolean;
      showProfilePrompt: boolean;
      profileMode: "auth0" | "phone";
    }
  | { authenticated: false };
