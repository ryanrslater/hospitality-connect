import { AccountStatus } from "@prisma/client";

export type PageProps = {
    signedIn: boolean;
    status: AccountStatus | null
}
