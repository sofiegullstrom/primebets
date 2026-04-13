console.log('Checking database...')

// Simulate a simple fetch to see what's in the database
fetch('http://localhost:5173')
    .then(() => console.log('Frontend is running'))
    .catch(e => console.error('Frontend error:', e))
