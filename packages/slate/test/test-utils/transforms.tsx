/** @jsx jsx */
import { jsx } from '..'
import { Editor } from 'slate'

export const createTree = (
  operandType: 'element' | 'text' = 'element'
): Editor => (
  <editor id="root">
    <element id="earlier sibling of ancestor">
      <element id="child of earlier sibling of ancestor">
        <text id="descendant of earlier sibling of ancestor">AB</text>
      </element>
    </element>
    <element id="ancestor">
      <text id="earliest sibling of parent">AB</text>
      <element id="earlier sibling of parent">
        <element id="child of earlier sibling of parent">
          <text id="descendant of earlier sibling of parent">AB</text>
        </element>
      </element>
      {operandType === 'element' ? (
        <element id="parent">
          <text id="earliest sibling">AB</text>
          <element id="earlier sibling">
            <element id="first child of earlier sibling">
              <text id="descendant of earlier sibling">AB</text>
            </element>
            <text id="second child of earlier sibling">AB</text>
            <text id="third child of earlier sibling">AB</text>
          </element>
          <element id="operand">
            <element id="first child">
              <text id="descendant">AB</text>
            </element>
            <text id="second child">AB</text>
            <text id="third child">AB</text>
          </element>
          <element id="later sibling">
            <element id="first child of later sibling">
              <text id="descendant of later sibling">AB</text>
            </element>
            <text id="second child of later sibling">AB</text>
            <text id="third child of later sibling">AB</text>
          </element>
          <text id="latest sibling">AB</text>
        </element>
      ) : (
        <element id="parent">
          <element id="earliest sibling">
            <element id="first child of earliest sibling">
              <text id="descendant of earliest sibling">AB</text>
            </element>
            <text id="second child of earliest sibling">AB</text>
            <text id="third child of earliest sibling">AB</text>
          </element>
          <text id="earlier sibling">AB</text>
          <text id="operand">ABCDEF</text>
          <text id="later sibling">AB</text>
          <element id="latest sibling">
            <element id="first child of latest sibling">
              <text id="descendant of latest sibling">AB</text>
            </element>
            <text id="second child of latest sibling">AB</text>
            <text id="third child of latest sibling">AB</text>
          </element>
        </element>
      )}
      <element id="later sibling of parent">
        <element id="child of later sibling of parent">
          <text id="descendant of later sibling of parent">AB</text>
        </element>
      </element>
      <text id="latest sibling of parent">AB</text>
    </element>
    <element id="later sibling of ancestor">
      <element id="child of later sibling of ancestor">
        <text id="descendant of later sibling of ancestor">AB</text>
      </element>
    </element>
  </editor>
)
