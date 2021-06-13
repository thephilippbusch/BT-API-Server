const gatewayURL = process.env.REACT_APP_API_GATEWAY_URL

export const sendGraphql = async (payload, token) => {
  const response = await fetch(`${gatewayURL}/postgres`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Accept: 'application/json',
      Authentication: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  const result = await response.json()
  return result
}

export const sendSignIn = async ({ email, password }) => {
  const response = await fetch(
    `${gatewayURL}/auth/signin?email=${email}&password=${password}`,
    {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
    }
  )
  const result = await response.json()
  return result
}

export const sendSignUp = async ({ email, password, name }) => {
  const response = await fetch(
    `${gatewayURL}/auth/signup?email=${email}&password=${password}&name=${name}`,
    {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
    }
  )
  const result = await response.json()
  return result
}
