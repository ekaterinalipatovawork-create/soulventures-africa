/** Separate HTML entry chooses colors only; page content and timing are shared. */
export function paletteAsset(source: string): string {
  return document.documentElement.dataset.palette === "heritage"
    ? source.replace("/assets/", "/assets/heritage/")
    : source;
}
