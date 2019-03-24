import React, { Component } from 'react';
import _ from 'underscore';

import SortableItem from './sortable-field';

class SortableFields extends Component {
  constructor(props) {
    super(props);

    this.state = { items: this.props.items };
    this.onSortItems = this.onSortItems.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ items: nextProps.items });
  }

  onSortItems(items) {
    this.setState({ items }, this.triggerChange);
  }

  getItemDOM(itemProps, index) {
    return (
      <SortableItem
        // eslint-disable-next-line
        key={ index }
        onSortItems={ this.onSortItems }
        items={ this.state.items }
        sortId={ index }
        { ...itemProps }
      />
    );
  }

  triggerChange() {
    this.props.onChange(this.state.items);
  }

  render() {
    const { items } = this.state;

    return (
      <ul className="sortable-list">
        {
          _.map(items, (item, i) => {
            return this.getItemDOM({
              value: item.value,
              checked: item.selected,
              label: item.label,
              onChange: this.props.onSelectionChange,
            }, i);
          })
        }
      </ul>
    );
  }
}

export default SortableFields;
