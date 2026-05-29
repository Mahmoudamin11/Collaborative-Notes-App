// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// shared/types/user.ts
//
// RULE: zero imports from mongoose, bcrypt, or anything Node-specific.
// This file is imported by BOTH the Next.js client and the Node server.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * One linked OAuth provider entry.
 * A user who signed in with Google AND GitHub has two of these.
 */
export interface IAccount {
  provider:          string;
  providerAccountId: string;
  type:              "oauth" | "email" | "credentials";
  // tokens are stripped before sending to the client — not included here
}

/**
 * The plain, serializable shape of a user.
 *
 * Two key differences from the server-side IUser:
 *  - _id is string, not ObjectId  (JSON.stringify converts ObjectId → string)
 *  - dates are string, not Date   (JSON.stringify converts Date → ISO string)
 *
 * This is what your API responses look like after res.json().
 */
export interface IUser {
  _id:           string;
  name:          string;
  email:         string;
  emailVerified: string | null;
  image:         string | null;
  accounts:      IAccount[];
  noteIds:       string[];      // owned note IDs (as strings)
  sharedNoteIds: string[];      // shared note IDs (as strings)
  createdAt:     string;        // ISO date string e.g. "2025-01-01T00:00:00.000Z"
  updatedAt:     string;
}

/**
 * A safe public subset of IUser — strip anything sensitive before
 * sending to the client. Use this as your API response type.
 *
 * Note: password is already excluded (select: false on the schema).
 * accounts is also excluded here — the client usually doesn't need raw OAuth tokens.
 */
export type PublicUser = Omit<IUser, "accounts">;