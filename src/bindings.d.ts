export interface Bindings {
  HONO_TODO: KVNamespace;
}

declare global {
  function getMiniflareBindings(): Bindings;
}
