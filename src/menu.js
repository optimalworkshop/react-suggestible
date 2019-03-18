import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import MenuItem from './menu_item'

const usePortal = children => {
  const el = useRef(document.createElement('div'))
  useEffect(() => {
    document.body.appendChild(el.current)
    return () => document.body.removeChild(el.current)
  }, [])

  return createPortal(children, el.current)
}

const Menu = ({ options, prefix, selectedIndex, left, top, onClick }) => {
  return usePortal(
    <div
      className="suggestible__menu"
      style={{
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
      }}
    >
      {options.map((option, i) => (
        <MenuItem
          key={option}
          text={option}
          prefix={prefix}
          selected={selectedIndex === i}
          onClick={() => onClick(option)}
        />
      ))}
    </div>
  )
}

Menu.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string.isRequired),
  prefix: PropTypes.string,
  selectedIndex: PropTypes.number,
  left: PropTypes.number,
  top: PropTypes.number,
  onClick: PropTypes.func.isRequired,
}

Menu.defaultProps = {
  left: 0,
  top: 0,
}

export default Menu
