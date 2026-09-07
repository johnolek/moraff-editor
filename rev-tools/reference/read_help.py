#!/usr/bin/env python3
"""Print the `H1.OVL` .. `H8.OVL` help pages.

Nothing is overlaid: they are plain CP437 text with CRLF line endings, read a
line at a time and painted on the screen.  A leading `~` marks a line the game
draws in its highlight colour, and the runs of dashes are the dot leaders
between an option and its description.

    python3 read_help.py ~/games/rev2/H*.OVL
"""
import argparse


def page(path):
    text = open(path, "rb").read().decode("cp437").replace("\x1a", "")
    return text.replace("\r\n", "\n").rstrip("\n").split("\n")


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("files", nargs="+")
    parser.add_argument("--raw", action="store_true", help="keep the ~ markers")
    args = parser.parse_args()
    for path in args.files:
        print("=" * 72)
        print(path)
        print("=" * 72)
        for line in page(path):
            if not args.raw and line.startswith("~"):
                print("* " + line[1:])
            else:
                print("  " + line)


if __name__ == "__main__":
    main()
