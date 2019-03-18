"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _menu_item = _interopRequireDefault(require("./menu_item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var usePortal = function usePortal(children) {
  var el = (0, _react.useRef)(document.createElement('div'));
  (0, _react.useEffect)(function () {
    document.body.appendChild(el.current);
    return function () {
      return document.body.removeChild(el.current);
    };
  }, []);
  return (0, _reactDom.createPortal)(children, el.current);
};

var Menu = function Menu(_ref) {
  var options = _ref.options,
      prefix = _ref.prefix,
      selectedIndex = _ref.selectedIndex,
      left = _ref.left,
      top = _ref.top,
      _onClick = _ref.onClick;
  return usePortal(_react.default.createElement("div", {
    className: "suggestible__menu",
    style: {
      position: 'fixed',
      left: "".concat(left, "px"),
      top: "".concat(top, "px")
    }
  }, options.map(function (option, i) {
    return _react.default.createElement(_menu_item.default, {
      key: option,
      text: option,
      prefix: prefix,
      selected: selectedIndex === i,
      onClick: function onClick() {
        return _onClick(option);
      }
    });
  })));
};

Menu.propTypes = {
  options: _propTypes.default.arrayOf(_propTypes.default.string.isRequired),
  prefix: _propTypes.default.string,
  selectedIndex: _propTypes.default.number,
  left: _propTypes.default.number,
  top: _propTypes.default.number,
  onClick: _propTypes.default.func.isRequired
};
Menu.defaultProps = {
  left: 0,
  top: 0
};
var _default = Menu;
exports.default = _default;