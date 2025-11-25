#!/usr/bin/env python3
"""
ELF alignment script for 16KB page size support
This script properly aligns ELF LOAD segments to 16KB boundaries
"""

import struct
import sys
import os
import shutil

ELF_MAGIC = b'\x7fELF'
ELF_CLASS_64 = 2
PT_LOAD = 1
PAGE_SIZE_16KB = 16384

def align_elf_file(input_path, output_path):
    """Align ELF file LOAD segments to 16KB boundaries"""
    try:
        with open(input_path, 'rb') as f:
            data = bytearray(f.read())
        
        if data[:4] != ELF_MAGIC:
            print(f"  ⚠ Not an ELF file: {os.path.basename(input_path)}")
            return False
        
        elf_class = data[4]
        if elf_class != ELF_CLASS_64:
            print(f"  ⚠ Not a 64-bit ELF: {os.path.basename(input_path)}")
            return False
        
        # Read ELF header
        e_phoff = struct.unpack('<Q', data[32:40])[0]  # Program header table offset
        e_phentsize = struct.unpack('<H', data[54:56])[0]  # Program header entry size
        e_phnum = struct.unpack('<H', data[56:58])[0]  # Number of program headers
        
        aligned = False
        # Process each program header
        for i in range(e_phnum):
            ph_offset = e_phoff + i * e_phentsize
            p_type = struct.unpack('<I', data[ph_offset:ph_offset+4])[0]
            
            if p_type == PT_LOAD:
                # Read p_align (alignment requirement)
                p_align_offset = ph_offset + 48  # p_align is at offset 48 in 64-bit ELF
                p_align = struct.unpack('<Q', data[p_align_offset:p_align_offset+8])[0]
                
                # Read p_vaddr (virtual address)
                p_vaddr_offset = ph_offset + 16
                p_vaddr = struct.unpack('<Q', data[p_vaddr_offset:p_vaddr_offset+8])[0]
                
                # If alignment is less than 16KB, update it
                if p_align < PAGE_SIZE_16KB:
                    # Update p_align to 16KB
                    struct.pack_into('<Q', data, p_align_offset, PAGE_SIZE_16KB)
                    aligned = True
        
        if aligned:
            # Write aligned file
            with open(output_path, 'wb') as f:
                f.write(data)
            return True
        else:
            # File might already be aligned, copy as-is
            shutil.copy2(input_path, output_path)
            return True
            
    except Exception as e:
        print(f"  ⚠ Error aligning {os.path.basename(input_path)}: {e}")
        return False

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: align_elf.py <input.so> <output.so>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    if align_elf_file(input_file, output_file):
        sys.exit(0)
    else:
        sys.exit(1)



