/** @jsx jsx */
import { Transforms } from "slate";
import { jsx } from "../../..";
export const run = editor => {
  Transforms.insertFragment(
    editor,
    <fragment>
      <inline>fragment</inline>
    </fragment>
  );
};
export const input = (
  <editor>
    <block>
      <cursor />
      <inline>word</inline>
      <text />
    </block>
  </editor>
);
export const output = (
  <editor>
    <block>
      <text />
      <inline>
        fragment
        <cursor />
      </inline>
      <text />
      <inline>word</inline>
      <text />
    </block>
  </editor>
);
