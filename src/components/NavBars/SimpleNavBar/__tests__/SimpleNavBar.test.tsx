import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import {SimpleNavBar} from '../SimpleNavBar';

describe('SimpleNavBar', () => {
  it('renders a title with left and right text buttons', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <SimpleNavBar
          title="My Mars"
          leftText="Undo"
          leftAction={() => {}}
          rightText="Next"
        />,
      );
    });

    expect(tree?.toJSON()).toMatchSnapshot();
  });

  it('calls the left action when pressed', async () => {
    const leftAction = jest.fn();
    let tree: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <SimpleNavBar title="My Mars" leftText="Undo" leftAction={leftAction} />,
      );
    });

    const touchable = tree!.root.findAllByProps({accessible: true})[0];
    await ReactTestRenderer.act(() => {
      touchable.props.onClick?.() ?? touchable.props.onPress?.();
    });

    expect(leftAction).toHaveBeenCalled();
  });
});
