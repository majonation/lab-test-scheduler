#!/bin/sh

# Run setup script first (migrations and schema push)
/bin/sh ./setup.sh

# Start API server
npm run dev &

# Start scheduler
npm run scheduler &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $? 