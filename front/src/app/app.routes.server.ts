import { ServerRoute, RenderMode } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'producto/:id',
    renderMode: RenderMode.Server // Cambia de Prerender a Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
