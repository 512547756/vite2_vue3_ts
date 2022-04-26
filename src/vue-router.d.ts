import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    roles?: string[];
    activeMenu?: string;
  }
}
