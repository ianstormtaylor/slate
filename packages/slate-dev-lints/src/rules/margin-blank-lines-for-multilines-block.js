const docsUrl = require('../utils/docsUrl')

module.exports = {
  meta: {
    docs: {
      descriptions: 'Blank lines shall exists around multi-line blocks',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('margin-blank-lines-for-multilines-block'),
    },
    fixable: 'code',
    schema: [
      {
        enum: ['always', 0],
      },
    ],
  },
  create(context) {
    const sourceCode = context.getSourceCode()
    const lines = sourceCode.getLines()

    /*
     * @param{ASTNode} node
     * @return {void}
    */

    function check(node) {
      const { loc, parent } = node
      if (loc.start.line === loc.end.line) return
      if (!parent) return

      if (
        loc.start.line > 1 &&
        parent.start.line !== loc.start.line &&
        lines[loc.start.line] &&
        lines[loc.start.line].trim() !== '' &&
        lines[loc.start.line - 1] &&
        lines[loc.start.line - 1].trim() !== ''
      ) {
        context.report({
          node,
          message: 'Missing blank line before a multi-lines block',
          fix(fixer) {
            return fixer.insertTextAfter(node, '\n')
          },
        })
      }
    }

    return {
      IfStatement: check,
      VariableDeclaration: check,
    }
  },
}
