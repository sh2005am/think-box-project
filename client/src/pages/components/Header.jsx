import React from 'react'

const Header = (props) => {
    if (props.isHome) {
        return (
            <div>
      <header className='up'>
        <h1>Think Box</h1>
        <nav>
          <span>Welcome, {props.value1}</span>
          <button onClick={props.value2}>Logout</button>
        </nav>
      </header>
    </div>
            )
        }
  return (
    <div>
      <header className='up'>
        <h1>Think Box</h1>
        <nav>
          <span>{props.value3}</span>
          <button onClick={props.value2}>{props.action}</button>
        </nav>
      </header>
    </div>
  )
}

export default Header
