import React from 'react'
import PropTypes from 'prop-types'

const MenuItem = ({ text, prefix, selected, onClick }) => {
  const ignore = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div
      className="suggestible__menu-item"
      aria-selected={selected || undefined}
      onClick={onClick}
      onMouseDown={ignore}
      onTouchStart={ignore}
    >
      <b>{text.substring(0, prefix.length)}</b>
      {text.substring(prefix.length)}
    </div>
  )
}

MenuItem.propTypes = {
  text: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
}

export default MenuItem
