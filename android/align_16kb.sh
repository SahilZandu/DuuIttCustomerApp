#!/bin/bash
# Script to align native libraries to 16KB page boundaries
# This fixes pre-built libraries that don't support 16KB page sizes

set -e

# Find llvm-objcopy (part of Android NDK)
NDK_PATH="${ANDROID_NDK_HOME:-$ANDROID_HOME/ndk/26.1.10909125}"
OBJCOPY="${NDK_PATH}/toolchains/llvm/prebuilt/darwin-x86_64/bin/llvm-objcopy"

if [ ! -f "$OBJCOPY" ]; then
    echo "Warning: llvm-objcopy not found at $OBJCOPY"
    echo "Skipping 16KB alignment. Libraries may not support 16KB page sizes."
    exit 0
fi

# Directory containing native libraries
LIBS_DIR="$1"
if [ -z "$LIBS_DIR" ]; then
    echo "Usage: $0 <path_to_libs_directory>"
    exit 1
fi

if [ ! -d "$LIBS_DIR" ]; then
    echo "Directory not found: $LIBS_DIR"
    exit 1
fi

echo "Aligning native libraries to 16KB boundaries in $LIBS_DIR..."

# Find all .so files and align them
find "$LIBS_DIR" -name "*.so" -type f | while read lib; do
    echo "Aligning: $lib"
    "$OBJCOPY" --set-section-alignment .text=16384 \
               --set-section-alignment .rodata=16384 \
               --set-section-alignment .data=16384 \
               --set-section-alignment .bss=16384 \
               "$lib" "$lib.aligned" 2>/dev/null || true
    
    if [ -f "$lib.aligned" ]; then
        mv "$lib.aligned" "$lib"
        echo "  ✓ Aligned: $lib"
    else
        echo "  ⚠ Could not align: $lib (may already be aligned or incompatible)"
    fi
done

echo "Done aligning libraries."

