#!/usr/bin/env python3
"""Print the C strings in the data segment of the PKLITE-unpacked unf.exe, so the text the
game prints can be read exactly instead of guessed from Ghidra's string labels.

Usage: exe_strings.py <unpacked unf.000.exe> DS:3ef7 3b46 ...
       exe_strings.py <unpacked unf.000.exe> --range 3900 3a00

Offsets are hex, with or without a "DS:" prefix.  Each string is printed repr-style so that
leading spaces (the game indents its continuation lines with them) are visible."""
import struct
import sys

DATA_SEGMENT = 0x30A0


def load_data_segment(path):
    exe = open(path, 'rb').read()
    header = struct.unpack('<14H', exe[:28])
    image = exe[header[4] * 16:]
    return image[DATA_SEGMENT * 16:]


def read_string(data, offset):
    end = data.index(b'\0', offset)
    return data[offset:end].decode('latin1')


def parse_offset(text):
    return int(text.split(':')[-1], 16)


def main(argv):
    if len(argv) < 3:
        sys.exit(__doc__)
    data = load_data_segment(argv[1])
    if argv[2] == '--range':
        start, stop = parse_offset(argv[3]), parse_offset(argv[4])
        offset = start
        while offset < stop:
            value = read_string(data, offset)
            print('DS:%04x %r' % (offset, value))
            offset += len(value) + 1
        return
    for argument in argv[2:]:
        offset = parse_offset(argument)
        print('DS:%04x %r' % (offset, read_string(data, offset)))


if __name__ == '__main__':
    main(sys.argv)
