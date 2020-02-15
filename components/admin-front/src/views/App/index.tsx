import React from 'react'

const App: React.FC = () => {
  return (
    <div>
      <p>{process.env.REACT_APP_SOME_ENV}</p>
    </div>
  )
}

export default App
