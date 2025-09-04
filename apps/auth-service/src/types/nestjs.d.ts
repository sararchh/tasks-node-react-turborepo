declare module '@nestjs/common' {
  interface DynamicModule {
    module?: any;
    imports?: any[];
    providers?: any[];
    controllers?: any[];
    exports?: any[];
    global?: boolean;
  }
}

declare module '@nestjs/typeorm' {
  export function forRoot(options?: any): any;
  export function forFeature(entities?: any[]): any;
}

declare module '@nestjs/jwt' {
  export function register(options?: any): any;
}

export {};
