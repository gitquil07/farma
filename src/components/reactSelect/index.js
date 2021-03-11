import React from "react";
import Select from 'react-select'
import PropTypes from "prop-types";

const noop = () => {
  // no operation (do nothing real quick)
};

class FixRequiredSelect extends React.Component {
  state = {
    value: this.props.value || ""
  };

  selectRef = null;
  setSelectRef = ref => {
    this.selectRef = ref;
  };

  onChange = (e) => {
    this.props.onChange(e);
    this.setState({ value: e.value });
  };

  getValue = () => {
    if (this.props.value != undefined) return this.props.value;
    return this.state.value || "";
  };

  render() {
    const { required, ...props } = this.props;
    const { isLoading, isDisabled } = this.props;
    const enableRequired = !isDisabled;

    return (
      <div>
        <Select
          {...props}
          ref={this.setSelectRef}
          onChange={this.onChange}
        />
        {enableRequired && (
          <input
            tabIndex={-1}
            autoComplete="off"
            style={{
              opacity: 0,
              width: "100%",
              height: 0,
              position: "absolute"
            }}
            value={this.getValue()}
            onChange={noop}
            onFocus={() => this.selectRef.focus()}
            required={required}
          />
        )}
      </div>
    );
  }
}

FixRequiredSelect.defaultProps = {
  onChange: noop
};

FixRequiredSelect.protoTypes = {
  selectComponent: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  required: PropTypes.bool
};

export default FixRequiredSelect;
