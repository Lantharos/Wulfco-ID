import React, {useState} from 'react'
import Iubenda from 'react-iubenda-policy'

const PrivacyPolicy = () => {
    const ref = React.useRef(null);

    useState(() => {
        if (ref.current) {
            ref.current.load()
            ref.current.show()
            ref.current.click()
        }
    })

  return (
    <div>
        <Iubenda id="31517857" type={"privacy"} ref={ref} />
    </div>
  )
}

export default PrivacyPolicy
