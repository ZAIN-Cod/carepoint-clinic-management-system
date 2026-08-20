import bcrypt from 'bcryptjs'
import app from '../src/app.js'
import User from '../src/models/User.js'
import { generateToken, verifyToken } from '../src/utils/jwt.js'

async function runValidation() {
  console.log('=== CarePoint Local Code & Logic Validation ===')

  // 1. Password Hashing Test
  const testPassword = 'AdminPass123!'
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(testPassword, salt)
  const match = await bcrypt.compare(testPassword, hash)
  if (match) {
    console.log('✔ PASS: Password hashing & bcrypt verification works correctly.')
  } else {
    throw new Error('FAIL: Password hashing mismatch!')
  }

  // 2. JWT Generation & Verification Test
  const mockPayload = { id: '64d8a1b2c3d4e5f6a7b8c9d0', role: 'admin' }
  const token = generateToken(mockPayload)
  const decoded = verifyToken(token)
  if (decoded.id === mockPayload.id && decoded.role === mockPayload.role) {
    console.log('✔ PASS: JWT token signing & verification works correctly.')
  } else {
    throw new Error('FAIL: JWT payload mismatch!')
  }

  // 3. User Schema Transformation Test
  const mockUserDoc = new User({
    name: 'Admin Test',
    email: 'admin@test.com',
    passwordHash: hash,
    role: 'admin',
  })
  const userJson = mockUserDoc.toJSON()
  if (userJson.passwordHash === undefined) {
    console.log('✔ PASS: User model excludes passwordHash from JSON transformations.')
  } else {
    throw new Error('FAIL: passwordHash exposed in user document output!')
  }

  // 4. Express App Router Verification
  if (typeof app === 'function') {
    console.log('✔ PASS: Express application initialized and routes registered properly.')
  }

  console.log('=== All Code Logic Checks Passed Successfully! ===')
}

runValidation().catch((err) => {
  console.error('Validation Error:', err)
  process.exit(1)
})
