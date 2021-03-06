import { DefaultCtx, SessionContext, SimpleRolesIsAuthorized, NextPage } from "blitz"
import { User, UserRole } from "db"

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<UserRole>
    PublicData: {
      userId: User["id"]
      role: UserRole
    }
  }

  export interface BlitzPage<P = {}, IP = P> extends Omit<NextPage<P, IP>, "getLayout"> {
    getLayout?: (component: JSX.Element, pageProps: P) => JSX.Element
  }
}
