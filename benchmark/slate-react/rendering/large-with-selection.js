/** @jsx h */
/* eslint-disable react/jsx-key */

const React = require('react')
const ReactDOM = require('react-dom/server')
const h = require('../../helpers/h')
const { Editor } = require('slate-react')

module.exports.default = function(value) {
  const el = React.createElement(Editor, { value })
  ReactDOM.renderToStaticMarkup(el)
}

module.exports.input = (
  <value>
    <document>
      <paragraph>
        Breve whipped ristretto ut as to go café au lait. Extra, skinny
        trifecta, cup chicory medium cup dripper whipped coffee cultivar. Body
        crema iced whipped, grounds turkish coffee steamed crema affogato.{' '}
        <b>Skinny that wings aged cream,</b> grounds siphon coffee french press
        mazagran irish roast.
      </paragraph>
      <block type="level-one">
        <block type="level-two">
          <block type="coffee-container">
            <text />
            <inline type="coffee">
              Extra, brewed caffeine fair trade, whipped cup bar flavour grounds
              organic. Café au lait blue mountain cortado saucer, macchiato ut
              that caramelization flavour.
            </inline>
            <text />
            <inline type="coffee">
              Crema frappuccino so decaffeinated, sit café au lait irish
              cultivar doppio café au lait. Dripper irish fair trade <anchor />kopi-luwak
              ut beans skinny saucer.
            </inline>
            <text />
          </block>
          <block type="coffee-container">
            <text />
            <inline type="coffee">
              Half and half, irish rich sugar medium frappuccino spoon. Whipped,
              caramelization, caffeine french press cinnamon variety rich redeye
              acerbic americano aftertaste. Shop crema filter seasonal, filter
              aromatic, french press mazagran affogato cappuccino single origin.
            </inline>
            <text>
              Plunger pot aromatic, crema, cultivar french press, skinny and
              percolator so single origin. Id variety and cinnamon brewed
              flavour cultivar acerbic half and half et<focus /> cappuccino.
            </text>
            <inline type="coffee">
              Cup qui a barista crema white kopi-luwak chicory trifecta.
            </inline>
            <text />
          </block>
        </block>
      </block>
      {Array.from(Array(10)).map(() => (
        <quote>
          <paragraph>
            <paragraph>
              This is editable <b>rich</b> text, <i>much</i> better than a
              textarea!
            </paragraph>
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)
