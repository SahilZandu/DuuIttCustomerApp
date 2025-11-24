# Custom CMakeLists.txt for 16KB page size support
# This file provides 16KB alignment configuration for CMake-based native libraries

cmake_minimum_required(VERSION 3.13)

# Enable 16 KB ELF alignment for Android 15+ support
# This ensures all native libraries are aligned to 16KB page boundaries
# Required for Google Play requirements starting November 2025

# Add linker flags for 16KB page size support
# This applies to all targets that link against this configuration
set(CMAKE_SHARED_LINKER_FLAGS "${CMAKE_SHARED_LINKER_FLAGS} -Wl,-z,max-page-size=16384")
set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -Wl,-z,max-page-size=16384")

# Function to apply 16KB alignment to any target
function(apply_16kb_alignment target_name)
    target_link_options(${target_name} PRIVATE "-Wl,-z,max-page-size=16384")
endfunction()

# Note: For pre-built libraries from React Native and dependencies,
# you may need to wait for updated versions or use post-processing tools.
# The align_16kb.sh script can help align libraries after build.

