#!/bin/bash

# Set the PATH to include Node.js for React Native CLI
export PATH="/Users/apple/.nvm/versions/node/v22.11.0/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

# Set Node.js executable path
export NODE_EXECUTABLE="/Users/apple/.nvm/versions/node/v22.11.0/bin/node"

# Set React Native specific environment variables
export REACT_NATIVE_CLI_FILE="../node_modules/react-native/cli.js"
export REACT_NATIVE_NODE_EXECUTABLE="/Users/apple/.nvm/versions/node/v22.11.0/bin/node"

# Verify Node.js is accessible
if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js not found in PATH"
    echo "Current PATH: $PATH"
    exit 1
fi

echo "Node.js found at: $(which node)"
echo "Node.js version: $(node --version)"
echo "React Native CLI file: $REACT_NATIVE_CLI_FILE"

# Execute the original gradlew script
exec "$(dirname "$0")/gradlew" "$@"
