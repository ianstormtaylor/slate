import styled from 'react-emotion'

export const EditorWrapper = styled('div')`
  & > * > * + * {
    margin-top: 1em;
  }
`
