"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MenuItem = function MenuItem(_ref) {
  var text = _ref.text,
      prefix = _ref.prefix,
      selected = _ref.selected,
      onClick = _ref.onClick;

  var ignore = function ignore(e) {
    e.preventDefault();
    e.stopPropagation();
  };

  return _react.default.createElement("div", {
    className: "suggestible__menu-item",
    "aria-selected": selected || undefined,
    onClick: onClick,
    onMouseDown: ignore,
    onTouchStart: ignore
  }, _react.default.createElement("b", null, text.substring(0, prefix.length)), text.substring(prefix.length));
};

MenuItem.propTypes = {
  text: _propTypes.default.string.isRequired,
  prefix: _propTypes.default.string.isRequired,
  selected: _propTypes.default.bool,
  onClick: _propTypes.default.func.isRequired
};
var _default = MenuItem;
exports.default = _default;