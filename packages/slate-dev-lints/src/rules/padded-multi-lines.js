const docsUrl = require('../utils/docsUrl')

module.exports = {
  meta: {
    docs: {
      descriptions: 'Blank lines shall exists around multi-line blocks',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('margin-blank-lines-for-multilines-block'),
    },
    messages: {
      before: 'Missing blank line before a multi-lines block',
      after: 'Missing blank line after a multi-lines block',
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
        lines[line - 1].trim() !== ''
      ) {
        const comments = context.getCommentsBefore(node)
        const beforeComment = comments.find(c => c.loc.end.line === line - 1)

        if (beforeComment) {
          const blankLine = beforeComment.loc.start.line - 1
          if (blankLine < 1) return
          if (lines[blankLine - 1].trim() === '') return
        }

        context.report({
          node,
          messageId: 'before',
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
        const { end } = loc
        context.report({
          node,
          loc: { start: end, end },
          messageId: 'after',
          fix(fixer) {
            return fixer.insertTextAfter(node, '\n')
          },
        })
      }
    }

    return {
      IfStatement: check,
      VariableDeclaration: check,
      SwitchStatement: check,
      WhileStatement: check,
      DoWhileStatement: check,
      ForStatement: check,
      ForInStatement: check,
      ExpressionStatement: check,
    }
  },
}
