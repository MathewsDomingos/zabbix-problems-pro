declare module '@emotion/css' {
  export function css(
    template: TemplateStringsArray | string,
    ...args: Array<string | number | boolean | undefined | null>
  ): string;
  export function cx(...classNames: Array<string | false | undefined | null>): string;
  export function keyframes(
    template: TemplateStringsArray | string,
    ...args: Array<string | number | boolean | undefined | null>
  ): string;
  export function injectGlobal(
    template: TemplateStringsArray | string,
    ...args: Array<string | number | boolean | undefined | null>
  ): void;
}
