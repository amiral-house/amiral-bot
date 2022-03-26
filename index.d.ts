declare module "unshorten.it" {
  const module: (url: string) => Promise<string>;
  export default module;
}
