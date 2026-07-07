/**
 * Removes the first depth-1 heading from a markdown document.
 * The site layout supplies the single page <h1>, so the source file's
 * H1 would otherwise duplicate it (and violate the one-H1-per-page rule).
 */
export default function remarkStripH1() {
  return (tree) => {
    const i = tree.children.findIndex((n) => n.type === 'heading' && n.depth === 1);
    if (i !== -1) tree.children.splice(i, 1);
  };
}
