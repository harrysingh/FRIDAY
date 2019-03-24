import React from 'react';
import { sortable } from 'react-sortable';

const Item = (props) => {
  return (
    <li { ...props }>
      <label>
        <input
          name={ props.value }
          type="checkbox"
          checked={ props.checked }
          onChange={ props.onChange }
        />
        { props.label }
      </label>
    </li>
  );
};

export default sortable(Item);
