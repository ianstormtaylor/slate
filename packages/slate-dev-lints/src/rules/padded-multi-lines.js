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
      checkBefore(node)
      checkAfter(node)
    }

    function checkBefore(node) {
      const { loc, parent } = node
      if (parent.start.line < node.start.line - 1) return
      const { line } = loc.start

      if (
        line > 1 &&
        lines[line - 2] &&
        lines[line - 2].trim() !== '' &&
        lines[line - 1] &&
        lines[line - 1].trim() !== ''
      ) {
        context.report({
          node,
          message: 'Missing blank line before a multi-lines block',
          fix(fixer) {
            return fixer.insertTextBefore(node, '\n')
          },
        })
      }
    }

    function checkAfter(node) {
      const { loc, parent } = node
      if (parent.end.line > node.end.line + 1) return
      const { line } = loc.end

      if (
        lines[line - 1] &&
        lines[line - 1].trim() !== '' &&
        lines[line] &&
        lines[line].trim() !== ''
      ) {
        context.report({
          node,
          message: 'Missing blank line after a multi-lines block',
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
