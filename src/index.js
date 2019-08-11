import React, { useEffect, useMemo, useRef, useState, forwardRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import escapeRegExp from 'escape-string-regexp'
import getCaretCoordinates from 'textarea-caret'
import Menu from './menu'

import './suggestible.css'

const KEYS = {
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  ENTER: 13,
  TAB: 9,
  ESC: 27,
}

const getLineHeight = element => {
  const styles = getComputedStyle(element)
  const lineHeight = parseInt(styles.lineHeight)
  return isNaN(lineHeight) ? parseInt(styles.fontSize, 10) : lineHeight
}

const Suggestible = forwardRef(({
  component: Component,
  className,
  maxOptions,
  minPrefix,
  options,
  tabIndex,
  trigger,
  value,
  onBlur,
  onChange,
  onFocus,
  onInput,
  onKeyDown,
  ...props
}, ref) => {
  const container = useRef()
  const textarea = useRef()

  useEffect(() => {
    if (ref) {
      if (typeof(ref) === 'function') {
        ref(textarea.current)
      } else {
        ref.current = textarea.current
      }
    }
  }, [ref, textarea.current])

  const [isFocused, setFocused] = useState(false)
  const [isCancelled, setCancelled] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [prefix, setPrefix] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const matcher = useMemo(
    () => {
      const char = escapeRegExp(trigger)
      return new RegExp(`${char}([^${char}\\s]{${minPrefix},})$`)
    },
    [trigger, minPrefix]
  )

  const focused = e => {
    if (e.persist) e.persist()

    setTimeout(() => {
      textarea.current.focus()
      if (!isFocused) {
        setFocused(true)
        onFocus && onFocus(e)
      }
    })
  }

  const blurred = e => {
    if (isFocused) {
      // Don’t announce blur if we've only switched windows
      if (document.hasFocus()) {
        setFocused(false)
        closeMenu()
        onBlur && onBlur(e)
      }
    }
  }

  const changed = () => {
    onChange(textarea.current.value)
  }

  const input = e => {
    const event = e.nativeEvent || e

    if (!event.isComposing && !cancelled(event)) {
      if (!openMenu()) {
        setOpen(false)
        setPrefix('')
      }
    }

    onInput && onInput(e)
  }

  const keyDown = e => {
    if (isOpen) {
      switch (e.which) {
        case KEYS.DOWN:
        case KEYS.UP:
          e.preventDefault()
          moveSelection(e.which === KEYS.UP ? -1 : 1)
          break
        case KEYS.ENTER:
        case KEYS.RIGHT:
        case KEYS.TAB:
          if (menuOptions[selectedIndex]) {
            e.preventDefault()
            confirmSelection()
          }
          break
        case KEYS.ESC:
          e.preventDefault()
          closeMenu()
          setCancelled(true)
          break
      }
    } else if (e.which === KEYS.TAB && cancelled) {
      if (openMenu()) {
        setCancelled(false)
        e.preventDefault()
        e.stopPropagation()
        return
      }
    }

    onKeyDown && onKeyDown(e)
  }

  const cancelled = e => {
    if (e.data === trigger && isCancelled) {
      setCancelled(false)
      return false
    }

    return isCancelled
  }

  const openMenu = () => {
    const { value, selectionStart: start } = textarea.current
    const match = value.substring(0, start).match(matcher)

    if (match && match[1]) {
      setPrefix(match[1])
      setSelectedIndex(0)
      setOpen(true)
      return true
    }
  }

  const closeMenu = () => {
    setOpen(false)
  }

  const menuOptions = useMemo(
    () => {
      const matcher = new RegExp(`^${escapeRegExp(prefix)}`, 'i')
      return options.filter(str => matcher.test(str)).slice(0, maxOptions)
    },
    [options, prefix]
  )

  const moveSelection = offset => {
    const { length } = menuOptions
    setSelectedIndex((selectedIndex + offset + length) % length)
  }

  const confirmSelection = () => {
    insert(menuOptions[selectedIndex] + ' ')
    closeMenu()
  }

  const optionClicked = option => {
    insert(option + ' ')
    closeMenu()
  }

  const insert = text => {
    const el = textarea.current
    const { value, selectionStart: start } = el
    el.value =
      value.substring(0, start - prefix.length) +
      text +
      value.substring(start)
    el.selectionStart = el.selectionEnd = start + text.length - prefix.length

    changed()
  }

  const menuCoordinates = useMemo(
    () => {
      if (!textarea.current) return { left: 0, top: 0 }

      const { selectionStart: start } = textarea.current
      const coordinates = getCaretCoordinates(
        textarea.current,
        start - prefix.length
      )
      const boundingBox = container.current.getBoundingClientRect()
      coordinates.top += boundingBox.top + getLineHeight(textarea.current)
      coordinates.left += boundingBox.left
      return coordinates
    },
    [value, prefix, isOpen]
  )

  return (
    <div
      ref={container}
      className={classNames('suggestible', className)}
      tabIndex={tabIndex}
      onFocus={focused}
      onBlur={blurred}
    >
      <Component
        ref={textarea}
        value={value}
        onChange={changed}
        onInput={input}
        onKeyDown={keyDown}
        {...props}
      />
      {isOpen && (menuOptions.length > 0) && (
        <Menu
          options={menuOptions}
          prefix={prefix}
          selectedIndex={selectedIndex}
          onClick={optionClicked}
          {...menuCoordinates}
        />
      )}
    </div>
  )
})

Suggestible.propTypes = {
  className: PropTypes.string,
  component: PropTypes.any,
  maxOptions: PropTypes.number,
  minPrefix: PropTypes.number,
  options: PropTypes.arrayOf(PropTypes.string.isRequired),
  tabIndex: PropTypes.number,
  trigger: PropTypes.string,
  value: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onInput: PropTypes.func,
  onKeyDown: PropTypes.func,
}

Suggestible.defaultProps = {
  component: 'textarea',
  maxOptions: 5,
  minPrefix: 2,
  tabIndex: 0,
  trigger: '@',
  value: '',
}

export default Suggestible
