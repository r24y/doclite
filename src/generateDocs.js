import * as babylon from 'babylon';
import traverse, {NodePath, Hub} from 'babel-traverse';
import t from 'babel-types';

export default function toHtml(source) {
  const itemsOfInterest = [];
  const ast = babylon.parse(source, {sourceType: 'module', ranges: true});
  ast.comments.forEach(({type, value, start, end, loc}) =>
    itemsOfInterest.push({
      type,
      start,
      end,
      value,
      startsLine: loc.start.column === 0,
      delimeters: type === 'CommentLine' ? ['//', ''] : ['/*', '*/'],
    })
  );

  // See https://github.com/babel/babel/issues/4640#issuecomment-250943681 for why I had to put all this in.
  const hub = new Hub({
    buildCodeFrameError(node, message, Error) {
      var loc = node && (node.loc || node._loc);

      var err = new Error(message);

      if (loc) {
        err.loc = loc.start;
      }

      return err;
    },
  });

  var path = NodePath.get({
    hub: hub,
    parentPath: null,
    parent: ast,
    container: ast,
    key: 'program',
  }).setContext();
  var scope = path.scope;
  // End workaround

  traverse(
    ast,
    {
      enter(path) {
        if (path.node.type === 'ImportDeclaration') {
          const source = path.node.source;
          let props = {
            href: source.value,
            title: source.value,
          }
          if (props.href[0] !== '.') {
            props.href = `https://www.npmjs.com/package/${props.href}`;
            props.target = '_blank';
          }
          itemsOfInterest.push({
            type: 'ImportSource',
            value: source.extra.raw,
            start: source.start,
            end: source.end,
            as: 'a',
            props,
          });
        }
        if (path.node.type === 'Identifier') {
          itemsOfInterest.push({
            type: 'Identifier',
            value: path.node.name,
            start: path.node.start,
            end: path.node.end,
          });
        }
      },
    },
    scope
  );

  itemsOfInterest.sort((a, b) => a.start - b.start);

  const output = [];
  let sliceStart = 0;
  let sliceEnd = 0;

  itemsOfInterest.forEach((node, i) => {
    sliceEnd = node.start;
    output.push({
      value: source.slice(sliceStart, sliceEnd),
      start: sliceStart,
      end: sliceEnd,
    });
    sliceStart = node.end;
    output.push(node);
  });

  output.push({
    value: source.slice(sliceStart),
    start: sliceStart,
    end: source.length,
  });

  return output;
}
