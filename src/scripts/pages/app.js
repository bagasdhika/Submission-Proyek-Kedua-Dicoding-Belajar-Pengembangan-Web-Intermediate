import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { renderNavigation } from '../utils/navigation';

export default class App {
  constructor({ content }) {
    this._content = content;
  }

  async renderPage() {
    const route = getActiveRoute();
    const page = routes[route];

    // === VIEW TRANSITION (Kriteria 1) ===
    if (!document.startViewTransition) {
      this._content.innerHTML = await page.render();
      await page.afterRender();
      renderNavigation();
      return;
    }

    document.startViewTransition(async () => {
      this._content.innerHTML = await page.render();
      await page.afterRender();
      renderNavigation();
    });
  }
}
