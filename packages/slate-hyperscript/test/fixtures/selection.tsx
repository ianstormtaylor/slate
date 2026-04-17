export const input = (
  <editor>
    <element>word</element>
    <selection>
      <anchor offset={1} path={[0, 0]} />
      <focus offset={2} path={[0, 0]} />
    </selection>
  </editor>
)
export const output = {
  children: [
    {
      children: [
        {
          text: 'word',
        },
      ],
    },
  ],
  selection: {
    anchor: {
      path: [0, 0],
      offset: 1,
    },
    focus: {
      path: [0, 0],
      offset: 2,
    },
  },
}
