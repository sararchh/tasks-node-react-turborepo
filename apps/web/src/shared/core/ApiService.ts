export interface ApiResponse<T> {
  data: T;
}

type ApiServiceProps<RequestType, ReturnType> = {
  cacheKey?: string;
  handler: (req: RequestType) => ReturnType;
};

export class ApiService<
  RequestType,
  ReturnType,
  CacheKeySufixes extends Record<string, string | number> = Record<string, never>,
> {
  public readonly props: ApiServiceProps<RequestType, ReturnType>;

  getCacheKey(sufixes?: CacheKeySufixes): string[] {
    const sufixesAsArr = Object.values(sufixes || {});
    const validSufixes = sufixesAsArr
      .filter(Boolean)
      .map((s) => s!.toString()) as string[];

    return this.props.cacheKey
      ? [this.props.cacheKey, ...validSufixes]
      : validSufixes;
  }

  execute(props?: RequestType) {
    return this.props.handler(props as RequestType);
  }

  constructor(props: ApiServiceProps<RequestType, ReturnType>) {
    this.props = props;
  }
}
