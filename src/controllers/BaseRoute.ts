import { ExecuteFnType, IRoute, PathMatcher, SupportedMethod, validatePath } from "./Route.interface.js";


export class BaseRoute implements IRoute {
  private matcher: PathMatcher;
  private requestMethod: SupportedMethod;
  execute: ExecuteFnType;

  constructor({ method, matcher, execute }: { method: SupportedMethod, matcher: string, execute: ExecuteFnType }) {
    this.matcher = validatePath(matcher);
    this.requestMethod = method;
    this.execute = execute;
  }

  public match(url: string, reqMethod: string): boolean {
    if (reqMethod !== this.requestMethod) {
      return false;
    }

    if (url.match(new RegExp(`^${this.matcher.replace(/\{[^}]+\}/g, "[^/]+")}$`))) {
      return true;
    }

    return false;
  }
}
