const KEY_PREFIX = "--";

type ParsedArgs = Record<string, string>;

function parseAppKeys(args: string[]): ParsedArgs {
  return args.reduce((acc: ParsedArgs, value: string) => {
    if (!String(value).startsWith(KEY_PREFIX)) {
      return acc;
    }

    const keyValuePair = value.substring(KEY_PREFIX.length).split("=");

    if (keyValuePair.length === 2 && keyValuePair[0] && keyValuePair[1]) {
      acc[keyValuePair[0]] = keyValuePair[1];
    }

    return acc;
  }, {});
}

export default function getAppArgs(args: string[], keyValue?: string): string | ParsedArgs | undefined {
  const [, , ...appArgs] = args;

  const parsed = parseAppKeys(appArgs);

  if (keyValue) {
    return parsed[keyValue];
  } else {
    return parsed;
  }
}
