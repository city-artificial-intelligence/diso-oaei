/**
 * Wraps rendered markdown tables in a horizontally scrollable container so a
 * wide table scrolls inside its own box instead of the page body — without
 * changing the table element itself (screen-reader table semantics survive).
 */
export default function rehypeWrapTables() {
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      if (child.type === 'element' && child.tagName === 'table') {
        return {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-scroll'] },
          children: [child],
        };
      }
      walk(child);
      return child;
    });
  };
  return (tree) => {
    walk(tree);
    return tree;
  };
}
