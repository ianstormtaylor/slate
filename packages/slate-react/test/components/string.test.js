import React from 'react'
import TestRenderer from 'react-test-renderer'
import String from '../../src/components/string'

describe('slate-react', () => {
  describe('Components', () => {
    describe('String', () => {

      it('matches snapshot', () => {
        const isLast = true;
        const leaf = {text : 'hello'};
        const parent = {
            children : [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'A line of text!',
                    },
                  ],
                },
              ],
        };
        const text = {text : 'hello'}; 

        // const root = TestRenderer.create(<div>hello</div>)
        const root = TestRenderer.create(<String
                                isLast={isLast}
                                leaf={leaf}
                                parent={parent}
                                text={text}
                            />)
        expect(root.toJSON()).toMatchSnapshot();
      })
    })
  })
})
