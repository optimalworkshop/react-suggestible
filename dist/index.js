"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _escapeStringRegexp = _interopRequireDefault(require("escape-string-regexp"));

var _textareaCaret = _interopRequireDefault(require("textarea-caret"));

var _menu = _interopRequireDefault(require("./menu"));

require("./suggestible.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var KEYS = {
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  ENTER: 13,
  TAB: 9,
  ESC: 27
};

var getLineHeight = function getLineHeight(element) {
  var styles = getComputedStyle(element);
  var lineHeight = parseInt(styles.lineHeight);
  return isNaN(lineHeight) ? parseInt(styles.fontSize, 10) : lineHeight;
};

var Suggestible = (0, _react.forwardRef)(function (_ref, ref) {
  var Component = _ref.component,
      className = _ref.className,
      maxOptions = _ref.maxOptions,
      minPrefix = _ref.minPrefix,
      options = _ref.options,
      tabIndex = _ref.tabIndex,
      trigger = _ref.trigger,
      value = _ref.value,
      onBlur = _ref.onBlur,
      onChange = _ref.onChange,
      onFocus = _ref.onFocus,
      onInput = _ref.onInput,
      onKeyDown = _ref.onKeyDown,
      props = _objectWithoutProperties(_ref, ["component", "className", "maxOptions", "minPrefix", "options", "tabIndex", "trigger", "value", "onBlur", "onChange", "onFocus", "onInput", "onKeyDown"]);

  var container = (0, _react.useRef)();
  var textarea = ref || (0, _react.useRef)();

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      isFocused = _useState2[0],
      setFocused = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isCancelled = _useState4[0],
      setCancelled = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      isOpen = _useState6[0],
      setOpen = _useState6[1];

  var _useState7 = (0, _react.useState)(''),
      _useState8 = _slicedToArray(_useState7, 2),
      prefix = _useState8[0],
      setPrefix = _useState8[1];

  var _useState9 = (0, _react.useState)(0),
      _useState10 = _slicedToArray(_useState9, 2),
      selectedIndex = _useState10[0],
      setSelectedIndex = _useState10[1];

  var matcher = (0, _react.useMemo)(function () {
    var char = (0, _escapeStringRegexp.default)(trigger);
    return new RegExp("".concat(char, "([^").concat(char, "\\s]{").concat(minPrefix, ",})$"));
  }, [trigger, minPrefix]);

  var focused = function focused(e) {
    setTimeout(function () {
      textarea.current.focus();

      if (!isFocused) {
        setFocused(true);
        onFocus && onFocus(e);
      }
    });
  };

  var blurred = function blurred(e) {
    if (isFocused) {
      // Don’t announce blur if we've only switched windows
      if (document.hasFocus()) {
        setFocused(false);
        closeMenu();
        onBlur && onBlur(e);
      }
    }
  };

  var changed = function changed() {
    onChange(textarea.current.value);
  };

  var input = function input(e) {
    var event = e.nativeEvent || e;

    if (!event.isComposing && !cancelled(event)) {
      if (!openMenu()) {
        setOpen(false);
        setPrefix('');
      }
    }

    onInput && onInput(e);
  };

  var keyDown = function keyDown(e) {
    if (isOpen) {
      switch (e.which) {
        case KEYS.DOWN:
        case KEYS.UP:
          e.preventDefault();
          moveSelection(e.which === KEYS.UP ? -1 : 1);
          break;

        case KEYS.ENTER:
        case KEYS.RIGHT:
        case KEYS.TAB:
          e.preventDefault();
          confirmSelection();
          break;

        case KEYS.ESC:
          e.preventDefault();
          closeMenu();
          setCancelled(true);
          break;
      }
    } else if (e.which === KEYS.TAB && cancelled) {
      if (openMenu()) {
        setCancelled(false);
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    }

    onKeyDown && onKeyDown(e);
  };

  var cancelled = function cancelled(e) {
    if (e.data === trigger && isCancelled) {
      setCancelled(false);
      return false;
    }

    return isCancelled;
  };

  var openMenu = function openMenu() {
    var _textarea$current = textarea.current,
        value = _textarea$current.value,
        start = _textarea$current.selectionStart;
    var match = value.substring(0, start).match(matcher);

    if (match && match[1]) {
      setPrefix(match[1]);
      setSelectedIndex(0);
      setOpen(true);
      return true;
    }
  };

  var closeMenu = function closeMenu() {
    setOpen(false);
  };

  var menuOptions = (0, _react.useMemo)(function () {
    var matcher = new RegExp("^".concat((0, _escapeStringRegexp.default)(prefix)), 'i');
    return options.filter(function (str) {
      return matcher.test(str);
    }).slice(0, maxOptions);
  }, [options, prefix]);

  var moveSelection = function moveSelection(offset) {
    var length = menuOptions.length;
    setSelectedIndex((selectedIndex + offset + length) % length);
  };

  var confirmSelection = function confirmSelection() {
    insert(menuOptions[selectedIndex] + ' ');
    closeMenu();
  };

  var optionClicked = function optionClicked(option) {
    insert(option + ' ');
    closeMenu();
  };

  var insert = function insert(text) {
    var el = textarea.current;
    var value = el.value,
        start = el.selectionStart;
    el.value = value.substring(0, start - prefix.length) + text + value.substring(start + prefix.length);
    el.selectionStart = el.selectionEnd = start + text.length;
    changed();
  };

  var menuCoordinates = (0, _react.useMemo)(function () {
    if (!textarea.current) return {
      left: 0,
      top: 0
    };
    var start = textarea.current.selectionStart;
    var coordinates = (0, _textareaCaret.default)(textarea.current, start - prefix.length);
    var boundingBox = container.current.getBoundingClientRect();
    coordinates.top += boundingBox.top + getLineHeight(textarea.current);
    coordinates.left += boundingBox.left;
    return coordinates;
  }, [value, prefix, isOpen]);
  return _react.default.createElement("div", {
    ref: container,
    className: (0, _classnames.default)('suggestible', className),
    tabIndex: tabIndex,
    onFocus: focused,
    onBlur: blurred
  }, _react.default.createElement(Component, _extends({
    ref: textarea,
    value: value,
    onChange: changed,
    onInput: input,
    onKeyDown: keyDown
  }, props)), isOpen && _react.default.createElement(_menu.default, _extends({
    options: menuOptions,
    prefix: prefix,
    selectedIndex: selectedIndex,
    onClick: optionClicked
  }, menuCoordinates)));
});
Suggestible.propTypes = {
  className: _propTypes.default.string,
  component: _propTypes.default.any,
  maxOptions: _propTypes.default.number,
  minPrefix: _propTypes.default.number,
  options: _propTypes.default.arrayOf(_propTypes.default.string.isRequired),
  tabIndex: _propTypes.default.number,
  trigger: _propTypes.default.string,
  value: _propTypes.default.string,
  onBlur: _propTypes.default.func,
  onChange: _propTypes.default.func.isRequired,
  onFocus: _propTypes.default.func,
  onInput: _propTypes.default.func,
  onKeyDown: _propTypes.default.func
};
Suggestible.defaultProps = {
  component: 'textarea',
  maxOptions: 5,
  minPrefix: 2,
  tabIndex: 0,
  trigger: '@',
  value: ''
};
var _default = Suggestible;
exports.default = _default;